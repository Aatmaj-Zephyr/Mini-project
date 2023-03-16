window.addEventListener('load', () => {
    // registerSW();
    //stopped for login. Else register immediately


});
function test() {
    // registerSW();
    //testing
    addEventToDB("2:30-3:30", "Chess", "B 203", 4)
    removeFromDB(5);
}
registerSW();
// Register the Service Worker
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
function fetchFromFireBase() { //fetch data from firebase


    var eventsReference = firebase.database().ref('Events');
    eventsReference.on('value', (snapshot) => { //on change in value of any event in the database.....
        const data = snapshot.val();

        processData(data);//process the updated data (JSON)




    });

}
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
function processData(data) {
    /*
      Three types of updates
    
    1) Event is added to the list
    2) Event is removed from the list
    3) Event properties are updated
    */



    for (let key in data) {
        newEvents.push(key);
    }
    console.log(oldEvents);
    console.log(newEvents);
    for (let key of oldEvents) {
        if (!newEvents.includes(key)) {
            console.log("Deleted one event with id " + key + " from the list")
            //an Event is deleted from the list


            //continue procedure same as update event
        }
    }

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

    Object.keys(data).forEach(key => {
        obj = data[key];
        console.log("Current id" + key);
        console.log(obj);
        console.log("Name of the event corresponsing to the id" + obj.Name);

        displayNewEvent(obj.Time, obj.Name, obj.playersAcceptance, obj.playersNeeded, obj.Location, key)
    }
    );
    oldEvents = newEvents.copyWithin();
    localStorage.setItem("oldEventsCache", newEvents.toString()); //add to local storage



    data.forEach(obj => {
        console.log(obj);
    });
    console.log("Length of the data is " + data.length);
}


function onEventClick(a) {
    console.log("Event no " + a + " Was selected");
    //temporarily select in player.

    //store the id of the element in local storage
    localStorage.setItem("selectedEvent", a);


    //go to selected event page
    window.location.href = "./SelectedEventPage.html";

    //Call the considerIn function with the parameter a and 0
    //considerIn(a, 0)
    // window.location.href="/eventPage.html";
}

function considerIn(a, p) {
    //p is no of players
    //a is the id of the event (and not the number)

    const db = firebase.database();
    var playersAcceptanceReference = firebase.database().ref('Events/' + a);
    var temp = 0;
    playersAcceptanceReference.once('value', (snapshot) => { //change monitored only once.
        const players = snapshot.val().playersAcceptance;
        console.log(players[p]);
        temp = players[p];
    });
    if (typeof temp == "undefined") {
        //the setting doesnt exist, hence add it as new entity
        firebase.database().ref('Events/' + a + "/playersAcceptance/" + p).set("1");
    }
    else {
        temp = parseInt(temp) + 1
        //setting exists, do +1 on it.
        //the setting doesnt exist, hence add it as new entity
        firebase.database().ref('Events/' + a + "/playersAcceptance/" + p).set("" + temp);
    }
    //now go back to home page
    window.location.href = "./index.html";
}


function addEventToDB(time, name, location, playersNeeded, id) {
    var id = Math.max(...newEvents) + 1

    console.log("The new event will be added at id = " + id)
    firebase.database().ref('Events/' + id).set({

        Name: name,
        Time: time,
        Location: location,
        playersAcceptance: { "0": 1 }, //making it the default that the player who enters the event must be present
        playersNeeded: playersNeeded
    });
}

function removeFromDB(id) {
    firebase.database().ref('Events/' + id).remove();
    console.log("Event removed")

}
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
                  <div class=\" heartVector\" >                                                           \
                      <i class=\"fa fa-heart\" style=\"color:#fa0303; text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;\"></i>\
                  </div>                                                          \
                                                                            \
                  <div class=\" timeSmallDisplay\" id = \"timeOfEvent"+eventID+"\" >                                                          \
                      "+ time + "                                                       \
                  </div>                                                          \
                  <div class=\" playersSmallDisplay\" id = \"playersNeededForEvent"+eventID+"\">                                                           \
                    "+ playersNeeded + "                                                        \
                  </div>                                                                          \
                  <div class=\" "+ "sport" + "Icon\" >                                                         \
                  </div>                                                              \
                  <div class=\" titleSmall\" id = \"titleOfEvent"+eventID+"\" >                                                            \
                      "+ title.toUpperCase() + "                                                          \
                  </div>                                                          \
                  <div class=\" horizontalLine\" >                                                            \
                  </div>                                                          \
                                                                          \
              </div></div>                                                            \
              "
    classNotifications.innerHTML += displayNewEvent

}

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

    Notification.requestPermission().then((result) => {
        if (result === 'granted') {
            notify(notifTitle, options)
        }

    });

}

function notify(notifTitle, options) {

    Notification.requestPermission(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(notifTitle, options);
            });
        }
    });
    console.log("New notification is shown with title: " + notifTitle + ", options: " + options);

}

requestPermission();
function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    });
}
function goBack() {
    window.location.href = './index.html'
}

function loadSite(){
    itemID=localStorage.getItem("selectedEvent");
    console.log(itemID);
    //get data from firebase
    var addEventReference = firebase.database().ref('Events/' + itemID);
    let currplayers;
let currtitle;

addEventReference.once('value', (snapshot) => {
    currplayers = snapshot.val().playersNeeded;
    currtitle = snapshot.val().Name;
    currloc = snapshot.val().Location;
    currtime = snapshot.val().Time;
    
    //set the element id sportName to the sport name fetched from the database
    document.getElementById("sportName").innerHTML = currtitle;
    document.getElementById("location").innerHTML = currloc;
    document.getElementById("time").innerHTML = currtime;
    document.getElementById("players").innerHTML = currplayers;

});

    console.log(currtitle);

}

/*if two files sharing same js file is giving error, then do the following
1) set the data to be added to the local storage
2) Redirect to the main page
3) When the page loads, send the data to the database

This way only one file will need acccess to firebase

*/
