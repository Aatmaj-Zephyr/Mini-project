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