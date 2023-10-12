importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyCzj_q9s6UhfZ-mYSAfRdRWWlI47mOinuE",
    authDomain: "commerce-castle-app.firebaseapp.com",
    projectId: "commerce-castle-app",
    storageBucket: "commerce-castle-app.appspot.com",
    messagingSenderId: "392497910088",
    appId: "1:392497910088:web:ecdd2acbbe577c6265637d",
    measurementId: "G-H0K55ZER4E"
});
const messaging = firebase.messaging();