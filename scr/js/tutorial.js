let doc = document;
let display = doc.querySelector('.display');
let dropContainer = doc.querySelector('.game-drop-container');
let score = doc.querySelector('.score');
let scorePlus = doc.getElementById('score-10');
let resultsWindow = doc.querySelector('.results-window');
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
let dropBonus;










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