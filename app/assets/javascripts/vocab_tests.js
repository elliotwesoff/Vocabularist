var answer = {};
var score = 0;
var remainingWords;
var wordCount;
var correct = [];
var incorrect = [];
var wait = false;
var timeoutHandle;


function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function checkAnswer(entry) {
    
    if (verifyAnswer(entry)) {
        correct.push({ article: answer['article'], word: answer['word'] });
        showCorrect();
        score++;
    } else {
        incorrect.push({ userWord: entry, correctArt: answer['article'], correctWord: answer['word'] });
        showIncorrect();
    }

    window.clearTimeout(timeoutHandle);
    timeoutHandle = window.setTimeout(function() { clearAnswer() }, 5000);
}

function verifyAnswer(entry) {

    if (answer['article'] != null) {
        var words = entry.split(' ');
        var art = words.shift();
        var word = words.join(' ');
        
        return (art.toLowerCase() == answer['article'].toLowerCase() && 
                word.toLowerCase() == answer['word'].toLowerCase()) ? true : false;

    } else {
        return entry.toLowerCase() == answer['word'].toLowerCase() ? true : false;
    }
}

function showCorrect() {
    $('.answer').text('Ja!');
    $('.answer').attr('class', 'answer correct');
    $('.answer').show();
}

function showIncorrect() {
    var article = answer['article'] == null ? '' : answer['article'] + ' ';
    $('.answer').attr('class', 'answer incorrect');
    $('.answer').text('sorry, the answer was ' + article + answer['word']);
    $('.answer').show();
}

function clearAnswer() {
    $('.answer').hide();
}

function generateNextWord() {

    // parse and remove the upcoming word from our word list array.
    var nextWord = JSON.parse(remainingWords.shift());
    var english = nextWord['english']['word'];
    var randNum = getRandomArbitrary(0, nextWord['german'].length - 1);
    var germanObj = nextWord['german'][randNum];
    var germanWord = germanObj['word'];
    var germanArt = germanObj['article'];
    var gender = germanObj['gender'];
    var plural = nextWord['plurals'][getRandomArbitrary(0, nextWord['plurals'].length - 1)];
    var wordSelector = 0;

    if (plural != null) {
        var pluralWord = plural['word'];
        var pluralArt = plural['article'];
        wordSelector = getRandomArbitrary(0, 1);
    }

    if (germanArt == null) {
        $('#article_form').hide();
        $('.ghetto-ass').width('50%');
    } else {
        $('#article_form').show();
        $('.ghetto-ass').width();
        $('.ghetto-ass').width('80%');
    }

    if (wordSelector == 0) {
        // give the user a singular word.
        answer['article'] = germanArt;
        answer['word'] = germanWord;
    } else {
        // give the user a plural word.
        answer['article'] = pluralArt;
        answer['word'] = pluralWord;
        gender = plural['gender'];
    }

    // update the fields for the new word.
    // TODO: we need a field to let the quizzee know if the word
    // belongs to a certain case or not. ex: mich, dich, etc.
    $('#english').html(english);
    $('#gender').html(gender);
    $('.question-count').html(remainingWords.length + ' word(s) remain.');
}

function nextQuestion() {
    var entry = $('#german_word').val();

    if (entry.length > 0) {
        // check to see if what the user entered was correct!
        checkAnswer(entry);

        if (remainingWords.length > 0) {
            generateNextWord();
            $('#german_word').val('');
        } else {
            var percentage = Math.round((score / wordCount) * 100) + "%";
            alert("you're done!  you got " + score + " out of " + wordCount + " (" + percentage +"), correct.");

            showResults();
        }

    } else {
        alert("at least try to guess or something...");
    }

}

function showResults() {
    var tbody = '';

    for (var i in incorrect) {
        var article = incorrect[i]['correctArt'] ? incorrect[i]['correctArt'] + ' ' : '';

        tbody += '<tr><td>' + incorrect[i]['userWord'] + '</td>' +
            '<td>' + article + incorrect[i]['correctWord'] + '</td></tr>';
    }

    $('#results tbody').append(tbody);
    $('#results').show();
}

$(document).ready(function() {

    // parse the data out of the div element we're storing our words in.
    remainingWords = $('#quiz_words').data('words');
    wordCount = remainingWords.length;

    generateNextWord();

    // give the word input focus if we enter in der/die/das
    // in the article field.
    $('#german_article').on('input', function() {
        if ($(this).val().length == 3) {
            $('#german_word')[0].focus();
        }
    });

    // if the user needs to enter an umlaut character, append 
    // the clicked character to what's currently in the word field.
    $('.umlaut').click(function() {
        var letter = $(this).text();
        var input = $('#german_word').val();
        $('.umlaut').attr('class', 'umlaut deselected');
        $(this).attr('class', 'umlaut selected');
        $('#german_word').val(input + letter);
        $('#german_word')[0].focus();
    });

});

