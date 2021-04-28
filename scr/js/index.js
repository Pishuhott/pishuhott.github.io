let btnStatr = document.querySelector('.start');
let btnHowToPlay = document.querySelector('.howToPlay')

btnStatr.addEventListener('click', () => {
    document.location.href = './scr/play.html';
});

btnHowToPlay.addEventListener('click', () => {
    document.location.href = './scr/tutorial.html';
})