const audio = document.getElementById('campo-audio');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

audio.volume = 0.7;
if (volumeSlider) {
    volumeSlider.value = String(audio.volume);
    volumeSlider.addEventListener('input', () => {
        audio.volume = parseFloat(volumeSlider.value);
        volumeIcon.textContent = audio.volume > 0.5 ? '🔊' : audio.volume > 0 ? '🔉' : '🔇';
    });
}
if (volumeIcon) {
    volumeIcon.style.cursor = 'pointer';
    volumeIcon.addEventListener('click', () => {
        audio.volume = 0;
        if (volumeSlider) {
            volumeSlider.value = '0';
        }
        volumeIcon.textContent = '🔇';
    });
}

function getCurrentUser() {
    return sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
}

function loadUserRecord() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        let users = JSON.parse(localStorage.getItem('gameUsers') || '[]');
        let user = users.find(u => u.username === currentUser);
        if (user) {
            return user.score || 0;
        }
    }
    return 0;
}

function saveUserRecord(record) {
    const currentUser = getCurrentUser();
    if (currentUser) {
        let users = JSON.parse(localStorage.getItem('gameUsers') || '[]');
        let userIndex = users.findIndex(u => u.username === currentUser);
        if (userIndex !== -1) {
            users[userIndex].score = record;
            localStorage.setItem('gameUsers', JSON.stringify(users));
        }
    }
}

// Caricamento delle immagini
const campoImg = new Image();
campoImg.src = "Campo_basket.jpg";

const imgCanestro = new Image();
imgCanestro.src = "rim.png";

const imgPalla = new Image();
imgPalla.src = "palla.png";


/**
 * La funzione loadImages() serve per il caricamento completo delle immagini del campo da basket, 
 * della palla e del canestro.
 * La funzione non restituisce alcun valore.
 */
const loadImages = () => {
    return new Promise((resolve) => {
        imgCanestro.onload = () => {
            resolve();
        };
        imgPalla.onload = () => {
            pallaCaricata = true;
            resolve();
        };
        campoImg.onload = () => {
            campoCaricato = true;
            resolve();
        };
    });
};

let canestroCaricato = false;
let pallaCaricata = false;
let campoCaricato = false;
class CampoBasket {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.velocitaTabellone = 0;
        this.scoreElement = document.getElementById("score");
        
        // Inizia sempre una nuova partita da zero
        this.score = 0;
        
        // Mantieni il record massimo salvato dell'utente
        this.record = loadUserRecord();
        if (this.record > 0) {
            document.getElementById("record").textContent = "Record: " + this.record;
        }
        this.ultimiDieciCanestri = 0;
        this.vite = 3;
        this.rect=0;
        this.creaPalla();
        this.creaCanestro();
        this.disegnaCampo();
        this.pallaCliccata = false;
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.scoreInput = 0;
        this.lifeElements = [
            document.getElementById("life1"),
            document.getElementById("life2"),
            document.getElementById("life3")
        ];
    }
    /**
     * Il metodo disegnaCampo() serve per disegnare il campo da basket sulla canvas. 
     * Il metodo disegna il campo da basket sulla canvas. Vengono disegnati il rettangolo del campo, il canestro e la palla. 
     * Il metodo non restituisce alcun valore.
     */
    disegnaCampo() {
        // Disegna il campo da basket
        const campoImg = new Image();
        campoImg.src = 'Campo_basket.jpg';
        this.ctx.drawImage(campoImg, 0, 0, this.width, this.height);

        // Disegna la palla
        const pallaImg = new Image();
        pallaImg.src = 'palla.png';
        const pallaWidth = 120;  // Larghezza della palla
        const pallaHeight = 120;  // Altezza della palla
        this.ctx.drawImage(pallaImg, this.pallaX - pallaWidth / 2, this.pallaY - pallaHeight / 2, pallaWidth, pallaHeight);

        // Disegna il canestro
        const canestroImg = new Image();
        canestroImg.src = 'rim.png';
        const canestroWidth = 240;  // Larghezza del canestro
        const canestroHeight = 300;  // Altezza del canestro
        this.ctx.drawImage(canestroImg, this.canestroX, this.canestroY, canestroWidth, canestroHeight);
    }
    /**
     * Il metodo creaPalla() serve per creare la palla. 
     * Il metodo non restituisce alcun valore.
     */  
    creaPalla() {
        this.pallaX = this.width/2;
        this.pallaY = this.height-60;
    }
    /**
     * Il metodo creaCanestro() serve per creare il canestro. 
     * Il metodo non restituisce alcun valore.
     */    
    creaCanestro() {
        this.canestroX = (this.width - 240) / 2;
        this.canestroY = 0;
    }
    /**
     * Il metodo serve per verificare se palla colpisce il canestro. 
     * @return <<true>> se la palla colpisce il canestro, <<false>> se non lo colpisce.
     */ 
    controlloCollisione() {
        if (
            this.pallaX >= this.canestroX &&
            this.pallaX <= this.canestroX + 240 &&
            this.pallaY - 60 < this.canestroY + 180 &&
            this.pallaY - 60 > this.canestroY + 150
        ) {
            return true;
        }
        return false;
    }
    
    /**
     * Il metodo serve per far muovere la palla appena viene cliccata.
     * Il metodo non restituisce alcun valore.
     */ 
    muoviPalla() {
        if (this.pallaCliccata) {
            this.pallaY += this.velocitaPallaY;
        }else{
            this.pallaY=this.height - 60;
            this.velocitaPallaY = 0;
        }
    }
    /**
     * Il metodo aggiorna() serve per aggiornare il gioco quando viene chiamato.
     * Il metodo non restituisce alcun valore.
     */
    aggiorna() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.disegnaCampo();
        this.muoviPalla();
        this.disegnaPunteggio();
        this.disegnaVite();
console.log(campo.controlloCollisione());
        if (this.controlloCollisione()) {
            console.log(this.controlloCollisione());
            this.incrementaPunteggio();
            this.creaPalla();
            this.creaCanestro();
            this.pallaCliccata = false;
            this.velocitaPallaY = 0;
            this.pallaY = this.height - 60;
            this.velocitaTabellone += 0.4*Math.sign(this.velocitaTabellone);
            if(this.velocitaTabellone == 0){
                this.velocitaTabellone += 0.6;
            }
        }
        this.canestroX += this.velocitaTabellone;
        // Controllo dei bordi laterali del canvas per il canestro e il bordo superiore per la palla
        if (this.canestroX + 240 > this.width || this.canestroX < 0) {
            this.velocitaTabellone = -this.velocitaTabellone;
        }
        if (this.pallaY +60 > this.height || this.pallaY < 0) {
            this.pallaCliccata = false;
            this.velocitaPallaY = 0;
            this.pallaY = this.height - 30;
            this.vite -= 1;
            this.ultimiDieciCanestri=0;
            //se le vite sono a 0, va alla pagina di sconfitta
            if (this.vite == 0) {
                sessionStorage.setItem('lastScore', this.score);
                sessionStorage.setItem('userRecord', this.record);
                this.score = 0;
                window.location.href = "Sconfitta.html";
            }
        }
        //se lo score supera il record, aggiorna e salva il nuovo record
        if (this.score > this.record) {
            this.record = this.score;
            saveUserRecord(this.record);
        }
    }
    /**
     * Il metodo disegnaPunteggio() serve per disegnare lo score a schermo all'interno del canvas.
     * Il metodo non restituisce alcun valore.
     */     
    disegnaPunteggio() {
        this.ctx.font = "50px Times new roman";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Score: " + this.score, 30, 530);
    }
    /**
     * Il metodo serve per disegnare le vite a schermo
     * Il metodo non restituisce alcun valore.
     */
    disegnaVite() {
        this.lifeElements.forEach((element, index) => {
            if (index >= this.vite) {
                element.src="palla_x.png"; 
            } else {
                element.src="palla.png";                     
            }
        });
    }
    /**
     * Il metodo incrementaPunteggio() serve per incrementare il punteggio del gioco, mostrare a schermo il record 
     * Se vengono fatti 10 canstri di fila viene aggiunta un'eventuale vita
     * Il metodo non restituisce alcun valore.
     */
    incrementaPunteggio() {
        this.score += 1;
        this.ultimiDieciCanestri++;
        if (this.score > this.record) {
            this.record = this.score;
            document.getElementById("record").textContent = "Record: " + this.record;
            saveUserRecord(this.record);
        }
        if (this.ultimiDieciCanestri >= 5) {
            this.ultimiDieciCanestri = 0;
            if (this.vite < 3) {
                this.vite = this.vite + 1;
            }
        }
    }

    /**
     * Il metodo serve per sparare la palla verso il canestro
     * Il metodo non restituisce alcun valore
     */
    sparaPalla() {
        if (!this.pallaCliccata) {
            this.pallaCliccata = true;
            this.velocitaPallaY = -2;
        }
    }

    /**
     * Il metodo serve a catturare l'interazione dell'utente con la palla e imposta la sua velocità
     * Il metodo non restituisce alcun valore
     */
    handleClick(event) {
        this.sparaPalla();
    }
}

const resetButton = document.getElementById("reset");
var campo;
/**
 * La funzione serve per resettare il campo di gioco al click dell'utente sul pulsante "RESET"
 * La funzione non restituisce alcun valore
 */
resetButton.addEventListener("click", function() {
    if(campo!=null){
        campo.score = 0;
        campo.ultimiDieciCanestri = 0;
        campo.vite = 3;
        campo.velocitaTabellone = 0;
        campo.pallaCliccata = false;
        campo.creaPalla();
        campo.creaCanestro();
        campo.disegnaCampo();
    }
});
/**
 * La funzione serve per inizializzare il campo di gioco e mettere la musica di sottofondo 
 * al click del pulsante "INIZIA A GIOCARE"
 * La funzione non restituisce alcun valore
 */
document.getElementById("GIOCA").addEventListener("click", function() {
    audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.7;
    audio.loop = true; // Aggiunta dell'attributo loop
    audio.play();
    if (campo) {
        clearInterval(campo.intervalid);
    }
    campo = new CampoBasket(document.getElementById("campo"));
    campo.intervalid = setInterval(() => {
        campo.aggiorna();
    }, 10);
});

/**
 * Event listener per il tasto SPAZIO che spara la palla
 * La funzione non restituisce alcun valore
 */
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && campo) {
        event.preventDefault();
        campo.sparaPalla();
    }
});

