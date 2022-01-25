

var buttons = [];

var end= window.location.search

var curWord = document.getElementById("curWord")
var win = new Audio("assets/win.wav");
var correct = new Audio("assets/sound.wav");
var click = new Audio("assets/click.wav");
var level = new Audio("assets/newlevel.wav");


var res = end.split('?')
if(end==""){
    cols = 4
}
else{
    cols = parseInt(res[1])
}

if (res.length > 2){
    score=res[2]
    var totalSeconds = res[3]
}
else{
    score ="0";
    var totalSeconds = 0
}

curWord.innerHTML = "_ ".repeat(cols)

function getAbove(id) {
  d = [];
  for (var l = id - cols; l >= 0; l = l - cols) {
    d.push(l);
  }
  return d;
}

function getBelow(id) {
  d = [];
  for (var l = id + cols; l < cols * 5; l = l + cols) {
    d.push(l);
  }
  return d;
}


var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");

var timer = setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}


function reset() {
  buttons.forEach((button) => {
    button.style.color = "#000000";
    button.enabled = true;
  });
  console.log(word);
  word = "";
  clicker = 0;
}

var clicker = 0;

var word = "";


if(cols != 4){

    level.play();
}


function run(event) {
  var id = parseInt(event.target.id);
  var thisElement = buttons[id];



  if (thisElement.enabled) {

    click.play();

    if (id % cols != clicker) {
      return;
    }

    fin = [];
    console.log(id)
    for (var q = id; q >= 0; q = q - (cols - 1)) {
      getAbove(q).forEach((t) => fin.push(t));
      if(q%cols==cols-1){break}
    }

    for (var q = id; q <= cols * 5; q = q + (cols + 1)) {
      getBelow(q).forEach((t) => fin.push(t));
      if(q%cols==cols-1){break}
    }
    console.log(fin)
    fin.forEach((f) => {
      buttons[f].style.color = "#ffffff";
      buttons[f].enabled = false;
    });

    clicker++;
    word = word + thisElement.innerHTML;

    if (id % cols == cols - 1) {
      if (words.includes(word)) {
        answers = document.getElementById("col1").children;
        console
        for(var i =0;i<answers.length;i++){
          if (answers[i].text.innerHTML == word) {
            console.log("yay");
            answers[i].text.style.visibility = "visible"

            if(!found.includes(word)){
                score = parseInt(score) + 80
                scoreElem.innerHTML = "Score:" + score;
                found.push(word)



                if(words.every((item)=>found.includes(item))){
                    if(cols == 8){
                        win.play();
                        alert("You Won! Congrats!!")
                        clearInterval(timer)
                        return;
                    }


                    window.location.replace("/?"+(cols+1)+"?"+score+"?"+totalSeconds);
                }
                else{
                    
                    correct.play()
                }
            }

            break;
          }
        };
      }
      reset();
    }
  } else {
    reset();
  }
  
  curWord.innerHTML = word.split('').join(' ') + (" _".repeat(cols-word.length))
}

button = document.getElementById("bottom")
button.trig = "end"
button.onclick = e =>{

    if(button.trig=="end"){

        if (confirm("Do you really want to give up?") == true) {
            clearInterval(timer)
            answers = document.getElementById("col1").children;
            for(var i =0;i<answers.length;i++){
                answers[i].text.style.visibility = "visible"
            }
            found = words;
        
            button.innerHTML = "New Game"
            button.trig = "refresh"

        }
    }
    else{
        window.location.replace("/?4");
    }


}

var container = document.getElementById("grid-container");

function makeRandomWord() {
  t = "";
  for (var i = 0; i < 5; i++) {
    t = t + alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return t;
}



scoreElem = document.getElementById("score");
level = document.getElementById("level");
scoreElem.innerHTML = "Score:" + score;
level.innerHTML = "Level:" + (cols-3);

words = [];

found = [];



fetch("assets/final"+cols+".txt")
  .then((response) => response.text())
  .then((text) => {
    boards = text.split("\n");
    res = boards.map((x) => x.split("#"));

    const randomElement = res[Math.floor(Math.random() * res.length)];
    console.log(randomElement);

    words = randomElement[0].split(",");
    letters = randomElement[1].split("");


    words = words.sort();

    words.forEach((word) => {
      var answer = document.createElement("div");
      var text = document.createElement("div");
      answer.classList.add("answers")
      answer.text = text;
      text.style.visibility = "hidden";
      text.innerHTML = word;

      answer.appendChild(text);
      answer.word = word;
      answer.style.backgroundColor = "grey";

      document.getElementById("col1").appendChild(answer);
    });

    for (var x = 0; x <= cols * 5 - 1; x++) {
      var child = document.createElement("div");
      child.id = x;
      child.onclick = run;
      child.enabled = true;
      child.classList.add("grid-item");
      child.innerHTML = letters[x];
      container.appendChild(child);
      console.log("hi");
      buttons.push(child);
    }

    container.style.gridTemplateColumns = "auto ".repeat(cols);
  });


