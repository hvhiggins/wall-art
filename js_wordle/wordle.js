outputElem = document.getElementById("output")
guesses = document.getElementById("guesses")
var fiveLetterWords;
var hiddenWord;

output = (out) => outputElem.innerText = out
print = (out) => console.log(out)
choseRandom = (arr) => {return arr[Math.floor(Math.random() * arr.length)]}

// word list from https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
fetch('./five_letter_words.json')
    .then((response) => response.json())
    .then((json) => fiveLetterWords=json)
    .then(() => hiddenWord = choseRandom(fiveLetterWords));


appendMark = (elem, cls, letter) => {
    m = document.createElement("mark")
    m.setAttribute("class", cls)
    m.appendChild(document.createTextNode(letter))
    elem.appendChild(m)
}

function checkWord(guess, word){
    if (fiveLetterWords.indexOf(guess) == -1) {
        output("Not a valid word.")
        return
    }
    for (i of Array(5).keys()){
        letter = guess[i]
        if (word.indexOf(letter) == -1 ) appendMark(guesses, "gray", letter)
        else if (letter == word[i]) appendMark(guesses, "green", letter)
        // Does not check for number of times the 
        else appendMark(guesses, "yellow", letter)
    }
    guesses.appendChild(document.createElement("br"))

    if (guess === word) {
        output("You win, congratulations!")
        guessBox = document.getElementById("guessBox")
        guessBox.parentNode.removeChild(guessBox)
        refresh = document.getElementById("refresh")
        refreshButton = document.createElement("button")
        refreshButton.setAttribute("onClick", "window.location.reload()")
        refreshButton.innerText = "Play again"
        refresh.appendChild(refreshButton)
    }

}

function guessWord(e) {
    if(e.key == 'Enter') {
        guessBox = document.getElementById("guessBox")
        word = guessBox.value
        guessBox.value = ""
        print(word)
        checkWord(word, hiddenWord);        
    }
}