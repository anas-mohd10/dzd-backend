// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCzj_q9s6UhfZ-mYSAfRdRWWlI47mOinuE",
  authDomain: "commerce-castle-app.firebaseapp.com",
  projectId: "commerce-castle-app",
  storageBucket: "commerce-castle-app.appspot.com",
  messagingSenderId: "392497910088",
  appId: "1:392497910088:web:ecdd2acbbe577c6265637d",
  measurementId: "G-H0K55ZER4E"
});



// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();