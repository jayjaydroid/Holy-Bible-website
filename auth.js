
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

const signInButton = document.getElementById("googleSignInButton");
const signOutButton = document.getElementById("signOutButton");

const accountMenu = document.getElementById("accountMenu");
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountAvatar = document.getElementById("accountAvatar");

signInButton.addEventListener("click", async () => {
  signInButton.disabled = true;
  signInButton.textContent = "Opening Google...";

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google sign-in error:", error);

    alert(
      "Google sign-in failed: " + error.message
    );
  } finally {
    signInButton.disabled = false;
    signInButton.textContent = "Sign in with Google";
  }
});

signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
    alert("Unable to sign out. Please try again.");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.hidden = true;
    accountMenu.hidden = false;

    accountName.textContent =
      user.displayName || "Bible Reader";

    accountEmail.textContent =
      user.email || "";

    accountAvatar.textContent =
      (user.displayName || user.email || "U")
        .charAt(0)
        .toUpperCase();

  } else {
    signInButton.hidden = false;
    accountMenu.hidden = true;
  }
});
