const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "desaimansion456@gmail.com",
        pass: "csbs rxxh ohks mspx",
    },
});

exports.notifyRagpickers = onDocumentCreated("scrap_orders/{orderId}", async (event) => {
    const orderData = event.data; // Newly created document data

    try {
        const ragpickersSnapshot = await admin.firestore().collection("ragpickers").get();

        if (ragpickersSnapshot.empty) {
            console.log("No ragpickers found.");
            return null;
        }

        const ragpickerEmails = ragpickersSnapshot.docs.map(doc => doc.data().email);

        const mailOptions = {
            from: "desaimansion456@gmail.com",
            to: ragpickerEmails,
            subject: "New Scrap Pickup Request",
            text: `New request details:
                Weight: ${orderData.weight} kg
                Date: ${orderData.date}
                Location: ${orderData.location}`,
            html: `<p>New request details:</p>
                <p><strong>Weight:</strong> ${orderData.weight} kg</p>
                <p><strong>Date:</strong> ${orderData.date}</p>
                <p><strong>Location:</strong> ${orderData.location}</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully.");
        return null;
    } catch (error) {
        console.error("Error sending emails:", error);
        return null;
    }
});
