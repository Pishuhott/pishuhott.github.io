let doc = document,
    numbersBtn = doc.querySelectorAll('.btn-number'),
    clearBtns = doc.querySelectorAll('.btn-clear'),
    enterBtn = doc.querySelector('.btn-enter'),
    display = doc.querySelector('.input'),
    MemoryCurrentNumber = '';
    


//Calc
let numberPress = (number) => {
    
    if (display.value == '') {
        display.value = number;
    } else {
        display.value += number;
    }
};

let clear = (id) => {
    if (id === 'clear') {
        display.value = '';
    } else if (id ==='delete') {
        display.value = display.value.slice(0, -1);
    }
}


for (let number of numbersBtn) {
    number.addEventListener('click', 
        (e) => numberPress(e.target.textContent));
}

for (let clearBtn of clearBtns) {
    clearBtn.addEventListener('click', 
        (e) => clear(e.srcElement.id));
}

enterBtn.addEventListener('click', 
    (e) => operationEnter((e.target.textContent)));



