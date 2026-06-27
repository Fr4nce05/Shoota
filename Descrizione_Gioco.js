var accessMade = true;
/**
 * funzione che disegna la linea del canvas per la divisione dello schermo 
 * non restituisce alcun valore
 */
window.onload=function() {
    const canvas=document.getElementById("myCanvas");
    const ctx=canvas.getContext("2d");

    // Imposta la larghezza della linea del canvas a 10000 e la sua altezza sulla larghezza 
    // e l'altezza della finestra del browser
    canvas.width=10000;
    canvas.height=window.innerHeight;

    // Canvas cleared senza disegnare la linea
}