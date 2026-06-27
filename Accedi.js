function getUsers() {
    return JSON.parse(localStorage.getItem('gameUsers') || '[]');
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
    sessionStorage.setItem('currentUser', username);
}

/**
 * La funzione login serve per verificare se l'username e la password inseriti sono corretti
 */
function login() {
    var usernameInput = document.querySelector("input[name='username']");
    var passwordInput = document.querySelector("input[name='password']");
    var errorElement = document.getElementById("login-error");

    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();

    if (username === "" && password === "") {
        errorElement.textContent = "Errore, dati mancanti";
        return;
    }
    if (username === "") {
        errorElement.textContent = "Errore, username mancante";
        return;
    }
    if (password === "") {
        errorElement.textContent = "Errore, password mancante";
        return;
    }

    if (password.length < 3) {
        errorElement.textContent = "Errore, password troppo corta (minimo 3 caratteri)";
        return;
    }

    let users = getUsers();
    let user = users.find(u => u.username === username);

    if (user) {
        if (user.password === password) {
            errorElement.textContent = "";
            setCurrentUser(username);
            usernameInput.value = "";
            passwordInput.value = "";
            window.location.href = "CampoCanestro.html";
        } else {
            errorElement.textContent = "Errore, password errata";
        }
    } else {
        errorElement.textContent = "Errore, utente non trovato";
    }
}

window.onload = function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}
