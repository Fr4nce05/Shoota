function getUsers() {
    return JSON.parse(localStorage.getItem('gameUsers') || '[]');
}

function clearScoreTable() {
    const table = document.getElementById('score-table');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function addUserRow(username, score, position) {
    var table = document.getElementById("score-table");
    var row = table.insertRow(-1);

    var positionCell = row.insertCell(0);
    var usernameCell = row.insertCell(1);
    var scoreCell = row.insertCell(2);

    positionCell.textContent = position;
    usernameCell.textContent = username;
    scoreCell.textContent = score;

    positionCell.classList.add("default");
    usernameCell.classList.add("default");
    scoreCell.classList.add("default");
}

function loadExistingUsers() {
    clearScoreTable();
    let users = getUsers();
    // Ordina gli utenti per punteggio (dal più alto al più basso)
    users.sort((a, b) => (b.score || 0) - (a.score || 0));
    users.forEach((user, index) => {
        addUserRow(user.username, user.score || 0, index + 1);
    });
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

    loadExistingUsers();
}
