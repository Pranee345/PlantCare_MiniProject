document.querySelector('#registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission
    const urlparams=new URLSearchParams(window.location.search);
    const userType=urlparams.get("type");
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate inputs with regex
    const usernameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;  // Password with at least 1 digit, 1 uppercase, and length 6-20

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

    // Send registration request to server
    try {
        const response = await fetch('http://localhost:5002/api/register', { // Update URL to your backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                phone,
                location,
                password,
                type:userType
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!'); // Handle success
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert(data.error || 'Registration failed'); // Handle error
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred while registering. Please try again later.'); // Handle network error
    }
});
