document.addEventListener("DOMContentLoaded", function () {
    let doc = document;
    let btnNumbers = doc.querySelectorAll('.btn-number');
    let btnClear = doc.querySelectorAll('.btn-clear');
    let btnEnter = doc.querySelector('.btn-enter');
    let btnSeetting = doc.querySelector('.settings');
    let btnSettingOk = doc.querySelector('.setting-ok');
    let btnSettingCencel = doc.querySelector('.setting-cencel');
    let btnPlay = doc.querySelector('.play');
    let btnHowToPlay = doc.querySelector('.howToPlay');
    let btnStopAudio = doc.querySelector('.sound-on');
    let btnFullScren = doc.querySelector('.full-scren');
    let btnContinue = doc.querySelector('.btn-continue');
    let display = doc.querySelector('.display');
    let dropContainer = document.querySelector('.game-drop-container');
    let score = doc.querySelector('.score');
    let bestScore = doc.querySelector('.best-score');
    let scorePlus = doc.getElementById('score-10');
    let scoreMines = doc.getElementById('score-20');
    let resultsWindow = doc.querySelector('.results-window');
    let operatorsRadio = doc.getElementsByName('operator-radio');
    let numbersRadio = doc.getElementsByName('numbers-radio');
    let allRadioBtn = doc.querySelectorAll('.radio-btn');
    let soundStatus = 'on';
    let audioSea = new Audio();
    let audioPop = new Audio();
    let audioPopBonus = new Audio();
    let audioSplash = new Audio();
    let audioError = new Audio();
    let audioFallInSea = new Audio();
    let audioGameOver = new Audio();
    let audioOn = true; //Audio on indicator
    let arrDrops = [];
    let arrOperators = ['-', '+', '*', '/'];
    let dropCounter = 0; //Added drop counter
    let dropsCorrect = 0; //Drop counter with correct answers
    let dropsWrong = 0; //Counter of drops with incorrect answers
    let fallCounter = 0; //Counter fallen drop
    let liveCounter = 0; //Life counter
    let numberLevel = 10; //Default random number
    let numberLevel1 = 1; //First number random number
    let numberLevel2 = 10; //Second number random number
    let speedDrop = 10000; //Speed droop drop
    let timeControler; //Controler setInterval 
    let timeId; //Drop setInterval
    let timeIdBunus; //Bonus drop setInterval
    let stopwatch; //Stopwatch setInterval
    let min = 0; //Stopwatch minutes
    let sec = 0; //Stopwatch seconds
    let eventList = ['click', 'touchend']
    let startGame = false; //Game start indicator

    audioSea.src = './assets/audio/sea.mp3';
    audioSea.loop = true;
    audioPop.src = './assets/audio/pop-drop.mp3';
    audioPopBonus.src = './assets/audio/correct-bonus-answer.mp3'
    audioSplash.src = './assets/audio/splash-drop.mp3';
    audioError.src = './assets/audio/error.mp3';
    audioFallInSea.src = './assets/audio/fall-in-sea.mp3';
    audioGameOver.src = './assets/audio/game-over.mp3';

    //---Receiving and transmitting radio buttons 
    //---from the local data storage
    let getlocalStorageValue = function () {
        if(localStorage.getItem('sound-status') !== null) {
            btnStopAudio.classList.add(`sound-${localStorage.getItem('sound-status')}`);
            soundStatus = localStorage.getItem('sound-status');
        }

        checkingValueRadioBtn();
        numberLevel = localStorage.getItem('RadioBtnNumber');
        arrOperators = localStorage.getItem('RadioBtnOperator').split(' ');
    }

    let checkingValueRadioBtn = function () {
        for (numberRadio of numbersRadio) {
            if (numberRadio.checked) {
                localStorage.setItem('RadioBtnNumber', numberRadio.value);
                setDataRadioBtn(numberRadio);
                break;
            }
        }

        for (operatorRadio of operatorsRadio) {
            if (operatorRadio.checked) {
                localStorage.setItem('RadioBtnOperator', operatorRadio.value);
                setDataRadioBtn(operatorRadio)
                break;
            }
        }
    }

    let setDataRadioBtn = function (elem) {
        localStorage.setItem(elem.getAttribute('name'), elem.getAttribute('id'));
    }

    let getDataRdioBtn = function (item) {
        return localStorage.getItem(item);
    }
    //---checking radio buttons for 'checked'
    for (radioBtn of allRadioBtn) {
        if (radioBtn.getAttribute('id') == getDataRdioBtn(radioBtn.getAttribute('name'))) {
            radioBtn.checked = true;
        }
    }

    //---Event Click-------------------------------
    for (event of eventList) {
        for (let number of btnNumbers) {
            number.addEventListener(event, function (e) {
                numberPress(e.target.textContent)
                return false;
            });
        }

        for (let clearBtn of btnClear) {
            clearBtn.addEventListener(event,
                (e) => clear(e.srcElement.id));
        }

        btnEnter.addEventListener(event, () => {
            comparisonOfDropAndInputValues();
        })

        btnStopAudio.addEventListener(event, () => {
            btnStopAudio.classList.toggle('sound-off');
            if (btnStopAudio.className == 'sound-on sound-off') {
                audioOn = false;
                audioSea.pause()
                localStorage.setItem('sound-status', 'off')
            } else {
                audioOn = true;
                audioPlay(audioSea, audioOn);
                localStorage.setItem('sound-status', 'on')
            }

        })

        btnSeetting.addEventListener(event, () => {
            doc.querySelector('.panel-settings').classList.add('settings-active');
        })

        btnSettingOk.addEventListener(event, () => {
            checkingValueRadioBtn();
            doc.querySelector('.panel-settings').classList.remove('settings-active');
            setTimeout(() => {
                location.reload();
            }, 1100)
        })

        btnSettingCencel.addEventListener(event, () => {
            for (radioBtn of allRadioBtn) {
                if (radioBtn.getAttribute('id') == getDataRdioBtn(radioBtn.getAttribute('name'))) {
                    radioBtn.checked = true;
                }
            }
            doc.querySelector('.panel-settings').classList.remove('settings-active');
        })

        btnContinue.addEventListener(event, () => {
            resultsWindow.classList.remove('window-active');
            setTimeout(() => {
                location.reload();
            }, 1100)
        })

        btnFullScren.addEventListener(event, () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        }, false);

        btnPlay.addEventListener(event, () => {
            if (startGame === false) {
                addDrop(false);
                timeId = setInterval(() => {
                    addDrop(false);
                }, 10000);
                bonusAdd = setTimeout(() => {
                    timeIdBunus = setInterval(() => {
                        addDropBonus();
                    }, 20000)
                }, 15000)

                timeControler = setInterval(() => {
                    controller()
                }, 100);


                stopwatch = setInterval(() => {
                    tickTikc();
                }, 1000)

                getBestScore();

                if (soundStatus === 'on') {
                    audioPlay(audioSea, audioOn);
                } else {
                    audioOn = false;
                }
            }
            startGame = true;
        })

        btnHowToPlay.addEventListener(event, () => {
            document.location.href = './../scr/tutorial.html';
        })
    }

    let audioPlay = function (audioId, audioOn) {
        if (audioOn) {
            if (audioId == audioPop) {
                audioPop.currentTime = 0;
                audioPop.play();
            } else if (audioId == audioPopBonus) {
                audioPopBonus.currentTime = 0;
                audioPopBonus.play();
            } else if (audioId == audioSplash) {
                audioSplash.currentTime = 0;
                audioSplash.play();
            } else if (audioId == audioError) {
                audioError.currentTime = 0;
                audioError.play();
            } else if (audioId == audioFallInSea) {
                audioFallInSea.currentTime = 0;
                audioFallInSea.play();
            } else if (audioId == audioGameOver) {
                audioGameOver.currentTime = 0;
                audioGameOver.play();
            }
            if (audioId == audioSea) {
                audioSea.currentTime = 0;
                audioSea.play();
            }
        }
    }

    //---Calc--------------------------------------
    let numberPress = (number) => {
        if (display.value == '') {
            display.value = number;
        } else {
            display.value += number;
        }
    }

    //---Entering data into the display------------
    let KeyDownValue = (code) => {
        let key = doc.querySelector(`.btn[data-key='${code}']`);

        if (key.id === 'clear') {
            display.value = '';
        } else if (key.id === 'delete') {
            display.value = display.value.slice(0, -1);
        }

        if (key.id === 'clear' || key.id === 'delete' || key.id === 'enter') {
            display.value = display.value;
        } else {
            if (display.value == '') {
                display.value = key.textContent;
            } else {
                display.value += key.textContent;
            }
        }

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
        }
    }

    window.addEventListener('keydown',
        (e) => KeyDownValue(e.keyCode));

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
    let randomDropAappearance = function(elem, min, max) {
        elem.style.left = (Math.floor(Math.random() * (max - min + 1)) + min) - elem.clientWidth + 'px';
    }

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

    //Getting the result of an equation from a drop
    let resultDrop = function (num1, operator, num2) {
        return eval(num1 + operator + num2);
    }

    //---Adding a drop with variables--------------
    let addDrop = function (trueOrFalse) {
        numberLevel2 = numberLevel;
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
        }

        if (drop.operator == '/') {
            drop.result = drop.num1;
            drop.num1 = drop.num2 * drop.result;
        }

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
        }
        arrDrops.push(drop);
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
        }
    }

    let setBestScore = function () {
        if (score.textContent > Number(localStorage.getItem('ScoreStorege'))) {
            localStorage.setItem('ScoreStorege', score.textContent);
        }
        doc.querySelector('.results-score').textContent = score.textContent;
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
                    audioPlay(audioFallInSea, audioOn);
                    RemoveDrop(dropIndex, dropId);
                    liveCounter++;
                    fallCounter++;

                    if (liveCounter >= 3) {
                        break;
                    } else {
                        doc.querySelector('.live-' + liveCounter).classList.add('live-delete');
                    }
                } else {
                    audioPlay(audioFallInSea, audioOn);
                    RemoveDrop(dropIndex, dropId);
                }
            }
        }

        if (fallCounter === 3) {
            setBestScore();
            dropResultsInTable();
            clearInterval(stopwatch);
            clearInterval(timeId);
            clearInterval(timeIdBunus);
            clearInterval(timeControler);
            resultsWindow.classList.add('window-active');
            audioPlay(audioGameOver, audioOn);
        }
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
        let totalDrops;
        displayValue = display.value;
        scorePlus.textContent = '+' + points;

        if (displayValue === '' || arrDrops == '') {
            return;
        } else {
            let dropIndex = -1;
            let dropId = 0;

            for (let i = 0; i < arrDrops.length; i++) {
                if (arrDrops[i].result == displayValue) {
                    correct = true;
                    dropIndex = i;
                    dropId = arrDrops[i].id;
                    totalDrops = arrDrops.length - 1;

                    if (arrDrops[i].bonus === false) {
                        score.textContent = Number(score.textContent) + points;
                        scorePlus.classList.add('score-active')
                        setTimeout(() => {
                            scorePlus.classList.remove('score-active')
                        }, 1000);
                        splashDrop(dropId);
                        audioPlay(audioPop, audioOn);
                        arrDrops.splice(dropIndex, 1);

                    } else {
                        scorePlus.textContent = '+' + (totalDrops * 10 + 50)
                        score.textContent = Number(score.textContent) +
                            Number(scorePlus.textContent);
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
                    }

                    display.value = '';
                    audioPlay(audioSplash, audioOn)
                    points++;
                    dropsCorrect++;
                    break;
                }
            }

            if (correct === false) {
                display.value = '';
                incorrectUnswer();
                audioPlay(audioError, audioOn);
                dropsWrong++;
            }

            //---Reducing the dropout time and 
            //---complicating the equations for increasing the score
            if (Number(score.textContent) >= 500) {
                speedDrop = 3000;
                clearInterval(timeId);
                timeId = setInterval(() => {
                    addDrop(false);
                }, speedDrop);
                if (numberLevel == 10 && numberLevel < 20) {
                    numberLevel2 = 19;
                } else if (numberLevel == 20 && numberLevel < 40) {
                    numberLevel2 = 29;
                } else {
                    numberLevel2 = 60;
                }
                numberLevel1 = 9;

            } else if (Number(score.textContent) >= 200) {
                speedDrop = 5000;
                clearInterval(timeId);
                timeId = setInterval(() => {
                    addDrop(false);
                }, speedDrop);

                if (numberLevel == 10 && numberLevel < 20) {
                    numberLevel2 = 15;
                } else if (numberLevel == 20 && numberLevel < 40) {
                    numberLevel2 = 25;
                } else {
                    numberLevel2 = 50;
                }
                numberLevel1 = 5;

            } else if (Number(score.textContent) >= 100) {
                speedDrop = 8000;
                clearInterval(timeId);
                timeId = setInterval(() => {
                    addDrop(false);
                }, speedDrop);

                if (numberLevel == 10 && numberLevel < 40) {
                    numberLevel2 = 13;
                } else if (numberLevel == 20 && numberLevel < 40) {
                    numberLevel2 = 23;
                } else {
                    numberLevel2 = 45;
                }
                numberLevel1 = 3;

            } else if (Number(score.textContent) < 50) {
                speedDrop = 10000;
                clearInterval(timeId);
                timeId = setInterval(() => {
                    addDrop(false);
                }, speedDrop);
                if (numberLevel == 10 && numberLevel < 20) {
                    numberLevel2 = 10;
                } else if (numberLevel == 20 && numberLevel < 40) {
                    numberLevel2 = 20;
                } else {
                    numberLevel2 = 40;
                }
                numberLevel1 = 1;
            }
        }
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

    //---stopwatch function------------------------
    let tickTikc = function () {
        sec++;
        if (sec >= 60) {
            min++;
            sec = 0;
        }
    }

    //---Function adding results to a table--------
    let dropResultsInTable = function () {
        if (min < 10) {
            doc.querySelector('.stopwatch-min').textContent = '0' + min;
        } else {
            doc.querySelector('.stopwatch-min').textContent = min;
        }

        if (sec < 10) {
            doc.querySelector('.stopwatch-sec').textContent = ':0' + sec;
        } else {
            doc.querySelector('.stopwatch-sec').textContent = ':' + sec;
        }

        doc.querySelector('.result-drops-total').textContent = dropCounter - 1;
        doc.querySelector('.result-drops-correct').textContent = dropsCorrect;
        doc.querySelector('.result-drops-wrong').textContent = dropsWrong;
    }

    getlocalStorageValue();
});
