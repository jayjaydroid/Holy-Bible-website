
import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const accountControl = document.getElementById("accountControl");
const signOutButton = document.getElementById("signOutButton");

let signingOut = false;

// Hide the page until authentication is checked.
document.body.style.visibility = "hidden";

// Check the user's login status.
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.replace("./login.html");
        return;
    }

    // Show the Bible website.
    document.body.style.visibility = "visible";

    if (accountControl) {
        accountControl.style.display = "flex";
    }

});

// SIGN OUT FUNCTION
if (signOutButton) {

    signOutButton.addEventListener("click", async (event) => {

        event.preventDefault();

        if (signingOut) return;

        signingOut = true;

        signOutButton.disabled = true;
        signOutButton.textContent = "Signing out...";

        try {

            await signOut(auth);

            // Redirect immediately after signing out.
            window.location.replace("./login.html");

        } catch (error) {

            console.error("Sign out error:", error);

            signingOut = false;
            signOutButton.disabled = false;
            signOutButton.textContent = "Sign Out";

            alert("Unable to sign out. Please try again.");

        }

    });

}
