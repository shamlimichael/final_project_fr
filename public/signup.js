document.getElementById("sign_up").addEventListener('click', (e) => {
    // Prevent form submission if inside a form tag
    e.preventDefault();

    // Get input elements
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const year = document.getElementById('year').value.trim();
    
    // Get error display element
    const errorElement = document.getElementById('error_log_in');

    // Basic Regex pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Check for empty fields
    if (!email || !username || !password || !month || !day || !year) {
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

    // 5. Validate Birth Year (4 digits, reasonable range)
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum) || year.length !== 4 || yearNum < 1900 || yearNum > currentYear) {
        errorElement.textContent = `Please enter a valid birth year (1900 - ${currentYear}).`;
        return;
    }

    // 6. Validate Calendar Date (e.g., prevent Feb 30th or April 31st)
    const birthDate = new Date(yearNum, month - 1, day);
    if (
        birthDate.getFullYear() !== yearNum ||
        birthDate.getMonth() !== parseInt(month) - 1 ||
        birthDate.getDate() !== parseInt(day)
    ) {
        errorElement.textContent = "Please select a valid calendar date.";
        return;
    }

    // If all checks pass:
    errorElement.textContent = ""; 
    
    // TODO: Send data to your server/backend here
    console.log("Sign up successful!");
    
    // Example: Redirect to login or home page upon successful sign up
    // window.location.href = "login.html";
});