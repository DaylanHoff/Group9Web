let answer = document.getElementById('answerBox');
let score = document.getElementById('score');
let onQuestion = 1;
let scoreNumber = 0;
let checkDone = false;

answer.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      checkAnswer()
    }
});
function timer(){
    var sec = 60;
    var timer = setInterval(function(){
        document.getElementById('safeTimerDisplay').innerHTML= Math.floor(sec/60)+':'+((sec%60) < 10 ? "0" + (sec%60): (sec%60));
        sec--;
        if (sec < 0) {
            checkDone = true;
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
    onQuestion++;
    if(document.getElementById('character' + onQuestion) === null){
        checkDone = true;
    } else {
        document.getElementById('character' + (onQuestion - 1)).style.display = 'none';
        document.getElementById('character' + onQuestion).style.display = 'block';
    }
    answer.value = '';
}

function end() {
    if(checkDone){
        return true;
    }
    return false;
}