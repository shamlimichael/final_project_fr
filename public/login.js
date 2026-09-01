document.getElementById("log_in_form").addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("error_log_in");

    if (!username || !password) {
        errorElement.textContent = "Please fill in all fields.";
        errorElement.style.display = "block";
    } 
    else{
        errorElement.textContent = "";
        document.getElementById("log_in_form").submit();
    }
})

document.getElementById("eye-open").addEventListener('click', () => {
    const eyeIcon = document.getElementById("eye-open");
    const passwordInput = document.getElementById("password");

    if (eyeIcon.src.includes("/resources/eye-slash-white-square.png")) {
        eyeIcon.src = "/resources/eye-white.png";
        passwordInput.type = "password";
        eyeIcon.classList.remove("slashed-eye-style"); 

    } else {
        eyeIcon.src = "/resources/eye-slash-white-square.png";
        passwordInput.type = "text";
        eyeIcon.classList.add("slashed-eye-style"); 
    }
});

document.getElementById("sign_up").addEventListener('click', () => {
    window.location.href = "/signup";
})