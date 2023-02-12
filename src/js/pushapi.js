const enableNotificationsButtons = document.querySelectorAll('.enable-notifications'); 

const askForNotificationPermission = () => { 
      Notification.requestPermission(result => { 
      if (result === 'granted') { 
          displayConfirmNotification();
          // configurePushSubscription(); 
      } 
   }); 
}; 

if ('Notification' in window) {
      for (let i = 0; i < enableNotificationsButtons.length; i++) { 
          enableNotificationsButtons[i].style.display = 'inline-block'; 
          enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission); 
      } 
} 
const displayConfirmNotification = () => { 
    if ('serviceWorker' in navigator) { 
       const options = {
             body: 'You successfully subscribed to our Notification service!',
             icon: 'src/images/icons/app-icon-96x96.png',
             image: 'src/images/main-image-sm.jpg',
             dir: 'ltr',
             lang: 'en-US',
             badge: 'src/images/icons/app-icon-96x96.png',
             tag: 'confirm-notification',
             actions: [ 
                {
                     action: 'confirm',
                     title: 'Okay',
                     icon: 'src/images/icons/app-icon-96x96.png' 
                 }, 
                 {
                     action: 'cancel',
                     title: 'Cancel',
                     icon: 'src/images/icons/app-icon-96x96.png' 
                   
                 } 
             ] 
      }; 
      navigator.serviceWorker.ready 
        .then(sw => sw.showNotification('Successfully subscribed!', options));
    } 
}; 
