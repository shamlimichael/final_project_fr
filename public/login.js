document.getElementById("log_in_form").addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error_log_in");
    const Check = document.getElementById("terms").checked;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
        errorElement.textContent = "Please fill in all fields.";
        errorElement.style.display = "block";
    } 
    else if (!emailPattern.test(email)) {
        errorElement.textContent = "Please enter a valid email address.";
        errorElement.style.display = "block";
    }
    else if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters long.";
        errorElement.style.display = "block";
    } 
    else if (!password.includes("!") && !password.includes("@")) {
        errorElement.textContent = "Password must include either '!' or '@'.";
        errorElement.style.display = "block";
    }
    else if(!Check)
    {
        errorElement.textContent = "must agree to terms and service";
        errorElement.style.display = "block";
    }
    else{
        errorElement.textContent = "";
        errorElement.style.display = "none";
        document.getElementById("sign_up_form").submit();
    }
})