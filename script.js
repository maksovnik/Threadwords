var buttons = [];

var end = window.location.search;

var curWord = document.getElementById("curWord");
var win = new Audio("assets/win.wav");
var correct = new Audio("assets/sound.wav");
var click = new Audio("assets/click.wav");
var level = new Audio("assets/newlevel.wav");
var hint = new Audio("assets/hint.wav");

var res = end.split("?");
if (end == "") {
  cols = 4;
} else {
  cols = parseInt(res[1]);
}

if (res.length > 2) {
  score = res[2];
  var totalSeconds = res[3];
  var hints = res[4]
} else {
  var score = "0";
  var totalSeconds = 0;
  var hints = 3
}

var hintButton = document.getElementById("hint")
hintButton.innerHTML = "Hint:"+hints



curWord.innerHTML = "_ ".repeat(cols);

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
    console.log(buttons)
  buttons.forEach(button => {
    button.style.color = "#000000";
    button.enabled = true;
    button.style.backgroundColor = "#d6d7d7"
  });
  console.log(word);
  word = "";
  clicker = 0;
}

var clicker = 0;

var word = "";

if (cols != 4) {
  level.play();
}


function foundWord(word){
    score = parseInt(score) + 80;
    scoreElem.innerHTML = "Score:" + score;
    found.push(word);

    if (words.every((item) => found.includes(item))) {
      if (cols == 8) {
        win.play();
        alert("You Won! Congrats!!");
        clearInterval(timer);
        return;
      }

      window.location.replace(
        "/?" + (cols + 1) + "?" + score + "?" + totalSeconds + "?" + hints
      );
    } else {
      correct.play();
    }
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
    console.log(id);
    for (var q = id; q >= 0; q = q - (cols - 1)) {
      getAbove(q).forEach((t) => fin.push(t));
      if (q % cols == cols - 1) {
        break;
      }
    }

    for (var q = id; q <= cols * 5; q = q + (cols + 1)) {
      getBelow(q).forEach((t) => fin.push(t));
      if (q % cols == cols - 1) {
        break;
      }
    }
    console.log(fin);
    fin.forEach((f) => {
      buttons[f].style.color = "#ffffff";
      buttons[f].enabled = false;
    });

    clicker++;
    word = word + thisElement.innerHTML;

    thisElement.style.color = "#4db5ff";

    if (id % cols == cols - 1) {
      if (words.includes(word)) {
        answers = document.getElementById("col1").children;
        for (var i = 0; i < answers.length; i++) {
          if (answers[i].word == word) {
            console.log("yay");
            answers[i].text.innerHTML = answers[i].word
            answers[i].text.style.visibility = "visible";

            if (!found.includes(word)) {
                foundWord(word)
            }

            break;
          }
        }
      }
      curWord.innerHTML = word.split("").join(" ") + " _".repeat(cols - word.length);
      reset();
    } else {
      curWord.innerHTML =  word.split("").join(" ") + " _".repeat(cols - word.length);
    }
  } else {
    reset();
    curWord.innerHTML =  word.split("").join(" ") + " _".repeat(cols - word.length);
  }
}

button = document.getElementById("gu");
button.trig = "end";
button.onclick = (e) => {
  if (button.trig == "end") {
    if (confirm("Do you really want to give up?") == true) {
      clearInterval(timer);
      answers = document.getElementById("col1").children;
      for (var i = 0; i < answers.length; i++) {
        answers[i].text.style.visibility = "visible";
        answers[i].text.innerHTML = answers[i].word
      }
      found = words;

      button.innerHTML = "New Game";
      button.trig = "refresh";
    }
  } else {
    window.location.replace("/?4");
  }
};


function repLetter(word,letters){
    str = ""
    for(let l of word){
        if(!letters.includes(l)){
            str = str + "_"
        }
        else{
            str = str + l
        }
    }
    return str
}

hintButton.onclick = e =>{
    if(hints<=0){
        return;
    }

    if (confirm("Do you really want to use a hint?") == true) {
        hint.play()
        var difference = words.filter(x => !found.includes(x));

        var rword = difference[Math.floor(Math.random() * difference.length)];
        
        answers = document.getElementById("col1").children;
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].word == rword) {

                hintArray = answers[i].hints
                console.log(hintArray)
                wordArray = rword.split('')
                remainingHints = wordArray.filter(x => !hintArray.includes(x));
            
                var rLetter = remainingHints[Math.floor(Math.random() * remainingHints.length)];

                answers[i].hints.push(rLetter)
                answers[i].text.innerHTML = repLetter(rword,answers[i].hints)
                answers[i].text.style.visibility = "visible"

                if(answers[i].text.innerHTML== answers[i].word){
                    foundWord(answers[i].word)
                }

            }
        }
        hints = hints-1
        hintButton.innerHTML = "Hint:"+hints
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
level.innerHTML = "Level:" + (cols - 3);

words = [];

found = [];

fetch("assets/final" + cols + ".txt")
  .then((response) => response.text())
  .then((text) => {
    boards = text.split("\n");
    res = boards.map((x) => x.split("#"));

    const randomElement = res[Math.floor(Math.random() * res.length)];


    words = randomElement[0].split(",");
    letters = randomElement[1].split("");

    words = words.sort();
    console.log(words);
    words.forEach((word) => {
      var answer = document.createElement("div");
      var text = document.createElement("div");
      answer.classList.add("answers");
      answer.text = text;
      text.style.visibility = "hidden";
      text.innerHTML = word;

      answer.appendChild(text);
      answer.word = word;
      answer.style.backgroundColor = "grey";
      answer.hints = []
      document.getElementById("col1").appendChild(answer);
    });

    for (var x = 0; x <= cols * 5 - 1; x++) {
      var child = document.createElement("div");
      child.id = x;
      child.onclick = run;
      child.enabled = true;
      child.classList.add("grid-item");
      child.innerHTML = letters[x];
      child.word = letters[x]
      container.appendChild(child);
      console.log("hi");
      buttons.push(child);
    }

    container.style.gridTemplateColumns = "auto ".repeat(cols);
  });
