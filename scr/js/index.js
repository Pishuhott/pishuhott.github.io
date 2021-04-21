let doc = document,
    numbersBtn = doc.querySelectorAll('.btn-number'),
    clearBtns = doc.querySelectorAll('.btn-clear'),
    enterBtn = doc.querySelector('.btn-enter'),
    display = doc.querySelector('.input'),
    gameField = doc.querySelector('.game-field'),
    arrOperators = ['-', '+', '*'],
    resyltDrop,
    btnPlay = doc.querySelector('.play'),
    score = doc.querySelector('.score');




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
    }

    if (key.id === 'clear' || key.id === 'delete' || key.id === 'enter') {
        display.value == display.value;
    } else {
        if (display.value == '') {
            display.value = key.textContent;
        } else {
            display.value += key.textContent;
        };
    };

    if (key.id === 'enter') {
        comparisonOfDropAndInputValues();
    }
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
let drops = []; //массив капель
let dropCounter = 0; // счетчик капель

// функция для генерирования чисел с аргументом min, max, ограничивающим range
let GenerateNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let GenerateOperator = function () {
    let rand = Math.floor(Math.random() * arrOperators.length);
    return arrOperators[rand]; // возвращаешь оператор
}

let dropAappearance = function (id) {
    let drop = doc.querySelector('.drop-' + id);

    function randomDropAappearance(min, max) {
        drop.style.left = (Math.floor(Math.random() * (max - min + 1)) + min) - drop.clientWidth + 'px';
    };

    randomDropAappearance(drop.clientWidth, gameField.clientWidth);
}

let MoveDrop = function (id) {
    let dorp = doc.querySelector('.drop-' + id);

    dorp.style.top = gameField.clientHeight -
        gameField.lastElementChild.clientHeight -
        dorp.clientHeight + 5 + 'px';
}

let resultDrop = function (num1, operator, num2) {
    return eval(num1 + operator + num2);
}

let startDrop = function () {
    dropCounter++;
    let drop = new Object();
    drop.id = dropCounter;
    drop.operator = GenerateOperator();
    // if (drop.operator == '/') {
    //     //отдельная логика для деления
    // } else {
    // }
    drop.num1 = GenerateNumber(1, 10); // =  генерируешь первое число
    drop.num2 = GenerateNumber(1, 10); // = генерируешь второе число
    drop.result = resultDrop(drop.num1, drop.operator, drop.num2);

    drop.time = Date.now();

    drops.push(drop); // добавляем в массив

    gameField.insertAdjacentHTML('afterbegin',
        '<div class="drop drop-' + drop.id + '">' +
        '<span class="drop__numbers number-1">' + drop.num1 + '</span><br>' +
        '<span class="drop__operator">' + drop.operator + '</span><br>' +
        '<span class="drop__numbers number-2">' + drop.num2 + '</span>' +
        '</div>'
    );

    dropAappearance((drop.id));
    MoveDrop(drop.id);
    // setTimeout(function () {
    //     MoveDrop(drop.id)
    // }, 50);
    // console.log();
}
//-----------------
let alternativeRemoveDrop = function (id) {
    // пробегаешь по массиву и ищешь элемент с таким айди. удаляешь из html, удаляешь его через drops.splice
}

let addDrop = function () {
    setInterval(function () {
        startDrop()
    }, 5000)
}

let controller = function () {
    for (let drop of drops) {
        if (drop.time + 5000 < Date.now()) alert('lol');
    }
}

let comparisonOfDropAndInputValues = () => {
    let dropIndex = -1;
    let dropId = 0;
    console.log(display.value);
    for (var i = 0; i < drops.length; i++) {
        if (drops[i].result == display.value) {
            dropIndex = i;
            dropId = drops[i].id;
        };
    }

    let audioPop = new Audio();
    let audioSplash = new Audio();
    let audioError = new Audio();
    let scorePlus = doc.getElementById('score-20');
    let scoreMines = doc.getElementById('score-30');

    audioPop.src = '../sounds/pop-drop.mp3';
    audioSplash.src = '../sounds/splash-drop.mp3';
    audioError.src = '../sounds/error.mp3';

    if (dropIndex !== -1) {
        drops.splice(dropIndex, 1);
        score.textContent = Number(score.textContent) + 20;
        scorePlus.classList.add('score-active');
        setTimeout(function() {scorePlus.classList.remove('score-active')}, 1000);
        display.value = '';
        audioPop.play();
        audioSplash.play();
        splashDrop(dropId);
    } else {
        score.textContent = Number(score.textContent) - 30;
        scoreMines.classList.add('score-active');
        setTimeout(function() {scoreMines.classList.remove('score-active')}, 1000);
        display.value = '';
        audioError.play();
    }
}

let splashDrop = function (dropId) {
    let drop = doc.querySelector('.drop-' + dropId);
    drop.classList.add('drop-splash'); 
    setTimeout(function() {
        drop.remove();
    }, 1000)  
}


btnPlay.addEventListener('click', () => {
    startDrop();
    // addDrop();
    // setInterval(function() {controller()}, 100);


})

enterBtn.addEventListener('click', () => {
    comparisonOfDropAndInputValues();



})