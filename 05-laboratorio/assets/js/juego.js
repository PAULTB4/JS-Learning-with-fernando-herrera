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
        throw "No hay cartas en el deck";
    }
    const cart = deck.pop();
    return cart;
};

const getCardValue = (cartx) => {
    const value = cartx.substring(0, cartx.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 0) : value * 1;
};

const value = getCardValue(requestCard());

//eventos

//turn on pc
const turnOnPC = (MinPoints) => {
    do {
        const cart = requestCard();
        pointsComputer = pointsComputer + getCardValue(cart);
        pointSmallerComputer.innerText = pointsComputer;

        // <!-- <img class="carta" src="./cartas/2C.png" alt=""> -->

        const imgCard = document.createElement("img");
        imgCard.src = `./cartas/${cart}.png`;
        imgCard.classList.add("carta");

        divCartasComputer.append(imgCard);

        if (MinPoints > 21) {
            break;
        }

    } while ((pointsComputer < MinPoints) && (MinPoints <= 21));
};

btnGet.addEventListener("click", function() {
    const cart = requestCard();
    pointsPlayer = pointsPlayer + getCardValue(cart);
    pointSmallerPlayer.innerText = pointsPlayer;

    // <!-- <img class="carta" src="./cartas/2C.png" alt=""> -->

    const imgCard = document.createElement("img");
    imgCard.src = `./cartas/${cart}.png`;
    imgCard.classList.add("carta");

    if (pointsPlayer > 21) {
        console.warn("Lo siento mucho, perdister");
        btnGet.disabled = true;
        turnOnPC(pointsPlayer);
    } else if (pointsPlayer === 21) {
        console.warn("21, ganaste");
    }

    divCartasJugador.append(imgCard);
});

btnStop.addEventListener("click", function() {
    btnGet.disabled = true;
    btnStop.disabled = true;

    turnOnPC(pointsPlayer);

});

btnNew.addEventListener("click", function() {
    divCartasComputer.innerHTML = "";
    divCartasJugador.innerHTML = "";

    btnGet.disabled = false;
    btnStop.disabled = false;

    pointSmallerComputer.innerText = 0;
    pointSmallerPlayer.innerText = 0;

})