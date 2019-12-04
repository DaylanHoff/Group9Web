let answer = document.getElementById('answerBox');
let score = document.getElementById('score');
let onQuestion = 1;
let scoreNumber = 0;

answer.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      checkAnswer()
    }
});
function timer(){
    var sec = 300;
    var timer = setInterval(function(){
        document.getElementById('safeTimerDisplay').innerHTML= Math.floor(sec/60)+':'+(sec%60);
        sec--;
        if (sec < 0) {
            end();
        }
    }, 1000);
}

document.getElementById('character1').style.display = 'block';

timer();

function checkAnswer() {
    if(document.getElementById('answer' + onQuestion).innerHTML === answer.value){
        scoreNumber = scoreNumber + 100
        score.innerHTML = scoreNumber
    }
    document.getElementById('character' + onQuestion).style.display = 'none';
    onQuestion++;
    if(document.getElementById('character' + onQuestion) === null){
        end()
    } else {
        document.getElementById('character' + onQuestion).style.display = 'block';
    }
    answer.value = '';
}

function end() {
    window.location.replace("http://localhost:3000/games");
}