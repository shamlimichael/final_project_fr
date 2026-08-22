document.getElementById("sign_up_form").addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();
    const year = document.getElementById("year").value.trim();
    const errorElement = document.getElementById("error_log_in");
    const Check = document.getElementById("terms").checked;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !username) {
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
    else if(2026 - year < 18) {
        errorElement.textContent = "user most be over 18";
        errorElement.style.display = "block";
    }
    else if((username.includes('@'))){
        errorElement.textContent = "username cant include @";
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
});

document.getElementById("eye-open").addEventListener('click', () => {
    const eyeIcon = document.getElementById("eye-open");
    const passwordInput = document.getElementById("password");

    if (eyeIcon.src.includes("eye-slash-white-square.png")) {
        eyeIcon.src = "eye-white.png";
        passwordInput.type = "password";
        eyeIcon.classList.remove("slashed-eye-style"); 

    } else {
        eyeIcon.src = "eye-slash-white-square.png";
        passwordInput.type = "text";
        eyeIcon.classList.add("slashed-eye-style"); 
    }
});