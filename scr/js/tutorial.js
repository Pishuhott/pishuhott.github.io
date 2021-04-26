let doc = document;
let numbersBtn = doc.querySelectorAll('.btn-number');
let clearBtns = doc.querySelectorAll('.btn-clear');
let enterBtn = doc.querySelector('.btn-enter');
let display = doc.querySelector('.display');
let dropContainer = doc.querySelector('.game-drop-container');
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
let btnContinue = doc.querySelector('.btn-continue');
let dropLive = doc.querySelectorAll('.lives');
let operatorsRadio = doc.getElementsByName('operator-radio');
let numbersRadio = doc.getElementsByName('numbers-radio');
let btnStopAudio = doc.querySelector('.sound-off');
let audioPop = new Audio();
let audioPopBonus = new Audio();
let audioSplash = new Audio();
let audioError = new Audio();
let audioFallInSea = new Audio;
let audioGameOver = new Audio();
let arrDrops = [];
let dropsBonus = [];
let dropCounter = 0; 
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

audioPop.src = '../../sounds/pop-drop.mp3';
audioPopBonus.src = '../../sounds/correct-bonus-answer.mp3'
audioSplash.src = '../../sounds/splash-drop.mp3';
audioError.src = '../../sounds/error.mp3';
audioFallInSea.src = '../../sounds/fall-in-sea.mp3';
audioGameOver.src = '../../sounds/game-over.mp3';



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
    doc.querySelector('.panel-settings').classList.remove('settings-active');
})

btnContinue.addEventListener('click', () => {
    resultsWindow.classList.remove('window-active');
    setTimeout(() => {
        location.reload();
    }, 1100)
})

btnStopAudio.addEventListener('click', () => {
    audioPop.pause();
    audioPopBonus.pause();
    audioSplash.pause();
    audioError.pause();
    audioFallInSea.pause();
    audioGameOver.pause();

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
    let tempNumber;
    let drop = new Object();
    // let randTimeBonus = GenerateNumber(1, 8);
    drop.operator = GenerateOperator();
    dropCounter++;
    drop.id = dropCounter;

    drop.num1 = GenerateNumber(1, numberLevel);
    drop.num2 = GenerateNumber(1, numberLevel);
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
    drop.bonus = trueOrFalse;
    drop.duration = 10000;
    drop.time = Date.now();

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
    }
    arrDrops.push(drop);
    console.log(drop);
    dropAappearance((drop.id));
    MoveDrop(drop.id);
}

let addDropBonus = function () {
    addDrop(true);
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
        if (arrDrops[i].time + arrDrops[i].duration < Date.now()) {
            dropIndex = i;
            dropId = arrDrops[i].id;
            dropsWrong++;
            if (arrDrops[i].bonus === false) {
                fallCounter++;
                liveCounter++;
                incorrectUnswer();
                wave.style.height = wave.clientHeight + 20 + 'px';
                audioFallInSea.currentTime = 0;
                audioFallInSea.play();
                RemoveDrop(dropIndex, dropId);

                if (liveCounter >= 3) {
                    break;
                } else {
                    doc.querySelector('.live-' + liveCounter).classList.add('live-delete');
                }
            } else {
                audioFallInSea.currentTime = 0;
                audioFallInSea.play();            
                RemoveDrop(dropIndex, dropId);
            }
        };

    };

    // if (fallCounter === 3) {
    //     setBestScore();
    //     dropResultsInTable();
    //     clearInterval(stopwatch);
    //     clearInterval(timeId);
    //     clearInterval(timeIdBunus);
    //     resultsWindow.classList.add('window-active');
    //     audioGameOver.play();
    // }
}

let RemoveDrop = function (dropIndex, dropId) {
    arrDrops.splice(dropIndex, 1);
    doc.querySelector('.drop-' + dropId).remove();

}

//---Account increase function-----------------
let incorrectUnswer = function (dropBinus) {
    if (dropBinus !== true) {
        score.textContent = Number(score.textContent) - 20;
        scoreMines.classList.add('score-active');
        setTimeout(function () {
            scoreMines.classList.remove('score-active')
        }, 1000);
    } 
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
        let dropBonus;


        for (let i = 0; i < arrDrops.length; i++) {
            if (arrDrops[i].result == display.value) {
                dropIndex = i;
                dropId = arrDrops[i].id;
                dropBonus = arrDrops[i].bonus;
            } 

            if (dropIndex !== -1) {
                if (dropBonus !== true) {
                    score.textContent = Number(score.textContent) + points;
                    splashDrop(dropId);
                } else {
                    splashDropBonus(dropId);
                    score.textContent = Number(score.textContent) + 50;
                    scorePlus.textContent = '+50';
                    setTimeout(() => {
                        dropContainer.innerHTML = '';
                        arrDrops = [];
                    }, 500)
                }
                scorePlus.classList.add('score-active');
                setTimeout(function () {
                    scorePlus.classList.remove('score-active')
                }, 1000);
                display.value = '';
                audioPop.currentTime = 0;
                audioSplash.currentTime = 0;
                audioPop.play();
                audioSplash.play();
                
                arrDrops.splice(dropIndex, 1);
                points++;
                dropsCorrect++;

            } else { 
                dropsWrong++;
                incorrectUnswer();
                display.value = '';
                audioError.currentTime = 0;
                audioError.play();
            }
        };

        //---Reducing the dropout time with correct answers
        if (Number(score.textContent) >= 70) {
            speedDrop = 3000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                addDrop(false);
            }, speedDrop);

        } else if (Number(score.textContent) >= 50) {
            speedDrop = 5000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                addDrop(false);
            }, speedDrop);

        } else if (Number(score.textContent) >= 30) {
            speedDrop = 8000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                addDrop(false);
            }, speedDrop);
            console.log('speed 2')

        } else if (Number(score.textContent) < 30) {
            speedDrop = 10000;
            clearInterval(timeId);
            timeId = setInterval(function () {
                addDrop(false);
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

let splashDropBonus = function (dropId) {
    let drop = doc.querySelector('.drop-' + dropId);
    drop.classList.add('drop-splash-bonus');
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
    // console.log(sec);
}

//---Function adding results to a table--------
let dropResultsInTable = function () {
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

    doc.querySelector('.result-drops-total').textContent = dropCounter - 1;
    doc.querySelector('.result-drops-correct').textContent = dropsCorrect;
    doc.querySelector('.result-drops-wrong').textContent = dropsWrong;
}


btnPlay.addEventListener('click', () => {
    dropCounter = 0;
    dropsCorrect = 0;
    dropsWrong = 0;
    setTimeout(() => {
        addDrop(false);
        setInterval(() => {
            controller()
        }, 100);

        timeId = setInterval(() => {
            addDrop(false);
        }, 10000);
    }, 1000);

    setTimeout(() => {
        addDropBonus;
        timeIdBunus = setInterval(() => {
            addDropBonus();
        }, 16000)
    }, 17000)

    stopwatch = setInterval(() => {
        tickTikc();
    }, 1000)

    getBestScore();

});

enterBtn.addEventListener('click', () => {
    setTimeout(() => {
        comparisonOfDropAndInputValues();
    }, 100);
})

document.addEventListener("DOMContentLoaded", function () {

});