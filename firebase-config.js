
import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDAcjQQ5GIl2cRwcIlXJwv2xCrsW226IZs",
    authDomain: "holy-bible-online.firebaseapp.com",
    projectId: "holy-bible-online",
    storageBucket: "holy-bible-online.firebasestorage.app",
    messagingSenderId: "718179265954",
    appId: "1:718179265954:web:f4a458e39f349ad38416fb",
    measurementId: "G-E0VJQXNJHM"
};

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);
