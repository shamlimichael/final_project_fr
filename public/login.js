document.getElementById("log_in_button").addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorElement = document.getElementById('error_log_in');
    
    if (!user || !pass) {
        errorElement.textContent = "Please enter both username and password.";
    } else {
        errorElement.textContent = ""; 
    }
});


document.getElementById("sign_up").addEventListener('click', () => {
    window.location.href = "signup"
})