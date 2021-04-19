let doc = document,
    numbersBtn = doc.querySelectorAll('.btn-number'),
    clearBtns = doc.querySelectorAll('.btn-clear'),
    enterBtn = doc.querySelector('.btn-enter'),
    display = doc.querySelector('.input'),
    fielGame = doc.querySelector('.game-field'),
    drop = doc.querySelector('.drop'),
    randomNumber = doc.querySelectorAll('.drop__numbers'),
    operatorsDrop = doc.querySelector('.drop__operator'),
    posDrop = 0,
    arrOperators = ['-', '+', '/', '*'],
    btnPlay = doc.querySelector('.play');




//Calc-----------------------
let numberPress = (number) => {

    if (display.value == '') {
        display.value = number;
    } else {
        display.value += number;
    };
};
//---Keyboard input----------
let KeyDownValue = (code) => {
    let key = doc.querySelector(`.btn[data-key='${code}']`);

    if (key.id === 'clear') {
        display.value = '';
    } else if (key.id === 'delete') {
        display.value = display.value.slice(0, -1);
    };

    if (key.id === 'clear' || key.id === 'delete') {
        display.value == display.value;
    } else {
        if (display.value == '') {
            display.value = key.textContent;
        } else {
            display.value += key.textContent;
        };
    };
}
//---Cleaning--------------
let clear = (id) => {
    if (id === 'clear') {
        display.value = '';
    } else if (id === 'delete') {
        display.value = display.value.slice(0, -1);
    };
}

//---Event-----------------
for (let number of numbersBtn) {
    number.addEventListener('click',
        (e) => numberPress(e.target.textContent));
}

window.addEventListener('keydown',
    (e) => KeyDownValue(e.keyCode));

for (let clearBtn of clearBtns) {
    clearBtn.addEventListener('click',
        (e) => clear(e.srcElement.id));
}
//-----------------------------------




//Drop-------------------------------
//---Random drop values--------------
function getRandomInRange() {
    for (let number of randomNumber) {
        function getRandom(min, max) {
            number.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
        };
        getRandom(1, 100);
    };
}

function arrayRandElement(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    operatorsDrop.textContent = arr[rand];
}
//--Accidental drop appearance------

function dropAappearance () {
    function randomDropAappearance(min, max) {
        drop.style.left = (Math.floor(Math.random() * (max - min + 1)) + min) - fielGame.children[0].clientWidth + 'px';
    };

    randomDropAappearance(fielGame.children[0].clientWidth, fielGame.clientWidth);
}


//---Droplet movement---------------
function moveDrop() {
    let setClear = setInterval(fallDrop, 10);

    function fallDrop() {
        if (posDrop == fielGame.clientHeight 
            - fielGame.children[1].clientHeight 
            - fielGame.children[0].clientHeight) {
            clearInterval(setClear)
        } else {
            posDrop++;
            drop.style.top = posDrop + 'px'
        };
    }
}






btnPlay.addEventListener('click', () => {
    getRandomInRange();
    arrayRandElement(arrOperators);
    dropAappearance ();
    moveDrop();
})