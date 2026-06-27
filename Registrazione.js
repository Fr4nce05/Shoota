function getUsers() {
    return JSON.parse(localStorage.getItem('gameUsers') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('gameUsers', JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
    sessionStorage.setItem('currentUser', username);
}

function updateCredentialsFile() {
    let users = getUsers();
    let content = "# Credenziali di test per il progetto Shoota\n";
    content += "# Questo file serve solo per ricordare le credenziali da usare durante i test\n";
    content += "# Non committare questo file in un repository pubblico!\n\n";
    content += "## Utenti registrati in localStorage:\n\n";

    users.forEach((user, index) => {
        content += `### Utente ${index + 1}:\n`;
        content += `- Username: ${user.username}\n`;
        content += `- Password: ${user.password}\n`;
        content += `- Record: ${user.score || 0}\n\n`;
    });

    content += "## Note:\n";
    content += "- Queste credenziali sono salvate in localStorage sotto la chiave 'gameUsers'\n";
    content += "- Per aggiungere nuovi utenti di test, usa la funzione register() in Registrazione.js\n";
    content += "- Ricorda di svuotare localStorage se necessario per test puliti\n";

    console.log("Contenuto aggiornato per test_credentials.txt:\n\n" + content);
}

/**
 * La funzione register serve per registrare un nuovo utente
 */
function register() {
    var usernameInput = document.querySelector("input[name='username']");
    var passwordInput = document.querySelector("input[name='password']");
    var confirmPasswordInput = document.querySelector("input[name='confirm-password']");
    var errorElement = document.getElementById("register-error");

    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();
    var confirmPassword = confirmPasswordInput.value.trim();

    // Validazione campi vuoti
    if (username === "" && password === "" && confirmPassword === "") {
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
    if (confirmPassword === "") {
        errorElement.textContent = "Errore, conferma password mancante";
        return;
    }

    // Validazione password
    if (password !== confirmPassword) {
        errorElement.textContent = "Errore, le password non coincidono";
        return;
    }

    // Validazione lunghezza username
    if (username.length < 3) {
        errorElement.textContent = "Errore, username troppo corto (minimo 3 caratteri)";
        return;
    }

    // Validazione lunghezza password
    if (password.length < 3) {
        errorElement.textContent = "Errore, password troppo corta (minimo 3 caratteri)";
        return;
    }

    // Verifica se l'username esiste già
    let users = getUsers();
    let existingUser = users.find(u => u.username === username);

    if (existingUser) {
        errorElement.textContent = "Errore, questo username è già registrato";
        return;
    }

    // Registrazione nuovo utente
    const newUser = { username, password, score: 0 };
    users.push(newUser);
    saveUsers(users);
    updateCredentialsFile();

    // Reset form
    errorElement.textContent = "";
    usernameInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";

    // Login e reindirizzamento
    setCurrentUser(username);
    window.location.href = "CampoCanestro.html";
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
