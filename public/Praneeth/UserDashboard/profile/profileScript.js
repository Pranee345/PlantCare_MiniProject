// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC7DPfCAl03P0mDaW400cnwQ_XzhIutuFo",
    authDomain: "plantcare-43ba1.firebaseapp.com",
    databaseURL: "https://plantcare-43ba1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "plantcare-43ba1",
    storageBucket: "plantcare-43ba1.appspot.com",
    messagingSenderId: "961408963454",
    appId: "1:961408963454:web:869bc3c1ef71966d02192f"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const usernameField = document.getElementById('username');
    const userEmailField = document.getElementById('user-email');
    const userPhoneField = document.getElementById('user-phone');
    const userLocationField = document.getElementById('user-location');
    const photoUpload = document.getElementById('photo-upload');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');

    onAuthStateChanged(auth, user => {
        if (user) {
            const userId = user.uid;

            // Fetch user details from Firestore
            const userDocRef = doc(db, 'users', userId);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    usernameField.textContent = userData.name || 'User';
                    userEmailField.textContent = userData.email || 'user@example.com';
                    userPhoneField.textContent = userData.phone || 'Not provided';
                    userAddressField.textContent = userData.address || 'Not provided';
                    userLocationField.textContent = userData.location || 'Not provided';

                    // Set profile image if available, otherwise use a default icon
                    if (userData.photoURL) {
                        profileImg.src = userData.photoURL;
                    }
                } else {
                    console.log('No user data found!');
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });

            // Photo upload functionality
            uploadPhotoBtn.addEventListener('click', () => {
                photoUpload.click();
            });

            photoUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const storageRef = ref(storage, `profile_photos/${userId}`);
                    uploadBytes(storageRef, file).then(snapshot => {
                        return getDownloadURL(snapshot.ref);
                    }).then(photoURL => {
                        updateDoc(userDocRef, { photoURL });
                        profileImg.src = photoURL;
                        alert('Photo uploaded successfully');
                    }).catch(error => {
                        console.error('Error uploading photo:', error);
                        alert('Failed to upload photo');
                    });
                }
            });
        } else {
            alert('No user signed in');
            window.location.href = 'login.html'; // Redirect to login if not signed in
        }
    });
});
