let doc = document;
let enterBtn = doc.querySelector('.btn-enter');
let btnNumbers = doc.querySelectorAll('.btn-number');
let display = doc.querySelector('.display');
let dropContainer = document.querySelector('.game-drop-container');
let btnPlay = doc.querySelector('.play');
let score = doc.querySelector('.score');
let scorePlus = doc.getElementById('score-10');
let scoreMines = doc.getElementById('score-20');
let resultsWindow = doc.querySelector('.results-window');
let btnNext = doc.getElementById('next');
let btnBack = doc.getElementById('back');
let sliders = doc.querySelector('.sliders');
let slidersText = doc.querySelector('.sliders__text');
let offset = 0;
let arrDrops = [];
let dropCounter = 0;
let arrOperators = ['+', '-', '*', '/'];
let timeControler;
let timeId;
let timeIdBunus;
let eventList = ['click', 'touchend'];
let demo1;
let demoImitation1;
let demo2;
let demo3;

//---Calc--------------------------------------
let numberPress = (number) => {

    if (display.value == '') {
        display.value = number;
    } else {
        display.value += number;
    };
};

//---Event Click-------------------------------
for (event of eventList) {
    enterBtn.addEventListener(event, () => {
        comparisonOfDropAndInputValues();
    })

    btnNext.addEventListener(event, () => {
        offset += slidersText.clientWidth;
        if (offset < (slidersText.clientWidth * 3)) {
            sliders.style.left = -offset + 'px';
        } else {
            offset = (slidersText.clientWidth * 2);
        };

        if (offset == (slidersText.clientWidth * 2)) {
            btnNext.classList.add('inactive');
        };
        btnBack.classList.remove('inactive');
    })

    btnBack.addEventListener(event, () => {
        offset -= slidersText.clientWidth;
        if (offset >= 0) {
            sliders.style.left = -offset + 'px';
        } else {
            offset = 0;
        };

        if (offset == 0) {
            btnBack.classList.add('inactive');
        };
        btnNext.classList.remove('inactive');
    })

    btnPlay.addEventListener(event, () => {
        let i = 0;
        setTimeout(() => {
            demoOne(i);
        }, 1000)

        setTimeout(() => {
            demoTwo(i);
        }, 13000)

        setTimeout(() => {
            demoThree(i);
        }, 20000)
        

    });
}

//---Number generator--------------------------
let GenerateNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//---Operator generator------------------------
let GenerateOperator = function () {
    let rand = Math.floor(Math.random() * arrOperators.length);
    return arrOperators[rand];
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
    drop.num1 = GenerateNumber(1, 10);
    drop.num2 = GenerateNumber(1, 10);

    if (drop.num1 < drop.num2) {
        tempNumber = drop.num1;
        drop.num1 = drop.num2;
        drop.num2 = tempNumber;
    };

    if (drop.operator == '/') {
        drop.result = drop.num1;
        drop.num1 = drop.num2 * drop.result;
    };

    drop.result = resultDrop(drop.num1, drop.operator, drop.num2)
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
    dropAappearance(drop.id);
    MoveDrop(drop.id);
}

let addDropBonus = function () {
    addDrop(true);
}

//---Receiving and transmitting the result of the game

//---Game controller---------------------------
let fallCounter = 0;
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
}

//---Equation result comparison function-------
let displayValue;
let comparisonOfDropAndInputValues = function () {
    let correct = false;
    displayValue = display.value;

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
                score.textContent = Number(score.textContent) + 10;
                scorePlus.classList.add('score-active')
                setTimeout(() => {
                    scorePlus.classList.remove('score-active')
                }, 1000);
                splashDrop(dropId);
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
            };

            display.value = '';
            break;
        }

        if (correct === false) {
            display.value = '';
            incorrectUnswer();
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

let demoOne = function(drop) {
    addDrop(false);    
    demo1 = setInterval(() => {
        drop++
        addDrop(false);
        if (drop >= 2) {
            clearInterval(demo1);
        }
    }, 3000);

    demoImitation1 = setInterval(() => {
        imitationSolution();
        if (drop >= 2) {
            clearInterval(demoImitation1);
        }
        console.log(i)
    }, 2500)
}

let demoTwo = function(drop) {
    let dropId = 0;
    let ccc = true;
    addDrop(false);    
    demo2 = setInterval(() => {
        drop++
        addDrop(false);
        if (drop >= 4) {
            clearInterval(demo2);
        }
    }, 1500);

    setTimeout(() => {
        addDropBonus();
    }, 7000)

    setTimeout(() => {

        for (let i = 0; i < arrDrops.length; i++) {
            if (arrDrops[i].bonus === true) {
                dropId = arrDrops[i].id;
                display.value = arrDrops[i].result
                scorePlus.textContent = '+50'
                score.textContent = + 50;
                scorePlus.classList.add('score-active')
                setTimeout(() => {
                    scorePlus.classList.remove('score-active')
                }, 1000);
                splashDropBonus(dropId);
                setTimeout(() => {
                    dropContainer.innerHTML = ''
                    arrDrops = [];
                }, 1000)
            }
            display.value = '';
        }        


    }, 8000)
}

let demoThree = function (drop) {
    demo1 = setInterval(() => {
        drop++
        addDrop(false);
        if (drop >= 4) {
            clearInterval(demo1);
        }
    }, 2000);

    timeControler = setInterval(() => {
        controller();
    }, 100)
}

let imitationSolution = function () {
    for (let i = 0; i < arrDrops.length; i++) {
        display.value = arrDrops[i].result;
    }
    setTimeout(() => {
        comparisonOfDropAndInputValues();
    }, 1000)
}




document.addEventListener("DOMContentLoaded", function () {
    
});