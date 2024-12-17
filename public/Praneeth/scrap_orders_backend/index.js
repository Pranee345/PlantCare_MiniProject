// Import required modules
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const serviceAccount = require("./path.json");

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
} catch (error) {
    console.error("Error initializing Firebase Admin:", error);
}

const db = admin.firestore();

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "desaimansion456@gmail.com",
        pass: "nckh scgj rcmc lign" // Use app-specific password here
    }
});

// Function to fetch ragpicker emails from Firestore
const getRagpickerEmails = async () => {
    try {
        const ragpickersRef = db.collection("ragpicker");
        const snapshot = await ragpickersRef.get();
        const emails = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.email) emails.push(data.email);
        });

        console.log("Fetched ragpicker emails:", emails);
        return emails;
    } catch (error) {
        console.error("Error fetching ragpicker emails:", error);
        return [];
    }
};

// Firestore listener for new scrap_orders
const listenForScrapOrders = async () => {
    console.log("Setting up listener for scrap_orders collection...");

    db.collection("scrap_orders").onSnapshot(async (snapshot) => {
        console.log("Firestore snapshot received");

        snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
                console.log("New scrap order detected. Processing...");

                const newOrder = change.doc.data();
                console.log("Order Details:", newOrder);

                // Fetch ragpicker emails
                const ragpickerEmails = await getRagpickerEmails();

                if (ragpickerEmails.length === 0) {
                    console.warn("No ragpicker emails found. Skipping email notification.");
                    return;
                }

                // Prepare email options
                const mailOptions = {
                    from: "desaimansion456@gmail.com",
                    to: ragpickerEmails,
                    subject: "New Scrap Pickup Order",
                    text: `
                       A new scrap order has been placed.
                        Details:
                        - Items: ${newOrder.items?.map(item => item.name).join(", ") || "No items"}
                        - Weight: ${newOrder.weight || "N/A"} kg
                        - Date: ${newOrder.date || "N/A"}
                        - Location: ${newOrder.location || "N/A"}
                    `
                };

                // Send email
                try {
                    await transporter.sendMail(mailOptions);
                    console.log("Emails sent successfully to ragpickers.");
                } catch (error) {
                    console.error("Error sending email notifications:", error);
                }
            }
        });
    }, (error) => {
        console.error("Error listening to Firestore changes:", error);
    });
};

// Start the Firestore listener
listenForScrapOrders();
