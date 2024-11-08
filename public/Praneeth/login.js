import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7DPfCAl03P0mDaW400cnwQ_XzhIutuFo",
    authDomain: "plantcare-43ba1.firebaseapp.com",
    projectId: "plantcare-43ba1",
    storageBucket: "plantcare-43ba1.firebasestorage.app",
    messagingSenderId: "961408963454",
    appId: "1:961408963454:web:869bc3c1ef71966d02192f"
};

// Initialize Firebase and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelector('#login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    // Get form values
    const role=document.querySelector('#role').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            alert('Please verify your email first!');
            return;
        }

        alert('Login successful!');
        // Redirect based on user type or role
        window.location.href =role=='users'? 'Userdashboard/profile/page.html': 'Ragpicker/page.html'; // Or adjust based on the user's role
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message);
    }
});
