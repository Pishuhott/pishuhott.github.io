let doc = document;
let numbersBtn = doc.querySelectorAll('.btn-number');
let clearBtns = doc.querySelectorAll('.btn-clear');
let enterBtn = doc.querySelector('.btn-enter');
let display = doc.querySelector('.display');
let gameField = doc.querySelector('.game-field');
let btnStatr = doc.querySelector('.start');
let btnSeetting = doc.querySelector('.settings');
let btnSeettingClosed = doc.querySelectorAll('.setting-closed');
let btnSettingOk = doc.querySelector('.setting-ok');
let btnSettingCancel = doc.querySelector('.setting-cancel');
let btnPlay = doc.querySelector('.play');
let score = doc.querySelector('.score');
let bestScore = doc.querySelector('.best-score');
let scorePlus = doc.getElementById('score-10');
let scoreMines = doc.getElementById('score-30');
let resultsWindow = doc.querySelector('.results-window');
let introwindow = doc.querySelector('.intro-window');
let dropLive = doc.querySelectorAll('.lives');
let operatorsRadio = doc.getElementsByName('operator-radio');
let numbersRadio = doc.getElementsByName('numbers-radio');
let audioPop = new Audio();
let audioPopBonus = new Audio();
let audioSplash = new Audio();
let audioError = new Audio();
let audioFallInSea = new Audio;
let audioGameOver = new Audio();
let arrDrops = [];
let dropsBonus = [];
let dropCounter = 0; // счетчик капель
let dropsCorrect = 0;
let dropsWrong = 0;
let arrOperators = ['-', '+'];
let tempArrOpreators = [];
let numberLevel = 10;
let tempNumberLevel = 10;
let speedDrop = 10000;
let resyltDrop;
let timeId;
let timeIdBunus;
let stopwatch;
let dropBonus;
let min = 0;
let sec = 0;

audioPop.src = './sounds/pop-drop.mp3';
audioPopBonus.src = './sounds/correct-bonus-answer.mp3'
audioSplash.src = './sounds/splash-drop.mp3';
audioError.src = './sounds/error.mp3';
audioFallInSea.src = './sounds/fall-in-sea.mp3';
audioGameOver.src = './sounds/game-over.mp3';



//---Calc--------------------------------------
let numberPress = (number) => {

    if (display.value == '') {
        display.value = number;
    } else {
        display.value += number;
    };
};

//---Entering data into the display------------
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

//---Clearing Display--------------------------
let clear = (id) => {
    if (id === 'clear') {
        display.value = '';
    } else if (id === 'delete') {
        display.value = display.value.slice(0, -1);
    };
}

//---Event Click-------------------------------
btnStatr.addEventListener('click', () => {
    introwindow.classList.remove('window-active');
});

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

btnSeetting.addEventListener('click', () => {
    doc.querySelector('.panel-settings').classList.add('settings-active');
})

for (let btnClosed of btnSeettingClosed) {
    btnClosed.addEventListener('click', () => {
        doc.querySelector('.panel-settings').classList.remove('settings-active');
    })
}

btnSettingOk.addEventListener('click', () => {
    for (numberRadio of numbersRadio) {
        if (numberRadio.checked) {
            numberLevel = numberRadio.value;
            break;
        };
    };

    for (operatorRadio of operatorsRadio) {
        if (operatorRadio.checked) {
            arrOperators = operatorRadio.value.split(' ');
            break;
        };
    };
})






//---Drop--------------------------------------

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

    randomDropAappearance(drop.clientWidth, gameField.clientWidth);
}

let MoveDrop = function (id) {
    let dorp = doc.querySelector('.drop-' + id);

    dorp.style.top = gameField.clientHeight -
        gameField.lastElementChild.clientHeight -
        dorp.clientHeight + 20 + 'px';
}

let resultDrop = function (num1, operator, num2) {
    return eval(num1 + operator + num2);
}
//---Adding a drop with variables--------------

let startDrop = function () {
    let tempNumber;
    let drop = new Object();
    drop.operator = GenerateOperator();
    dropCounter++;
    drop.id = dropCounter;
    // if (drop.operator == '/') {
    //     //отдельная логика для деления
    // } else {
    // }
    drop.num1 = GenerateNumber(1, numberLevel);
    drop.num2 = GenerateNumber(1, numberLevel);
    if (drop.num1 < drop.num2) {
        tempNumber = drop.num1;
        drop.num1 = drop.num2;
        drop.num2 = tempNumber;
    };

    drop.result = resultDrop(drop.num1, drop.operator, drop.num2);
    drop.time = Date.now();
    arrDrops.push(drop);

    gameField.insertAdjacentHTML('afterbegin',
        '<div class="drops drop drop-' + drop.id + '">' +
        '<span class="drop__numbers number-1">' + drop.num1 + '</span><br>' +
        '<span class="drop__operator">' + drop.operator + '</span><br>' +
        '<span class="drop__numbers number-2">' + drop.num2 + '</span>' +
        '</div>'
    );

    dropAappearance((drop.id));
    MoveDrop(drop.id);
}

let addDropBonus = function () {
    let tempNumber;
    let drop = new Object();
    drop.operator = GenerateOperator();

    dropCounter++;
    drop.id = dropCounter;
    // if (drop.operator == '/') {
    //     //отдельная логика для деления
    // } else {
    // }
    drop.num1 = GenerateNumber(1, numberLevel);
    drop.num2 = GenerateNumber(1, numberLevel);
    if (drop.num1 < drop.num2) {
        tempNumber = drop.num1;
        drop.num1 = drop.num2;
        drop.num2 = tempNumber;
    };

    drop.result = resultDrop(drop.num1, drop.operator, drop.num2);
    drop.time = Date.now();
    dropsBonus.push(drop);

    gameField.insertAdjacentHTML('afterbegin',
        '<div class="drops drop-bonus drop-' + drop.id + '">' +
        '<span class="drop__numbers number-1">' + drop.num1 + '</span><br>' +
        '<span class="drop__operator">' + drop.operator + '</span><br>' +
        '<span class="drop__numbers number-2">' + drop.num2 + '</span>' +
        '</div>'
    );
    dropAappearance((drop.id));
    MoveDrop(drop.id);

}

//-----------------
let alternativeRemoveDrop = function (id) {
    // пробегаешь по массиву и ищешь элемент с таким айди. удаляешь из html, удаляешь его через drops.splice
}

//---Receiving and transmitting the result of the game
let getBestScore = function () {
    if (localStorage.getItem('ScoreStorege') === null) {
        bestScore.textContent = 0;
        doc.querySelector('.results-best-score').textContent = 0;
    } else {
        bestScore.textContent = localStorage.getItem('ScoreStorege');
        doc.querySelector('.results-best-score').textContent = localStorage.getItem('ScoreStorege');
    };
}

let setBestScore = function () {
    if (score.textContent > Number(localStorage.getItem('ScoreStorege'))) {
        localStorage.setItem('ScoreStorege', score.textContent);
    };
    doc.querySelector('.results-score').textContent = score.textContent;
}

//---Game controller---------------------------
let fallCounter = 0;
let liveCounter = 0;

let controller = function () {
    let dropIndex = -1;
    let dropId = 0;
    let wave = doc.querySelector('.wave');

    for (let i = 0; i < arrDrops.length; i++) {
        if (arrDrops[i].time + 10000 < Date.now()) {
            fallCounter++;
            liveCounter++;
            dropsWrong++;
            dropIndex = i;
            dropId = arrDrops[i].id;
            arrDrops.splice(dropIndex, 1);
            doc.querySelector('.drop-' + dropId).remove();
            incorrectUnswer();
            wave.style.height = wave.clientHeight + 20 + 'px';
            audioFallInSea.currentTime = 0;
            audioFallInSea.play();

            if (liveCounter >= 3) {
                break;
            } else {
                doc.querySelector('.live-' + liveCounter).classList.add('live-delete');
            }
        };
    };



    if (fallCounter === 3) {
        setBestScore();
        dropResultsInTable();
        clearInterval(stopwatch);
        clearInterval(timeId);
        clearInterval(timeIdBunus);
        resultsWindow.classList.add('window-active');
        audioGameOver.play();
    }
}

//---Account increase function-----------------
let incorrectUnswer = function () {

        score.textContent = Number(score.textContent) - 20;
        scoreMines.classList.add('score-active');
        setTimeout(function () {
            scoreMines.classList.remove('score-active')
        }, 1000);
        display.value = '';

}

//---Equation result comparison function-------
let points = 10;
let comparisonOfDropAndInputValues = function () {
    scorePlus.textContent = '+' + points;

    if (display.value === '') {
        return;
    } else {
        let dropIndex = -1;
        let dropId = 0;

        for (let i = 0; i < arrDrops.length; i++) {
            if (arrDrops[i].result == display.value) {
                dropIndex = i;
                dropId = arrDrops[i].id;
            };
        };

        if (dropIndex !== -1) {
            arrDrops.splice(dropIndex, 1);
            score.textContent = Number(score.textContent) + points;
            scorePlus.classList.add('score-active');
            setTimeout(function () {
                scorePlus.classList.remove('score-active')
            }, 1000);
            display.value = '';
            audioPop.currentTime = 0;
            audioSplash.currentTime = 0;
            audioPop.play();
            audioSplash.play();
            splashDrop(dropId);
            points++;
            dropsCorrect++;

        } else {
            incorrectUnswer();
            audioError.currentTime = 0;
            audioError.play();
            dropsWrong++;
        };

        //---Reducing the dropout time with correct answers
        if (Number(score.textContent) >= 200) {
            speedDrop = 3000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                startDrop();
            }, speedDrop);

        } else if (Number(score.textContent) >= 140) {
            speedDrop = 5000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                startDrop();
            }, speedDrop);

        } else if (Number(score.textContent) >= 80) {
            speedDrop = 8000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                startDrop();
            }, speedDrop);
        };
    };
}

//---Animation function for drop when destroyed
let splashDrop = function (dropId) {
    let drop = doc.querySelector('.drop-' + dropId);
    drop.classList.add('drop-splash');
    setTimeout(function () {
        drop.remove();
    }, 1000)
}

//---stopwatch function------------------------
let tickTikc = function () {
    sec++;
    if (sec >= 60) {
        min++;
        sec = 0;
    };
    console.log(sec);
}

//---Function adding results to a table--------
let dropResultsInTable = function () {
    doc.querySelector('.result-drops-total').textContent = dropCounter;
    doc.querySelector('.result-drops-correct').textContent = dropsCorrect;
    doc.querySelector('.result-drops-wrong').textContent = dropsWrong;

    if (min < 10) {
        doc.querySelector('.stopwatch-min').textContent = '0' + min;
    } else {
        doc.querySelector('.stopwatch-min').textContent = min;
    };

    if (sec < 10) {
        doc.querySelector('.stopwatch-sec').textContent = ':0' + sec;
    } else {
        doc.querySelector('.stopwatch-sec').textContent = ':' + sec;
    }
}


btnPlay.addEventListener('click', () => {
    dropCounter = 0;
    dropsCorrect = 0;
    dropsWrong = 0;
    setTimeout(() => {
        startDrop();
        setInterval(() => {
            controller()
        }, 100);

        timeId = setInterval(() => {
            startDrop();
        }, 10000);
    }, 1000);

    setTimeout(() => {
        timeIdBunus = setInterval(() => {
            addDropBonus();
        }, 3000)
    }, 6000)

    stopwatch = setInterval(() => {
        tickTikc();
    }, 1000)

    getBestScore();

});

enterBtn.addEventListener('click', () => {
    comparisonOfDropAndInputValues();
})