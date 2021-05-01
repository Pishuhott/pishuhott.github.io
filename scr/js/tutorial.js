document.addEventListener("DOMContentLoaded", function () {
    let doc = document;
    let display = doc.querySelector('.display');
    let dropContainer = document.querySelector('.game-drop-container');
    let btnPlay = doc.querySelector('.play');
    let btnNext = doc.getElementById('next');
    let btnBack = doc.getElementById('back');
    let score = doc.querySelector('.score');
    let scorePlus = doc.getElementById('score-10');
    let scoreMines = doc.getElementById('score-20');
    let resultsWindow = doc.querySelector('.results-window');
    let sliders = doc.querySelector('.sliders');
    let slidersText = doc.querySelector('.sliders__text');
    let arrDrops = [];
    let arrOperators = ['+', '-', '*', '/'];
    let offset = 0;//Slider dimensions with instructions
    let dropCounter = 0;//Added drop counter
    let fallCounter = 0;//Counter fallen drop
    let timeControler; //Controler setInterval 
    let timeId; //Drop setInterval
    let timeIdBunus; //Bonus drop setInterval
    let eventList = ['click', 'touchend'];
    let demo; //demo setInterval
    let userImitation; //user imitation setInterval

    //---Event Click-------------------------------
    for (event of eventList) {
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
            document.location.href = './../scr/play.html';
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
    let randomDropAappearance = function (elem, min, max) {
        elem.style.left = (Math.floor(Math.random() * (max - min + 1)) + min) - elem.clientWidth + 'px';
    };

    let dropAappearance = function (id) {
        let drop = doc.querySelector('.drop-' + id);
        randomDropAappearance(drop, drop.clientWidth, dropContainer.clientWidth);
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
        drop.duration = 11000;
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

    //---Game controller---------------------------
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
            clearInterval(timeControler);
            clearInterval(timeId);
            clearInterval(timeIdBunus);
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
        for (let i = 0; i < arrDrops.length; i++) {
            if (arrDrops[i].result == displayValue) {
                correct = true;
                dropIndex = i;
                dropId = arrDrops[i].id;

                score.textContent = Number(score.textContent) + 10;
                scorePlus.classList.add('score-active')
                setTimeout(() => {
                    scorePlus.classList.remove('score-active')
                }, 1000);
                splashDrop(dropId);
                display.value = '';
                arrDrops.splice(dropIndex, 1);
                break;
            };

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

    //---Demonstration of the game-------------
    let demoOne = function (drop) {
        addDrop(false);
        demo = setInterval(() => {
            drop++
            addDrop(false);
            if (drop >= 2) {
                clearInterval(demo);
            }
        }, 3000);

        userImitation = setInterval(() => {
            imitationSolution();
            if (drop >= 2) {
                clearInterval(userImitation);
            }
        }, 2500)
    }

    let demoTwo = function (drop) {
        let dropId = 0;
        let totalDrops = 0;

        addDrop(false);
        demo = setInterval(() => {
            drop++
            addDrop(false);
            if (drop >= 4) {
                clearInterval(demo);
            }
        }, 1500);

        setTimeout(() => {
            addDropBonus();
        }, 7000);

        setTimeout(() => {
            for (let i = 0; i < arrDrops.length; i++) {
                if (arrDrops[i].bonus === true) {
                    dropId = arrDrops[i].id;
                    totalDrops = arrDrops.length - 1;
                    display.value = arrDrops[i].result;
                    setTimeout(() => {
                        scorePlus.textContent = '+' + (totalDrops * 10 + 50);
                        score.textContent = Number(score.textContent) 
                            + Number(scorePlus.textContent);
                        scorePlus.classList.add('score-active')
                        setTimeout(() => {
                            scorePlus.classList.remove('score-active')
                        }, 1000);
                        splashDropBonus(dropId);
                        setTimeout(() => {
                            dropContainer.innerHTML = ''
                            arrDrops = [];
                        }, 1000);
                        display.value = '';
                    }, 1000)
                };
            };
        }, 8000)
    }

    let demoThree = function (drop) {
        demo = setInterval(() => {
            drop++
            addDrop(false);
            if (drop >= 4) {
                clearInterval(demo);
            }
        }, 2000);

        timeControler = setInterval(() => {
            controller();
        }, 100);
    }

    let imitationSolution = function () {
        for (let i = 0; i < arrDrops.length; i++) {
            display.value = arrDrops[i].result;
        }
        setTimeout(() => {
            comparisonOfDropAndInputValues();
        }, 1000);
    }

    let autoPlay = function () {
        let i = 0;
        setTimeout(() => {
            demoOne(i);
        }, 2000);

        setTimeout(() => {
            demoTwo(i);
        }, 15000);

        setTimeout(() => {
            demoThree(i);
        }, 22000);

        setTimeout(() => {
            fallCounter = 0;
            dropContainer.innerHTML = ''
            arrDrops = [];
            doc.querySelector('.wave').style.height = 15 + '%';
            scorePlus.textContent = '+10'
            score.textContent = 0;
            resultsWindow.classList.remove('window-active');
            autoPlay();
        }, 44000);
    }

    autoPlay();

});
