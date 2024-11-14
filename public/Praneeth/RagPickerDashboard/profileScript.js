import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7DPfCAl03P0mDaW400cnwQ_XzhIutuFo",
    authDomain: "plantcare-43ba1.firebaseapp.com",
    databaseURL: "https://plantcare-43ba1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "plantcare-43ba1",
    storageBucket: "plantcare-43ba1.appspot.com",
    messagingSenderId: "961408963454",
    appId: "1:961408963454:web:869bc3c1ef71966d02192f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const firstNameField = document.getElementById('username');
    // const lastNameField = document.getElementById('last-name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const photoUpload = document.getElementById('photo-upload');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const userDocRef = doc(db, 'ragpicker', userId);

            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    firstNameField.value = userData.username || '';
                    emailField.value = userData.email || '';
                    phoneField.value = userData.phone || '';

                    if (userData.photoURL) {
                        profileImg.src = userData.photoURL;
                    }
                } else {
                    console.log('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

            photoUpload.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (file) {
                    try {
                        const storageRef = ref(storage, `profile_photos/${userId}`);
                        await uploadBytes(storageRef, file);
                        const photoURL = await getDownloadURL(storageRef);

                        await updateDoc(userDocRef, { photoURL });
                        profileImg.src = photoURL;
                        alert('Photo uploaded successfully');
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                        alert('Failed to upload photo');
                    }
                }
            });
        } else {
            window.location.href = '../../login/login.html';
        }
    });
});
