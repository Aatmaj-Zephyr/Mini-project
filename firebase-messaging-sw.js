self.addEventListener("load", function (event) {

  var likesCountRef = firebase.database().ref('Event');
  likesCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    const options = {
      body: "notifBody", //body of app
     
    }; 
   new Notification(data.Name, options);
  });
  console.log("o");
  });