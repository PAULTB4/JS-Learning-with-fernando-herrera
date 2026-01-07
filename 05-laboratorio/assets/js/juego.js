let deck = [];
const tipos = ["C", "D", "H", "S"];
const specials = ["A", "J", "Q", "K"];

let pointsPlayer = 0;
let pointsComputer = 0;
const btnGet = document.querySelector("#btnGet");
const btnStop = document.querySelector("#btnStop");
const btnNew = document.querySelector("#btnNew");
const pointsmall = document.querySelectorAll("small");
const pointSmallerPlayer = pointsmall[0];
const pointSmallerComputer = pointsmall[1];
const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputer = document.querySelector("#computadora-cartas");

// Sistema de Modales Escalable
const modal = {
    element: document.querySelector("#resultModal"),
    icon: document.querySelector(".result-icon"),
    title: document.querySelector(".result-title"),
    message: document.querySelector(".result-message"),

    tipos: {
        victoria: {
            icon: "🏆",
            title: "¡VICTORIA!",
            color: "#ffd700",
            efectos: ["confetti", "glow"]
        },
        derrota: {
            icon: "😢",
            title: "DERROTA",
            color: "#ff4444",
            efectos: ["shake"]
        },
        empate: {
            icon: "🤝",
            title: "EMPATE",
            color: "#4444ff",
            efectos: []
        },
        blackjack: {
            icon: "🎰",
            title: "¡BLACKJACK!",
            color: "#44ff44",
            efectos: ["confetti", "glow", "pulse"]
        },
        bust: {
            icon: "💥",
            title: "¡TE PASASTE!",
            color: "#ff4444",
            efectos: ["shake"]
        }
    },

    mostrar: function(tipo, mensajePersonalizado = "") {
        const config = this.tipos[tipo];
        if (!config) {
            console.error(`Tipo de modal desconocido: ${tipo}`);
            return;
        }

        this.icon.textContent = config.icon;
        this.title.textContent = config.title;
        this.title.style.color = config.color;

        if (mensajePersonalizado) {
            this.message.textContent = mensajePersonalizado;
        } else {
            this.message.textContent = this.obtenerMensajeDefault(tipo);
        }

        this.element.classList.add("show");

        this.aplicarEfectos(config.efectos);

        setTimeout(() => {
            this.cerrar();
        }, 3000);
    },

    obtenerMensajeDefault: function(tipo) {
        const mensajes = {
            victoria: `¡Ganaste! Tu puntuación: ${pointsPlayer} vs ${pointsComputer}`,
            derrota: `Perdiste. Tu puntuación: ${pointsPlayer} vs ${pointsComputer}`,
            empate: `Empate en ${pointsPlayer} puntos`,
            blackjack: `¡Conseguiste 21! Puntuación perfecta`,
            bust: `Te pasaste de 21 con ${pointsPlayer} puntos`
        };
        return mensajes[tipo] || "";
    },

    aplicarEfectos: function(efectos) {
        efectos.forEach(efecto => {
            switch(efecto) {
                case "confetti":
                    this.crearConfetti();
                    break;
                case "glow":
                    document.body.classList.add("victory");
                    divCartasJugador.classList.add("winner");
                    break;
                case "pulse":
                    this.element.querySelector(".result-content").style.animation = "modalSlideIn 0.5s, victoryPulse 1s infinite";
                    break;
                case "shake":
                    this.element.querySelector(".result-content").style.animation = "modalSlideIn 0.5s, shake 0.5s";
                    break;
            }
        });
    },

    crearConfetti: function() {
        const colors = ["#ffd700", "#ff4444", "#44ff44", "#4444ff", "#ff44ff"];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.style.position = "fixed";
            confetti.style.width = "10px";
            confetti.style.height = "10px";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + "%";
            confetti.style.top = "-10px";
            confetti.style.opacity = "1";
            confetti.style.zIndex = "9999";
            confetti.style.borderRadius = "50%";
            confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear forwards`;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }
    },

    cerrar: function() {
        this.element.classList.remove("show");
        document.body.classList.remove("victory");
        divCartasJugador.classList.remove("winner");
        this.element.querySelector(".result-content").style.animation = "";
    }
};

// Cerrar modal al hacer click
modal.element.addEventListener("click", function() {
    modal.cerrar();
});

// Sistema de Audio Escalable para Casino
const audioManager = {
    context: null,

    // Inicializar el contexto de audio (solo una vez)
    init: function() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.context;
    },

    // Sonido de carta siendo repartida
    playCardDeal: function() {
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    },

    // Sonido de victoria con melodía ascendente
    playWin: function() {
        const ctx = this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do alto

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
            oscillator.type = 'sine';

            const startTime = ctx.currentTime + (index * 0.15);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    },

    // Sonido de Blackjack (victoria especial)
    playBlackjack: function() {
        const ctx = this.init();

        // Melodía triunfal más elaborada
        const melody = [
            {freq: 523.25, time: 0},      // Do
            {freq: 659.25, time: 0.1},    // Mi
            {freq: 783.99, time: 0.2},    // Sol
            {freq: 1046.50, time: 0.3},   // Do alto
            {freq: 783.99, time: 0.45},   // Sol
            {freq: 1046.50, time: 0.6}    // Do alto
        ];

        melody.forEach((note) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime);
            oscillator.type = 'triangle';

            const startTime = ctx.currentTime + note.time;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.25);
        });

        // Efecto de monedas cayendo
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.playCoinDrop(), i * 100);
        }
    },

    // Sonido de derrota con melodía descendente
    playLose: function() {
        const ctx = this.init();
        const notes = [783.99, 659.25, 523.25, 392.00]; // Sol, Mi, Do, Sol bajo

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
            oscillator.type = 'sawtooth';

            const startTime = ctx.currentTime + (index * 0.2);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    },

    // Sonido de bust (te pasaste)
    playBust: function() {
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    },

    // Sonido de empate
    playTie: function() {
        const ctx = this.init();
        const frequencies = [440, 440]; // La misma nota dos veces

        frequencies.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
            oscillator.type = 'square';

            const startTime = ctx.currentTime + (index * 0.15);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    },

    // Sonido de moneda cayendo
    playCoinDrop: function() {
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    },

    // Sonido de botón click
    playButtonClick: function() {
        const ctx = this.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    },

    // Sonido de barajar cartas
    playShuffle: function() {
        const ctx = this.init();

        for (let i = 0; i < 15; i++) {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, ctx.currentTime);

            oscillator.frequency.setValueAtTime(Math.random() * 200 + 100, ctx.currentTime);
            oscillator.type = 'square';

            const startTime = ctx.currentTime + (i * 0.03);
            gainNode.gain.setValueAtTime(0.05, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.05);
        }
    }
};

const createDeck = () => {
    for (let i = 2; i <= 10; i++) {
        for (const element of tipos) {
            deck.push(i + element);
        }
    }

    for (let tipo of tipos) {
        for (const esp of specials) {
            deck.push(esp + tipo);
        }
    }

    deck = _.shuffle(deck);
    return deck;
};

deck = createDeck();

const requestCard = () => {
    if (deck.length === 0) {
        console.error("No hay cartas en el deck");
        return null;
    }
    const cart = deck.pop();
    return cart;
};

const getCardValue = (cartx) => {
    const value = cartx.substring(0, cartx.length - 1);
    if (isNaN(value)) {
        if (value === "A") return 11;
        if (value === "J" || value === "Q" || value === "K") return 10;
        return 0;
    }
    return parseInt(value, 10);
};

//eventos

//turn on pc
const turnOnPC = (MinPoints) => {
    let delay = 0;

    do {
        const cart = requestCard();

        // Validar que haya una carta disponible
        if (!cart) {
            console.error("No quedan cartas en el deck");
            break;
        }

        pointsComputer = pointsComputer + getCardValue(cart);

        // Agregar sonido con delay para cada carta de la computadora
        setTimeout(() => {
            audioManager.playCardDeal();
        }, delay);

        pointSmallerComputer.innerText = pointsComputer;

        // <!-- <img class="carta" src="./cartas/2C.png" alt=""> -->

        const imgCard = document.createElement("img");
        imgCard.src = `assets/cartas/${cart}.png`;
        imgCard.classList.add("carta");
        imgCard.alt = cart;

        divCartasComputer.append(imgCard);

        delay += 400; // Incrementar delay para cada carta

        if (MinPoints > 21) {
            break;
        }

    } while ((pointsComputer < MinPoints) && (MinPoints <= 21));

    // Determinar el resultado del juego
    setTimeout(() => {
        determinarGanador();
    }, delay + 500);
};

const determinarGanador = () => {
    if (pointsPlayer > 21) {
        // El jugador se pasó de 21
        audioManager.playBust();
        modal.mostrar("bust");
    } else if (pointsComputer > 21) {
        // La computadora se pasó, el jugador gana
        audioManager.playWin();
        modal.mostrar("victoria", `¡El crupier se pasó con ${pointsComputer}! Ganaste con ${pointsPlayer} puntos`);
    } else if (pointsPlayer === pointsComputer) {
        // Empate
        audioManager.playTie();
        modal.mostrar("empate");
    } else if (pointsPlayer > pointsComputer) {
        // El jugador tiene más puntos
        if (pointsPlayer === 21) {
            audioManager.playBlackjack();
            modal.mostrar("blackjack");
        } else {
            audioManager.playWin();
            modal.mostrar("victoria");
        }
    } else {
        // La computadora tiene más puntos
        audioManager.playLose();
        modal.mostrar("derrota");
    }
};

btnGet.addEventListener("click", function() {
    const cart = requestCard();

    // Validar que haya una carta disponible
    if (!cart) {
        console.error("No quedan cartas en el deck");
        btnGet.disabled = true;
        btnStop.disabled = true;
        alert("No quedan más cartas en el mazo. Inicia un nuevo juego.");
        return;
    }

    // Sonido de carta siendo repartida
    audioManager.playCardDeal();

    pointsPlayer = pointsPlayer + getCardValue(cart);
    pointSmallerPlayer.innerText = pointsPlayer;

    // <!-- <img class="carta" src="./cartas/2C.png" alt=""> -->

    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${cart}.png`;
    imgCard.classList.add("carta");
    imgCard.alt = cart;

    divCartasJugador.append(imgCard);

    if (pointsPlayer > 21) {
        btnGet.disabled = true;
        btnStop.disabled = true;
        turnOnPC(pointsPlayer);
    } else if (pointsPlayer === 21) {
        btnGet.disabled = true;
        btnStop.disabled = true;
        turnOnPC(pointsPlayer);
    }
});

btnStop.addEventListener("click", function() {
    // Sonido de botón
    audioManager.playButtonClick();

    btnGet.disabled = true;
    btnStop.disabled = true;

    turnOnPC(pointsPlayer);

});

btnNew.addEventListener("click", function() {
    // Sonido de barajar cartas
    audioManager.playShuffle();

    // Reiniciar el deck
    deck = createDeck();

    // Limpiar las cartas
    divCartasComputer.innerHTML = "";
    divCartasJugador.innerHTML = "";

    // Habilitar botones
    btnGet.disabled = false;
    btnStop.disabled = false;

    // Reiniciar puntos
    pointsPlayer = 0;
    pointsComputer = 0;
    pointSmallerComputer.innerText = 0;
    pointSmallerPlayer.innerText = 0;

    // Cerrar modal si está abierto
    modal.cerrar();
})