document.querySelector('#login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    const role = document.querySelector('#role').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:5002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role, 
                username,
                password
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); 
            // Redirect based on role
            window.location.href = role === 'users' ? 'Userdashboard/page.html' : 'Ragpicker/page.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});
