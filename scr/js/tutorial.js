let doc = document;
let numbersBtn = doc.querySelectorAll('.btn-number');
let clearBtns = doc.querySelectorAll('.btn-clear');
let enterBtn = doc.querySelector('.btn-enter');
let display = doc.querySelector('.display');
let dropContainer = document.querySelector('.game-drop-container');
let btnSeetting = doc.querySelector('.settings');
let btnSettingOk = doc.querySelector('.setting-ok');
let btnPlay = doc.querySelector('.play');
let howToPlay = doc.querySelector('.howToPlay');
let score = doc.querySelector('.score');
let bestScore = doc.querySelector('.best-score');
let scorePlus = doc.getElementById('score-10');
let scoreMines = doc.getElementById('score-20');
let resultsWindow = doc.querySelector('.results-window');
let btnContinue = doc.querySelector('.btn-continue');
let dropLive = doc.querySelectorAll('.lives');
let operatorsRadio = doc.getElementsByName('operator-radio');
let numbersRadio = doc.getElementsByName('numbers-radio');
let btnStopAudio = doc.querySelector('.sound-on');
let btnFullScren = doc.querySelector('.full-scren');
let btnNext = doc.getElementById('next');
let btnBack = doc.getElementById('back');
let sliders = doc.querySelector('.sliders');
let slidersText = doc.querySelector('.sliders__text');
let offset = 0;
let audioOn = true;
let arrDrops = [];
let dropsBonus = [];
let dropCounter = 0;
let dropsCorrect = 0;
let dropsWrong = 0;
let arrOperators = ['-', '+', '*', '/'];
let tempArrOpreators = [];
let numberLevel = 10;
let numberLevel1 = 1;
let numberLevel2 = numberLevel;
let tempNumberLevel = 10;
let speedDrop = 10000;
let resyltDrop;
let timeControler;
let timeId;
let timeIdBunus;
let stopwatch;
let dropBonus;
let min = 0;
let sec = 0;
let eventList = ['click', 'touchend'];



//---Calc--------------------------------------
let numberPress = (number) => {

    if (display.value == '') {
        display.value = number;
    } else {
        display.value += number;
    };
};

//---Entering data into the display------------


//---Clearing Display--------------------------

//---Event Click-------------------------------
for (event of eventList) {

    enterBtn.addEventListener(event, () => {
        comparisonOfDropAndInputValues();
    })


    btnNext.addEventListener(event, () => {
        offset += slidersText.clientWidth;
        if (offset < (slidersText.clientWidth * 3)) {
            sliders.style.left = -offset +'px';
        } else {
            offset = (slidersText.clientWidth * 2);
        };

        if ( offset == (slidersText.clientWidth * 2)) {
            btnNext.classList.add('inactive'); 
        };
        btnBack.classList.remove('inactive'); 
    })

    btnBack.addEventListener(event, () => {
        offset -= slidersText.clientWidth;
        if (offset >= 0) {
            sliders.style.left = -offset +'px';            
        } else {
            offset = 0;
        };

        if (offset == 0) {
            btnBack.classList.add('inactive'); 
        };
        btnNext.classList.remove('inactive');
    })

    btnPlay.addEventListener(event, () => {
        addDrop(false);
        timeId = setInterval(() => {
            addDrop(false);
        }, 5000);

        timeControler = setInterval(() => {
            controller()
        }, 100);

        timeIdBunus = setInterval(() => {
            addDropBonus();
        }, 16000)
    });
}

//---Number generator--------------------------
let GenerateNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//---Operator generator------------------------
let GenerateOperator = function () {
    let rand = Math.floor(Math.random() * arrOperators.length);
    return arrOperators[rand]; // возвращаешь оператор
}
//--The appearance of a drop in a random place-
let dropAappearance = function (id) {
    let drop = doc.querySelector('.drop-' + id);

    function randomDropAappearance(min, max) {
        drop.style.left = (Math.floor(Math.random() * (max - min + 1)) + min) - drop.clientWidth + 'px';
    };

    randomDropAappearance(drop.clientWidth, dropContainer.clientWidth);
}

let MoveDrop = function (id) {
    let dorp = doc.querySelector('.drop-' + id);

    dorp.style.top = dropContainer.clientHeight -
        dropContainer.lastElementChild.clientHeight -
        dorp.clientHeight + 20 + 'px';
}

let resultDrop = function (num1, operator, num2) {
    return eval(num1 + operator + num2);
}

//---Adding a drop with variables--------------
let addDrop = function (trueOrFalse) {
    dropCounter++;
    let tempNumber;
    let drop = new Object();

    drop.bonus = trueOrFalse;
    drop.id = dropCounter;
    drop.duration = 10000;
    drop.time = Date.now();
    drop.operator = GenerateOperator();
    drop.num1 = GenerateNumber(numberLevel1, numberLevel2);
    drop.num2 = GenerateNumber(numberLevel1, numberLevel2);

    if (drop.num1 < drop.num2) {
        tempNumber = drop.num1;
        drop.num1 = drop.num2;
        drop.num2 = tempNumber;
    };

    if (drop.operator == '/') {
        drop.result = drop.num1;
        drop.num1 = drop.num2 * drop.result;
    };


    drop.result = resultDrop(drop.num1, drop.operator, drop.num2);

    dropContainer.insertAdjacentHTML('afterbegin',
        '<div class="drop drop-' + drop.id + '">' +
        '<span class="drop__numbers number-1">' + drop.num1 + '</span><br>' +
        '<span class="drop__operator">' + drop.operator + '</span><br>' +
        '<span class="drop__numbers number-2">' + drop.num2 + '</span>' +
        '</div>'
    );

    if (drop.bonus === true) {
        drop.duration = 5000;
        doc.querySelector('.drop').classList.add('drop-bonus');
    };
    arrDrops.push(drop);
    dropAappearance((drop.id));
    MoveDrop(drop.id);
}

let addDropBonus = function () {
    addDrop(true);
}

//---Receiving and transmitting the result of the game

//---Game controller---------------------------
let fallCounter = 0;
let liveCounter = 0;

let controller = function () {
    let dropIndex = -1;
    let dropId = 0;
    let wave = doc.querySelector('.wave');

    for (let i = 0; i < arrDrops.length; i++) {
        if (arrDrops[i].time + arrDrops[i].duration < Date.now()) {
            dropIndex = i;
            dropId = arrDrops[i].id;
            if (arrDrops[i].bonus === false) {
                wave.style.height = wave.clientHeight + 20 + 'px';
                incorrectUnswer();
                RemoveDrop(dropIndex, dropId);

                fallCounter++;

                
            } else {
                RemoveDrop(dropIndex, dropId);
            };
        };
    };

    if (fallCounter === 3) {
        clearInterval(stopwatch);
        clearInterval(timeId);
        clearInterval(timeIdBunus);
        clearInterval(timeControler);
        resultsWindow.classList.add('window-active');
    };
}

let RemoveDrop = function (dropIndex, dropId) {
    arrDrops.splice(dropIndex, 1);
    doc.querySelector('.drop-' + dropId).remove();

}

//---Account increase function-----------------
let incorrectUnswer = function () {
    score.textContent = Number(score.textContent) - 20;
    scoreMines.classList.add('score-active');
    setTimeout(() => {
        scoreMines.classList.remove('score-active')
    }, 1000);
    dropsWrong++;
}

//---Equation result comparison function-------
let points = 10;
let displayValue;
let comparisonOfDropAndInputValues = function () {
    let correct = false;
    displayValue = display.value;
    scorePlus.textContent = '+' + points;

    if (displayValue === '' || arrDrops == '') {
        return;
    } else {
        let dropIndex = -1;
        let dropId = 0;
        let dropBonus = false;
        for (let i = 0; i < arrDrops.length; i++) {
            if (arrDrops[i].result == displayValue) {
                correct = true;
                dropIndex = i;
                dropId = arrDrops[i].id;
                dropBonus = arrDrops[i].bonus;

                if (dropBonus === false) {
                    score.textContent = Number(score.textContent) + points;
                    scorePlus.classList.add('score-active')
                    setTimeout(() => {
                        scorePlus.classList.remove('score-active')
                    }, 1000);
                    splashDrop(dropId);
                    audioPlay(audioPop, audioOn);
                    arrDrops.splice(dropIndex, 1);

                } else {
                    score.textContent = Number(score.textContent) + 50;
                    scorePlus.classList.add('score-active')
                    setTimeout(() => {
                        scorePlus.classList.remove('score-active')
                    }, 1000);
                    splashDropBonus(dropId);
                    setTimeout(() => {
                        dropContainer.innerHTML = ''
                        arrDrops = [];
                    }, 1000)
                    audioPlay(audioPopBonus, audioOn);
                };

                display.value = '';
                audioPlay(audioSplash, audioOn)
                points++;
                dropsCorrect++;
                break;
            }
        };

        if (correct === false) {
            display.value = '';
            incorrectUnswer();
            audioPlay(audioError, audioOn);
            dropsWrong++;
        };        
    };
}

//---Animation function for drop when destroyed
let splashDrop = function (dropId) {
    let drop = doc.querySelector('.drop-' + dropId);
    drop.classList.add('drop-splash');
    setTimeout(() => {
        drop.remove();
    }, 1000)
}

let splashDropBonus = function (dropId) {
    let drop = doc.querySelector('.drop-' + dropId);
    drop.classList.add('drop-splash-bonus');
    setTimeout(() => {
        drop.remove();
    }, 1000)

}

