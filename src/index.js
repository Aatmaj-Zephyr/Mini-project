/* The  code is adding an event listener to the window object that listens for the "load" event.
Once the window has finished loading, it executes the code inside the callback function. */
window.addEventListener('load', () => {
    /***** */
    //other initialization tasks
    localStorage.setItem("ifNum", 5);
   
    checkSubscribedEvents();


    //test();
    /****** */
     registerSW();
    //stopped for login. Else register immediately


});

/**
 * The function calls two other functions, one to add an event to a database and another to remove an
 * item from the database.
 */
function test() {
    // registerSW();
    //testing
    addEventToDB("2:30-7:30", "Chess", "B 203",2,"23")
  //  removeFromDB(5);
}

registerSW();
// Register the Service Worker

/**
 * This function registers a service worker for an app and logs the registration status and scope.
 */
async function registerSW() {
    console.log('Registering service worker for app');


    try {
        await navigator
            .serviceWorker.register("/Mini-project/serviceWorker.js")



            .then(function (registration) {
                console.log('Service worker (app) successfully registered.');
                console.log(registration.scope);

            })
    }
    catch (e) {
        console.log('SW registration for app failed');
        console.log(e.message);
    }
}
/**
 * This function fetches data from Firebase and processes the updated data.
 */
function fetchFromFireBase() { //fetch data from firebase
    registerSW();

    var eventsReference = firebase.database().ref('Events');
    eventsReference.on('value', (snapshot) => { //on change in value of any event in the database.....
        const data = snapshot.val();

        processData(data);//process the updated data (JSON)




    });

}
/**
 * The function configures Firebase and initializes local storage for event caching.
 */
function firebaseConfigure() {
    const firebaseConfig = {
        apiKey: "AIzaSyA4DEsfJ0EZJRqEoGVYWEcHo53I1flmgPA",
        authDomain: "mini-project-sem-3.firebaseapp.com",
        databaseURL: "https://mini-project-sem-3-default-rtdb.firebaseio.com",
        projectId: "mini-project-sem-3",
        storageBucket: "mini-project-sem-3.appspot.com",
        messagingSenderId: "881818336366",
        appId: "1:881818336366:web:e5bf2fb22315ce1b7eba7f",
        measurementId: "G-0LZFL2KQCV"
    };
    firebase.initializeApp(firebaseConfig);
    fetchFromFireBase();



}
var eventID = 1;
var newEvents = [];

try {
    var oldEvents = localStorage.getItem('oldEventsCache').split(",");// sorround try catch
}
catch (error) {
    //first time making 

    localStorage.setItem("oldEventsCache", [].toString());

}

/**
 * The `processData` function handles adding, removing, and updating events in a list and also displays
 * notifications and updates the local storage.
 * @param data - The `data` parameter is an object containing information about events, with each key
 * representing the ID of an event and the corresponding value being an object containing properties
 * such as the event name, time, location, and number of players needed/accepted. The `processData`
 * function uses this data to update
 */
function processData(data) {
    /*
      Three types of updates
    
    1) Event is added to the list
    2) Event is removed from the list
    3) Event properties are updated
    */


    //Remove expired events by checking date and time of event
    checkTime(data);


    for (let key in data) {
        newEvents.push(key);
    }
    console.log(oldEvents);
    console.log(newEvents);

    /* The  code is iterating through an array called `oldEvents` using a `for...of` loop. For
    each element in the array, it checks if it is not included in another array called `newEvents`
    using the `includes()` method. If the element is not included in `newEvents`, it logs a message
    to the console saying that an event with that ID has been deleted from the list. After that, the
    code continues with the same procedure as updating an event. */
    for (let key of oldEvents) {
        if (!newEvents.includes(key)) {
            console.log("Deleted one event with id " + key + " from the list")
            //an Event is deleted from the list


            //continue procedure same as update event
        }
    }

    /* The  code is iterating through an array called `newEvents` and checking if each element is
    not included in another array called `oldEvents`. If an element is not included in `oldEvents`,
    it logs a message to the console saying that an event with a specific ID has been added to the
    list. It also calls a function called `showNotification` with some data related to the event
    that was added. */
    for (let key of newEvents) {
        if (!oldEvents.includes(key)) {
            console.log("Added one event with id " + key + " to the list");
            //new notifcation add
            showNotification(data[key].Time, data[key].Name, data[key].playersAcceptance, data[key].playersNeeded, data[key].location);
            //an Event is added to the list, continue to updates 
        }
    }

    //Event updates, no notifications. 

    var classNotifications = document.querySelector(".classNotifications")
    classNotifications.innerHTML = "" //clear old data

    /* The  code is iterating through an object called "data" using the Object.keys() method. For
    each key in the object, it logs the current id, the object associated with that id, and the name
    of the event corresponding to that id. It then calls a function called "displayNewEvent" with
    various properties of the object as arguments. Finally, it copies the contents of a variable
    called "newEvents" into a variable called "oldEvents" and saves the contents of "newEvents" as a
    string in local storage under the key "oldEventsCache". */
    Object.keys(data).forEach(key => {
        obj = data[key];
        console.log("Current id" + key);
        console.log(obj);
        console.log("Name of the event corresponsing to the id" + obj.Name);
        
        displayNewEvent(obj.Time, obj.Name, obj.playersAcceptance, obj.playersNeeded, obj.Location, key)
    }
    );

    checkSubscribedEvents(); // check subscribed events after each change

    oldEvents = newEvents.copyWithin();
    localStorage.setItem("oldEventsCache", newEvents.toString()); //add to local storage



    
    console.log("Length of the data is " + data.length);
}

function checkTime(data) {
    Object.keys(data).forEach(key => 
        {
        obj = data[key];
        console.log("\nCheking time for current id " + key);
        var time = obj.Time;
        console.log("Time of the event corresponsing to the id " + time);

        //convert time string to end time
        var endTime = time.split("-")[1]; // get end time

        var eventDate = obj.Date;
        
       /* The code is checking if the date of an event (represented by the variable `eventDate`) is in
       the past (i.e. less than the current date). If the event date is in the past, it logs a
       message indicating that the event is over and removes the event from a database by calling
       the `removeFromDB()` function with the event's ID (represented by the variable `key`). The
       code also logs the event date to the console for debugging purposes. */
        if(eventDate < new Date().getDate()){ //check date, remove past date events
            console.log("Date of the event is over...");
            console.log("Deleting event with id " + key);
            removeFromDB(key);
        }
        console.log("Date of the event"+eventDate);

        
        /* The below code is checking if the current date matches the date of a particular event. If it
        does, it then checks the current time and compares it with the end time of the event. If the
        end time of the event has already passed, it removes the event from the database. The code
        is written in JavaScript. */

        if(eventDate == new Date().getDate()){ //if date is todsy then cheeck time
            
        //get current time
        const now = new Date(); // create a new Date object with the current date and time
        const hours = now.getHours(); // get the current hour (0-23)
        const minutes = now.getMinutes(); // get the current minute (0-59)

       
        console.log(`The current time is ${hours}:${minutes}`); // output the current time in the console
        
            endHrs= parseInt(endTime.split(":")[0]);
            endMin=parseInt(endTime.split(":")[1]);
       
        //convert clock formats to 24 hr
        if(endHrs<9){
            endHrs= endHrs + 12;
        }

        console.log("Event ends on "+endHrs+":"+endMin); 

        // check if time exeeds current time only hours. Remove event
        if( endHrs < hours ) {

            
            console.log("Time of the event is over...");
            console.log("Deleting event with id " + key);
            removeFromDB(key);
            
        }
    }
    }
    );
    
}

function onEventClick(a) {
    console.log("Event no " + a + " Was selected");
    //temporarily select in player.

    //store the id of the element in local storage
    localStorage.setItem("selectedEvent", a);


    //go to selected event page
    window.location.href = "./SelectedEventPage.html";

    //Call the considerIn function with the parameter a and 0
    //considerIn(a, 0) //testing
    // window.location.href="/eventPage.html";
}

/**
 * The function updates the number of players who have accepted an event invitation in a Firebase
 * database and redirects the user to the home page.
 * @param a - The ID of an event (not the number).
 * @param p - The parameter `p` represents the index of the player in the `playersAcceptance` array for
 * a particular event. It is used to keep track of the number of times a player has accepted an event
 * invitation.
 */

function considerIn(a, p) {
    console.log("consider in called");
    subscribe(a); // the user is interested in the event.

   // prevent duplication (but later)
    //if(!localStorage.getItem("subscribedEvents").split(",").includes(id)){
    //}
    //p is no of players
    //a is the id of the event (and not the number)

    const db = firebase.database();
    var playersAcceptanceReference = firebase.database().ref('Events/' + a);
    var noofplayers = 0;
    playersAcceptanceReference.once('value', (snapshot) => { //change monitored only once.
        const players = snapshot.val().playersAcceptance;
        console.log(players[p]);
        noofplayers = players[p];
    });

     //setting exists, do +1 on it.
        noofplayers = parseInt(noofplayers) + 1
    
    //else make 1
    if(isNaN(noofplayers)){
        noofplayers=1;
    }
       
        firebase.database().ref('Events/' + a + "/playersAcceptance/" + p).set("" + noofplayers);
    

    //now go back to home page
    window.location.href = "./index.html";
}

/**
 * The function checks if a certain value exists in local storage and calls another function with that
 * value if it does, otherwise it sets the value in local storage and calls the function with a default
 * value.
 * @param a - The parameter `a` is a value that will be passed as an argument to the `considerIn`
 * function. It is not specified what type of value `a` should be, as it depends on the implementation
 * of the `considerIn` function.
 */
function considerInIf(a) {
    if (localStorage.getItem("ifNum")) {
        considerIn(a, localStorage.getItem("ifNum"))
    }
    else {
        localStorage.setItem("ifNum", 5);
        considerIn(a, localStorage.getItem("ifNum"))
    }
    subscribe(a); // the user is interested in the event.
}

/**
 * The function increments a number stored in local storage and updates the value displayed on a
 * webpage.
 */
function up() {
    if (localStorage.getItem("ifNum")) {
        localStorage.setItem("ifNum", parseInt(localStorage.getItem("ifNum")) + 1);
    }
    else {
        localStorage.setItem("ifNum", 5);
    }

    document.getElementById('ifNumIndicator').innerHTML = localStorage.getItem("ifNum");
}
/**
 * The function decreases the value of "ifNum" in localStorage by 1 or sets it to 5 if it doesn't
 * exist, and updates the HTML element with the id "ifNumIndicator" to display the new value.
 */

function down() {
    if (localStorage.getItem("ifNum")) {
        localStorage.setItem("ifNum", parseInt(localStorage.getItem("ifNum")) - 1);
    }
    else {
        localStorage.setItem("ifNum", 5);
    }

    document.getElementById('ifNumIndicator').innerHTML = localStorage.getItem("ifNum");
}

/**
 * The function adds a new event to a Firebase database with specified details and a default player
 * acceptance value.
 * @param time - The time of the event in a specific format (e.g. "2021-08-15T14:30:00").
 * @param name - The name of the event that is being added to the database.
 * @param location - The location parameter is a string that represents the location of the event. It
 * could be a physical address, a venue name, or any other description of the event's location.
 * @param playersNeeded - The number of players needed for the event.
 * @param id - The id parameter is the unique identifier for the event being added to the database. It
 * is generated by finding the maximum value of existing event ids and adding 1 to it.
 */
function addEventToDB(time, name, location, playersNeeded,date) {
    var id =  Math.floor(Math.random() * 600) + 1


  //debugging   window.alert(date);
    console.log("The new event will be added at id = " + id)
    firebase.database().ref('Events/' + id).set({

        Name: name,
        Time: time,
        Location: location,
        playersAcceptance: { "0": 1 }, //making it the default that the player who enters the event must be present
        playersNeeded: playersNeeded,
        Date:date,
        User:localStorage.getItem('User')
    });
}

function addEventToDBFromHTML(){
        firebaseConfigure();
        var name = document.getElementById("name").value;
        var time = getTime();
        var location = document.getElementById("location").value;
        var playersNeeded = document.getElementById("playersNeeded").value;
        var date = document.getElementById("day").value;
        if(date=="item1"){
            // set todays date
            date = new Date();
        }
        else{
            // set tomorrow's date
            date = new Date();
            date.setDate(date.getDate() + 1)
        }
        console.log("Fetched data from form");
        addEventToDB(time, name, location, playersNeeded,date.getDate());

        // pause for 2 seconds then redirect
      
        setTimeout(function () {
            window.location.href="./index.html";
        },2000)
    
}


function getTime(){
  //extract time
  var startTime= document.getElementById("sthr").value+":"+document.getElementById("stmin").value;
  var endTime= document.getElementById("ethr").value+":"+document.getElementById("etmin").value;

  
  var time = startTime+"-"+endTime;
  console.log(time);
  return time;
}

/**
 * This function removes an event from a Firebase database based on its ID.
 * @param id - The id parameter is a string that represents the unique identifier of the event that
 * needs to be removed from the Firebase Realtime Database.
 */
function removeFromDB(id) {
    firebase.database().ref('Events/' + id).remove();
    console.log("Event removed")

}

/**
 * The function displays a new event with its details on the HTML page.
 * @param time - The time of the event in a string format.
 * @param title - The title of the event being displayed.
 * @param players - An array of players who have already joined the event.
 * @param playersNeeded - The number of players needed for the event.
 * @param location - The location parameter is a string that represents the location of the event. It
 * is not currently being used in the function, but it may be used in later steps.
 * @param eventID - The ID of the event in the database.
 */
function displayNewEvent(time, title, players, playersNeeded, location, eventID) {

    //eventID is the id of the event in db
    console.log("New Event");

    var classNotifications = document.querySelector(".classNotifications")

    // players and location will be used for later steps
    var displayNewEvent =
        /* A string which is being added to the html file. This is innerhtml and contains the data. */
        "   \
              <div class=\" notificationClass"+ eventID + "\"   onclick=\" onEventClick(" + eventID + ")\" > \
              <div class=\" notificationsSport" + "\" >                                                            \
                                                                         \
                                                                            \
                  <div class=\" timeSmallDisplay\" id = \"timeOfEvent"+ eventID + "\" >                                                          \
                      "+ time + "                                                       \
                  </div>                                                          \
                  <div class=\" playersSmallDisplay\" id = \"playersNeededForEvent"+ eventID + "\">                                                           \
                    "+ checkEventsAlgo(players)+"/"+playersNeeded + "                                                        \
                  </div>                                                                          \
                  <div class=\" "+ "sport" + "Icon\" >                                                         \
                  </div>                                                              \
                  <span class=\" titleSmall\" id = \"titleOfEvent"+ eventID + "\" >                                                            \
                      "+ title.toUpperCase() + "                                                          \
                  </span>                                                          \
                  <div class=\" horizontalLine\" >                                                            \
                  </div>                                                          \
                                                                          \
              </div></div>                                                            \
              "
    classNotifications.innerHTML += displayNewEvent

}

/**
 * The function sends a notification with information about a new sport added, including the title,
 * number of players needed, and location.
 * @param time - The "time" parameter is not used in the function and therefore is not relevant to the
 * function's functionality. It is not clear what it was intended to represent.
 * @param title - The title of the new sport being added.
 * @param players - The parameter "players" is not used in the function and therefore it is not
 * relevant to the function's functionality. It is likely that it was intended to be used for something
 * else but was not implemented in the code.
 * @param playersNeeded - The number of players needed for the new sport that is being added.
 * @param location - The `location` parameter is not used in the `showNotification` function. It is not
 * necessary for sending the notification.
 */
function showNotification(time, title, players, playersNeeded, location) {
    //send notification from app
    const notifTitle = title;
    const notifBody = `New sport` + " " + title + ' is added with ' + playersNeeded;
    const notifImg = `https://threeoakscs.org/wp-content/uploads/2018/01/cropped-android-icon-192x192.png`;
    const options = {
        body: notifBody, //body of app
        icon: notifImg, //icon of app
        vibrate: [200, 100, 200]
    };

    ////////////////////////////////////////////////////////////////

 console.log("Sending notification ");
            notify(notifTitle, options);
     



}

/**
 * This function requests permission to show a notification and displays it with the given title and
 * options.
 * @param notifTitle - A string that represents the title of the notification that will be displayed.
 * @param options - The `options` parameter is an object that contains various properties to customize
 * the notification. Some of the common properties are:
 */
function notify(notifTitle, options) {

    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(notifTitle, options);
                Notification.show();
            });
        }
    });
    console.log("New notification is shown with title: " + notifTitle + ", options: " + options);

}

requestPermission();

/**
 * This function requests permission for notifications and logs a message if permission is granted.
 */
function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    });
}

/**
 * The function redirects the user to the index.html page.
 */
function goBack() {
    window.location.href = './index.html'
}

/**
 * The function loads data from Firebase and updates the HTML elements on the webpage with the fetched
 * data.
 */


function loadSite() { //only for eventPage ideally
    itemID = localStorage.getItem("selectedEvent");
    console.log(itemID);
    //get data from firebase
    var addEventReference = firebase.database().ref('Events/' + itemID);
    let currplayers;
    let currtitle;

   /* The below code is fetching data from a Firebase database using the `once()` method and setting
   the values of certain HTML elements based on the fetched data. It retrieves the number of players
   needed, the name of the event, the number of players who have accepted the event, the location,
   time, and date of the event. It then sets the innerHTML of certain HTML elements to display this
   information. Additionally, it checks the date of the event and sets the innerHTML of another HTML
   element to display "Today" or "Tomorrow" accordingly. */
    addEventReference.once('value', (snapshot) => {
        currplayers = snapshot.val().playersNeeded;
        currtitle = snapshot.val().Name;
        curracceptplayers = snapshot.val().playersAcceptance;
        currloc = snapshot.val().Location;
        currtime = snapshot.val().Time;
        currDate = snapshot.val().Date;
        curruser=snapshot.val().User;

        //set the element id sportName to the sport name fetched from the database
        document.getElementById("sportName").innerHTML = currtitle;
        document.getElementById("location").innerHTML = currloc;
        document.getElementById("time").innerHTML = currtime;
        document.getElementById("players").innerHTML = checkEventsAlgo(curracceptplayers)+"/"+currplayers; //need algorithm here
        document.getElementById("byuser").innerHTML = "Hosted by "+curruser  ;
        //check date (if today or not) and arrange the html accordingly.
        if(currDate == new Date().getDate())
       { document.getElementById("Day").innerHTML = "Today";}
       else{
        document.getElementById("Day").innerHTML = "Tomorrow";
       }
    });

    console.log(currtitle);

}

/*if two files sharing same js file is giving error, then do the following
1) set the data to be added to the local storage
2) Redirect to the main page
3) When the page loads, send the data to the database

This way only one file will need acccess to firebase

*/

//checkEventsAlgo();//testing
/**
 * The function checks if a specified number of people can attend an event based on their acceptance
 * status and logs a message accordingly.
 * @param playersAcceptance - an object containing the number of players who have accepted an event
 * invitation for different numbers of expected attendees. The keys represent the number of expected
 * attendees and the values represent the number of players who have accepted the invitation for that
 * number of attendees.
 * @returns the final value of the `sum` variable.
 */
function checkEventsAlgo(playersAcceptance){
  //  var playersAcceptance = { "0": "2", "5": "2", "3": "1" } //pass
  //  var playersAcceptance = { "0": "2", "5": "2", "4": "1" } //fail
    //iterate through the object and log the values
    for (var key in playersAcceptance) {
        console.log("If "+key+" people come, then "+playersAcceptance[key]+" people come");
    }

    //algo
    var sum = 0;

   /* The below code is iterating through an object called `playersAcceptance` using a `for...in` loop.
   It is calculating the sum of the values in the object and checking if the sum is greater than or
   equal to the key. If the sum is greater than or equal to the key, it logs a message saying that
   the specified number of people are coming. If the sum is less than the key, it logs a message
   saying that it is not possible for the specified number of people to come. The code also resets
   the sum if the specified number of people cannot come. */
    for (var key in playersAcceptance) {
        sum=sum+parseInt(playersAcceptance[key]);
        if(sum>=key)
      { 
        console.log("If "+key+" people come, then "+playersAcceptance[key]+" people come...These people are comming");
          
            }
            else{
                console.log("Not possible for "+key+" people");
                sum=sum-parseInt(playersAcceptance[key]); //reset

            }
            console.log("Sum="+sum)    
    }
return sum;
}

/**
 * The function adds an event ID to the local storage array if the user is interested in the event and
 * prevents duplication.
 * @param id - The id parameter is the unique identifier of an event that the user wants to subscribe
 * to. It is used to add the event id to the local storage array of subscribed events.
 */

function subscribe(id){
    //The user is interested in the event. 
    //Add the event id to the local storage array
    if(localStorage.getItem("subscribedEvents")==null){
        localStorage.setItem("subscribedEvents",id);
    }
    if(localStorage.getItem("subscribedEvents")==''){
        localStorage.setItem("subscribedEvents",id);
    }
    else{
        //prevent duplication 
        if(!localStorage.getItem("subscribedEvents").split(",").includes(id)){
       
    localStorage.setItem("subscribedEvents", localStorage.getItem("subscribedEvents")+","+id);
        
        console.log(localStorage.getItem("subscribedEvents"));
        }
    }
 //testing   window.alert(localStorage.getItem("subscribedEvents"));


}

/**
 * The function checks if subscribed events have enough players to meet the requirement and sends a
 * notification if they do.
 */
function checkSubscribedEvents(){
    //for every event sotred in subscribed Events local storage, check if the number of people which can come exeeds the requirement or not. If it exeeds requirement, then send notification that the event is happening
    var temp = localStorage.getItem("subscribedEvents").split(","); //important line code will give error if removed
    for (key in temp){
        id = temp[key]; //event id 
        console.log("Event " + id + "has been subscribed. ");
       
       /* The below code is accessing the Firebase Realtime Database and retrieving the values of
       "playersNeeded" and "playersAcceptance" from the "Events" node with the specified ID. The
       retrieved values are then stored in the variables "playersNeeded" and "playersData",
       respectively. */
        
       var playersData;
       var playersNeeded;
       var name;
       var time;
       var loc;
        firebase.database().ref('Events/' + id).once('value', (snapshot) => {
        playersNeeded = snapshot.val().playersNeeded;
        playersData = snapshot.val().playersAcceptance;
         name = snapshot.val().Name;
        time = snapshot.val().Time;
        loc = snapshot.val().Location;});


        /* The below code is checking if a certain event is going to happen based on the number of
        players who have signed up for it. If the number of players who have signed up is greater
        than or equal to the required number of players, then a notification is sent and the event
        is removed from the local storage. Finally, a window alert is displayed to inform the user
        that the event is going to happen. */
        if(checkEventsAlgo(playersData)>=playersNeeded){
            console.log("Event " + id + " is going to happen. So sending notification ");

            //remove from the local storage
            var arr=  localStorage.getItem("subscribedEvents").split(",")
            arr.splice(key,1);
            localStorage.setItem("subscribedEvents",arr.join(","));
            console.log(localStorage.getItem("subscribedEvents"));

            //send notification

            const notifBody = "Event " + name + " is going to happen from "+ time +" At "+loc+" So sending notification "
              const notifImg = `https://threeoakscs.org/wp-content/uploads/2018/01/cropped-android-icon-192x192.png`;
            const options = {
                body: notifBody, //body of app
                icon: notifImg, //icon of app
                vibrate: [200, 100, 200]
            };
            const notifTitle = "You are invited";
            Notification.requestPermission().then((result) => {
                console.log(result);
                if (result === 'granted') {
                    notify(notifTitle, options);
                }
                else{
                    console.log("Permisoin mising");
                }
        
            });

            window.alert("Event " + id + " is going to happen. So sending notification "); //testing 


    }
}
}
