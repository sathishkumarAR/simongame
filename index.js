
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var randomNumber, score = 0, highScore = 0, started = false, resizeCheck = false;

// when any key is pressed for starting the game
$(document).keypress(function () {
    if (!started) {
        nextSequence();
        started = true;
        $(".high-score").removeClass("non-visible");
    }
});

// when empty space is tapped twice for starting the game
$(document).on("dblclick", function (event) {
    if ((!started) && (!$(event.target).closest(".green").length) && (!$(event.target).closest(".red").length) && (!$(event.target).closest(".yellow").length) && (!$(event.target).closest(".blue").length)) {
        nextSequence();
        started = true;
        $(".high-score").removeClass("non-visible");
    }
});

// Detecting the screen size and displaying relevant message in h1 element
$(document).ready(function () {

    $(window).resize(function () {
        if (!resizeCheck) {
            if (Modernizr.mq('(max-width: 767px)')) {
                $("#score-title").text("Double tap on empty space to start");
            } else {
                $("#score-title").text("Press any Key to Start");
            }
        }
    }).resize();
});

// random colour added to the game sequence
function nextSequence() {
    userClickedPattern = [];
    randomNumber = Math.round(Math.random() * 3);

    var randomChoosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChoosenColour);

    $("." + randomChoosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChoosenColour);

    $(".restart-msg").addClass("hide");
    $(".restart-msg-mobile").addClass("hide");
    $("#score-title").text("Score: " + score);

    if (highScore < score) {
        highScore = score;
        $(".high-score-value").text(highScore);
    }
    if (score % 5 === 0 && score != 0) {
        confetti.start();
        setTimeout(function () {
            confetti.stop();
        }, 1200);
    }

}


// Detecting user clicks and adding it to the userClickedPattern list
$(".btn").click(function () {
    var userChosenColour = this.id; // or we can use 'this.attr("id")'
    // var userChosenColour = event.target.id; ---> we can also use this to access the button which was clicked.
    //for the above method (previous comment), event should be passed into the above anonymous function 
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1, userChosenColour);
});

//Detecting when a key is pressed and adding it to the userClickedPattern list
$("body").keydown(function (event) {
    if (started) {
        var userTypedColour = event.key;
        switch (userTypedColour) {
            case "ArrowUp":
                userTypedColour="green";
                userClickedPattern.push(userTypedColour);
                break;
            case "ArrowDown":
                userTypedColour="blue";
                userClickedPattern.push(userTypedColour);
                break;
            case "ArrowLeft":
                userTypedColour= "red";
                userClickedPattern.push(userTypedColour);
                break;
            case "ArrowRight":
                userTypedColour= "yellow";
                userClickedPattern.push(userTypedColour);
                break;
        }
        playSound(userTypedColour);
        animatePress(userTypedColour);

        checkAnswer(userClickedPattern.length - 1);
    }
});


//checking the user clicks with game pattern
function checkAnswer(currentIndex) {
    if (userClickedPattern[currentIndex] === gamePattern[currentIndex]) {
        if ((gamePattern.length - 1) === currentIndex) {
            score++;
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }

    } else {
        resizeCheck = true;
        $("#score-title").text("Game Over");
        console.log(userClickedPattern);
        console.log(gamePattern);
        $("body").addClass("game-over");

        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);

        if (Modernizr.mq('(max-width: 767px)')) {
            $(".restart-msg-mobile").removeClass("hide");
        } else {
            $(".restart-msg").removeClass("hide");
        }

        playSound("wrong");
        startAgain();
    }


}

// starting the game again after game over
function startAgain() {
    started = false;
    gamePattern = [];
    score = 0;
}

//playing sound when a button is pressed and for wrong answer
function playSound(soundName) {
    var audio = new Audio("sounds/" + soundName + ".mp3");
    audio.play();
}

//animating buttons when clicked
function animatePress(userChosenColour) {
    $("." + userChosenColour).addClass("pressed");

    setTimeout(function () {
        $("." + userChosenColour).removeClass("pressed");
    }, 100);
}