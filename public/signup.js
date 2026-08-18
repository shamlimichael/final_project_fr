document.getElementById("sign_up").addEventListener('click', (e) => {

    // Get input elements
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Get error display element
    const errorElement = document.getElementById('error_log_in');

    // Basic Regex pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Check for empty fields
    if (!email || !username || !password) {
        errorElement.textContent = "Please fill in all fields.";
        return;
    }

    // 2. Validate Email format
    if (!emailPattern.test(email)) {
        errorElement.textContent = "Please enter a valid email address.";
        return;
    }

    // 3. Validate Username (at least 3 characters)
    if (username.length < 3) {
        errorElement.textContent = "Username must be at least 3 characters long.";
        return;
    }

    // 4. Validate Password length (at least 6 characters)
    if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters long.";
        return;
    }

    // If all checks pass:
    errorElement.textContent = ""; 
    
    // TODO: Send data to your server/backend here
    console.log("Sign up successful!");
    
    // Example: Redirect to login or home page upon successful sign up
    // window.location.href = "login.html";
});