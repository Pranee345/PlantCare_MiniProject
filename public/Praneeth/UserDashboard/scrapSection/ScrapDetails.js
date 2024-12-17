//ScrapDetails.js content

// Firestore and Auth configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7DPfCAl03P0mDaW400cnwQ_XzhIutuFo",
    authDomain: "plantcare-43ba1.firebaseapp.com",
    projectId: "plantcare-43ba1",
    storageBucket: "plantcare-43ba1.firebasestorage.app",
    messagingSenderId: "961408963454",
    appId: "1:961408963454:web:869bc3c1ef71966d02192f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Store the current signed-in user's UID
let currentUserId = null;

// Monitor user authentication status
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid; // Get the UID of the signed-in user
    }
});

// Function to handle item selection
let selectedItems = [];
function selectItem(element) {
    const name = element.getAttribute('data-name');
    const category = element.closest('.category').querySelector('.category-title').innerText;

    const item = {
        name,
        category
    };

    const existingItemIndex = selectedItems.findIndex(i => i.name === name && i.category === category);

    if (existingItemIndex === -1) {
        selectedItems.push(item);
        element.style.backgroundColor = "#d1e7dd";
        element.style.border = "2px solid #0f5132";
    } else {
        selectedItems.splice(existingItemIndex, 1);
        element.style.backgroundColor = "";
        element.style.border = "";
    }
}

// Function to handle navigation to the next page
function navigateToNext() {
    if (selectedItems.length === 0) {
        alert("Please select at least one item before proceeding.");
        return;
    }
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    window.location.href = 'pickupDate.html';
}

// Function to handle form submission and store data in Firestore
async function handleSubmit() {
    const weight = document.getElementById('weight').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;

    if (!date || !weight || !location) {
        displayMessage("Please fill in all required fields.", "error");
        return;
    }

    const items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    if (items.length === 0) {
        displayMessage("No items selected. Please go back and select items.", "error");
        return;
    }

    if (!currentUserId) {
        displayMessage("User is not signed in. Please log in first.", "error");
        return;
    }

    try {
        // Add data to Firestore with userId
        const docRef = await addDoc(collection(db, 'scrap_orders'), {
            userId: currentUserId, // Store the user ID
            items,  // Save selected items
            weight, // Save weight input
            date,   // Save date input
            location,  // Save location
            timestamp: new Date() // Save timestamp
        });

        // Trigger the email notification to ragpickers
        displayMessage("Order has been successfully submitted.", "success");
        localStorage.removeItem('selectedItems'); // Clear selected items
        setTimeout(() => {
            window.location.href = '../HomePage/HomePage.html'; // Redirect to a success page
        }, 4000);
    } catch (error) {
        console.error("Error adding document: ", error);
        displayMessage("Failed to submit the order. Please try again.", "error");
    }
}

// Function to display messages on the webpage
function displayMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerText = message;
        messageContainer.className = type === "success" ? "message-success" : "message-error";
        messageContainer.style.display = "block";
    }
}

// Export functions for usage in HTML files
export { selectItem, navigateToNext, handleSubmit };
