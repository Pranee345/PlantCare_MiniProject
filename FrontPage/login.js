document.querySelector('#login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:5002/api/login', { // Make sure the URL is correct
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Display success message
            // Redirect to a different page or do something else on success
            window.location.href = '/dashboard'; // Redirect to a dashboard or home page
        } else {
            alert(data.error); // Display error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});
