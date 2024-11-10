import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7DPfCAl03P0mDaW400cnwQ_XzhIutuFo",
    authDomain: "plantcare-43ba1.firebaseapp.com",
    projectId: "plantcare-43ba1",
    storageBucket: "plantcare-43ba1.firebasestorage.app",
    messagingSenderId: "961408963454",
    appId: "1:961408963454:web:869bc3c1ef71966d02192f"
};

// Initialize Firebase, Firestore, and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

document.querySelector('#registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = new URLSearchParams(window.location.search).get("type");

    // Validate inputs with regex
    const usernameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!usernameRegex.test(username)) {
        alert('Invalid username format');
        return;
    }
    if (!emailRegex.test(email)) {
        alert('Invalid email format');
        return;
    }
    if (!phoneRegex.test(phone)) {
        alert('Invalid phone number format');
        return;
    }
    if (!passwordRegex.test(password)) {
        alert('Password must be 6-20 characters long, include at least 1 digit, 1 uppercase, and 1 lowercase');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        // Check if the username or email already exists in Firestore
        const usersRef = collection(database, 'users');
        const usernameQuery = query(usersRef, where('username', '==', username));
        const emailQuery = query(usersRef, where('email', '==', email));

        const usernameSnapshot = await getDocs(usernameQuery);
        const emailSnapshot = await getDocs(emailQuery);

        if (!usernameSnapshot.empty) {
            alert('Username already exists. Please choose a different one.');
            return;
        }
        if (!emailSnapshot.empty) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        // Use Firebase Authentication to create a user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store data in Firestore
        await setDoc(doc(database, 'users', user.uid), {
            username,
            email,
            phone,
            location,
            password,
            type: userType
        });

        alert('Registration successful! Please check your email for verification.');
        window.location.href = '../../login/login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred while registering. Please try again later.');
    }
});
