let doc = document,
    numbersBtn = doc.querySelectorAll('.btn-number'),
    clearBtns = doc.querySelectorAll('.btn-clear'),
    enterBtn = doc.querySelector('.btn-enter'),
    display = doc.querySelector('.input'),
    randomNumber = doc.querySelectorAll('.drop__numbers '),
    operatorsDrop = doc.querySelector('.drop__operator'),
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

let clear = (id) => {
    if (id === 'clear') {
        display.value = '';
    } else if (id === 'delete') {
        display.value = display.value.slice(0, -1);
    };
}


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
enterBtn.addEventListener('click',
    (e) => operationEnter((e.target.textContent)));

//Drop-------------------------------








function getRandomInRange() {
    for (let number of randomNumber) {
        function getRandom(min, max) {
            number.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        getRandom(1, 100);
    };
}



function arrayRandElement(arr) {
    var rand = Math.floor(Math.random() * arr.length);
    operatorsDrop.textContent = arr[rand];
}







btnPlay.addEventListener('click', () => {
    getRandomInRange();
    arrayRandElement(arrOperators);
})