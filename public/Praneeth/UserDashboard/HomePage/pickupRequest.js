import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
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
const database = getFirestore(app);
const auth = getAuth(app);

let userId;

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid; // Store the user ID
        fetchUserScrapOrders(userId);
    } else {
        console.log("User not logged in.");
        window.location.href = "login.html"; // Redirect to login if not logged in
    }
});

// Function to fetch scrap orders for the current user
async function fetchUserScrapOrders(userId) {
    const ordersRef = collection(database, "scrap_orders");
    const q = query(ordersRef, where("userId", "==", userId)); // Query to filter by user ID

    try {
        const querySnapshot = await getDocs(q);
        const ordersContainer = document.getElementById("orders-container");

        if (querySnapshot.empty) {
            displayMessage("You have no scrap orders yet.");
            ordersContainer.innerHTML = `<div class="no-orders">No scrap orders found for your account.</div>`;
            return;
        }

        // Clear container before adding orders
        ordersContainer.innerHTML = "";

        // Display orders in cards
        querySnapshot.forEach((doc) => {
            const orderData = doc.data();
            const orderElement = createOrderCard(orderData);
            ordersContainer.appendChild(orderElement);
        });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        displayMessage("Failed to fetch your orders. Please try again later.");
    }
}

// Function to create an order card dynamically
function createOrderCard(orderData) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    orderCard.innerHTML = `
        <div class="order-title">Order Details</div>
        <div class="order-details">
            <p><span>Items:</span> ${orderData.items.map(item => `${item.name} (${item.category})`).join(', ')}</p>
            <p><span>Weight:</span> ${orderData.weight} kg</p>
            <p><span>Date:</span> ${orderData.date}</p>
            <p><span>Location:</span> ${orderData.location}</p>
        </div>
        <div class="timestamp">Placed on: ${new Date(orderData.timestamp.toDate()).toLocaleString()}</div>
    `;
    return orderCard;
}

// Function to display messages
function displayMessage(message) {
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerText = message;
    messageContainer.style.display = "block";
}
