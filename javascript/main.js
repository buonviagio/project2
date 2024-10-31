// let arrayOfQuestions = [];

/** Method retrieves data from API
 * based on parameters that user selected
*/
const getDataFromApi = (category, difficulty, type, questionsAmount) => {

    const url = `https://opentdb.com/api.php?amount=${questionsAmount}&category=${(category === "none") ? "" : category}&difficulty=${(difficulty === "none") ? "" : difficulty}&type=${(type === "none") ? "" : type}`;
    fetch(url).then((response) => { return response.json() })
        .then((response) => { chooseQuestionsNew(response.results); })
        .catch(error => console.log('Error :>> ', error));

}

/** Function that take from Promise an array and store it in global array*/
const chooseQuestionsNew = (array) => {
    /** we have to empty the array  in order to 
     * if the user press the button start, programm doesn't show previous questions
    */
    const arrayOfQuestions = [];

    array.forEach(element => {
        arrayOfQuestions.push(element);
    });

    showFunction(arrayOfQuestions);
}


/** The programm start with this function   */
const startQuiz = (e) => {
    //Prevent updating on the page, because the button inside the form
    e.preventDefault();

    //take from the selector the category that has been choosen by user 
    const category = document.querySelector("#category").value;

    //take from the selector the level og difficulty that has been choosen by user 
    const difficulty = document.querySelector("#difficulty").value;

    //take from the selector the level og difficulty that has been choosen by user 
    const type = document.querySelector("#type-of-questions").value;


    //by the name of radio buttons is getting array of radiobuttons values
    const answers = document.getElementsByName("answers");
    // const CheckedRadioQuestionsNumber = document.querySelector("input[type='radio']:checked").value;
    // console.log('CheckedRadioQuestionsNumberValue :>> ', CheckedRadioQuestionsNumber);


    let amountOfQuestions = 0;
    // to find in array of radio buttons the value which was selected by users by submitting radiobuttons
    // and assign it to the amountOfAnswers variable
    for (let index = 0; index < answers.length; index++) {
        if (answers[index].checked) {
            amountOfQuestions = answers[index].value;
        }
    }

    /** to check checkbox in order to set timer or not */
    const setTimer = document.getElementById("btncheck1");
    if (setTimer.checked) {
        createTimer(amountOfQuestions);
    } else {
        //clear timer if user doesn't choose timer
        const body = document.getElementById("timer-are");
        body.innerHTML = "";
    }
    /** calling the function that retrieves data from API */
    getDataFromApi(category, difficulty, type, amountOfQuestions);
}

/** Clear the table */
const clearTable = () => {
    const table = document.querySelector(".table");

    for (let index = 1; index < 5; index++) {
        table.rows[index].cells[1].innerText = 0;
        table.rows[index].cells[3].innerText = 0;
        table.rows[index].cells[4].innerText = 0;
    }

}

const addInitialEvent = () => {
    const valueOfButton = document.getElementById("start-quiz");
    // check if the value is not qual null, then call function
    if (valueOfButton !== null) {
        valueOfButton.addEventListener("click", startQuiz);
        //cleat Table 
        console.log('START QUIZ :>> ');
        clearTable();
    }
}
/** Entry point of the programm */
addInitialEvent()


/** This function shows the received questions from API
 * on the form form-of-questions
 * it creates dynamically labels for radio buttons and radio buttons
 */
const showFunction = (arrayOfQuestions) => {
    const answersContainer = document.getElementById("radioButtonsWrapElem");
    answersContainer.innerHTML = "";
    //delete duplicate button send-answers
    let buttonToRemove = document.getElementById("send-answers");
    if (buttonToRemove !== null) {
        buttonToRemove.remove();
    }

    //clear the table 
    clearTable();

    //this loop retrieves each questions, in our case it is represented by an object
    for (let index = 0; index < arrayOfQuestions.length; index++) {
        //we take one questions from choosen questions, in our case it is an object
        const element = arrayOfQuestions[index];

        /** this function return us four answer options 
         * which were retrieved from question obeject
         * places the answers in random order, and returns us as an array
        */
        const answerOption = toGetArrayOfAnswers(element);


        const radioButtonsWrapElemNew = document.getElementById("radioButtonsWrapElem");
        // CREATING CARDS each question is one card
        const card = document.createElement("div");
        card.classList.add("card", "border-secondary", "col-md-3");
        card.setAttribute("style", "max-width: 18rem;");
        card.setAttribute("id", ("card" + index));
        radioButtonsWrapElemNew.appendChild(card);

        //Create Header of the cards, here is placed the category of question
        const cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.setAttribute("id", ("header" + index));
        cardHeader.innerText = "Difficulty : ".concat(element.difficulty); element.category;
        card.appendChild(cardHeader);

        //Create Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "text-secondary");
        card.appendChild(cardBody);

        //Create H5 
        const cardTitle = document.createElement("h5");
        cardTitle.setAttribute("class", "card-title");
        //cardTitle.innerText = "Question " + (index + 1);
        cardTitle.innerText = element.category;
        cardBody.appendChild(cardTitle);

        //Create question
        const cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.innerText = arrayOfQuestions[index].question;
        cardBody.appendChild(cardText);

        /** this loop creates answer options for each question
        and places them in radio buttons */
        for (let z = 0; z < answerOption.length; z++) {

            //create div container for every radio button
            const radioContainer = document.createElement("div");
            radioContainer.setAttribute("class", "form-check");
            cardBody.appendChild(radioContainer)
            let input = document.createElement("input");
            input.setAttribute("name", ("option" + index));
            input.setAttribute("class", "form-check-input");
            input.setAttribute("id", ("option" + index + z));
            input.type = "radio";
            input.value = answerOption[z];
            radioContainer.appendChild(input);
            /** create a label for radio button
             * here are placed answer options for each question
             */
            let label = document.createElement("label");
            label.setAttribute("class", "form-check-label");
            label.setAttribute("for", ("option" + index + z));
            label.setAttribute("id", ("option" + index + z));
            label.innerText = answerOption[z];
            radioContainer.appendChild(label);
        }
    }

    //Creating button to submit questions
    const formForTheButton = document.getElementById("place-for-send-answers");
    const answerButton = document.createElement("button");
    answerButton.setAttribute("id", "send-answers");
    answerButton.classList.add("btn", "btn-primary");
    answerButton.innerText = "Send your answers";
    formForTheButton.appendChild(answerButton);
    //formForTheButton.after(answerButton);
    submitAnswers(arrayOfQuestions);
}

const submitAnswers = (arrayOfQuestions) => {
    document.getElementById("send-answers").addEventListener("click", () => {
        checkAnswers(arrayOfQuestions)
        //clear timer if user press the button before time up
        const body = document.getElementById("timer-are");
        body.innerHTML = "";
    });
}

/** This function checks the answers and shows the results */
function checkAnswers(arrayOfQuestions) {
    //array of the right question
    let arrayOftheRightAnswers = [];

    for (let index = 0; index < arrayOfQuestions.length; index++) {
        //take every card by ID
        const card = document.getElementById("card" + index);
        // we take only text of the question
        const cardText = card.getElementsByTagName("div")[1].getElementsByTagName("p")[0];
        // we take the choosen answer by user
        const answers = document.getElementsByName("option" + index);

        /** this variable show us when in the card there are not any choosen variants */
        let notChoosenAnswer = 0;
        /** in this loop are checked the selected option of the answer */
        for (let z = 0; z < answers.length; z++) {
            /** we disabled all radio buttons after that, when user pressed the submit button */
            const rightAnswerRadioButton = document.getElementById("option" + index + z);
            rightAnswerRadioButton.disabled = true;

            //If we active this if block we will, check only cards which have submited answers by user
            if (answers[z].checked) {
                if (answers[z].value === arrayOfQuestions[index].correct_answer) {
                    //??
                    arrayOftheRightAnswers.push(arrayOfQuestions[index]);

                    console.log('Correct Answer :>> ', arrayOfQuestions[index].correct_answer);
                    //Setting green border for right answered card
                    card.classList.remove("border-secondary");
                    card.classList.add("border-success");
                    //Setting green color of the right answered question
                    cardText.classList.remove("text-secondary");
                    cardText.classList.add("text-success");
                    //Setting header of the card
                    const rightAnswer = document.getElementById("header" + index);
                    //rightAnswer.innerText = "Your answer was correct";
                    rightAnswer.style.background = "#198754";

                } else {
                    //Setting red border for wrong answered card
                    card.classList.remove("border-secondary");
                    card.classList.add("border-danger");
                    //Setting red color of the wrong answered question
                    cardText.classList.remove("text-secondary");
                    cardText.classList.add("text-danger");
                    //Setting header of the card
                    const wrongAnswer = document.getElementById("header" + index);
                    //wrongAnswer.innerText = "I'm sorry, but you're wrong";
                    wrongAnswer.style.background = "#E6707C";
                }
            } else {
                notChoosenAnswer++;
            }

            /** here we retrieve each label for radio button  */
            const ricghtAnswerLabel = document.querySelector("label[for=option" + index + z + "]");
            /** In this section we set up the color of the text, which is variants of the answers  */
            if (ricghtAnswerLabel.innerText === arrayOfQuestions[index].correct_answer) {
                ricghtAnswerLabel.classList.remove("text-secondary");
                ricghtAnswerLabel.classList.add("text-success");
            } else {
                ricghtAnswerLabel.classList.remove("text-secondary");
                ricghtAnswerLabel.classList.add("text-danger");
            }
        }

        //if (notChoosenAnswer == 4) {
        if (notChoosenAnswer !== 0 && (notChoosenAnswer % 2 == 0)) {
            const rightAnswer = document.getElementById("header" + index);
            rightAnswer.innerText = "You didn't pick the answer";
        }

    }
    /** we send the array with right questions */
    const resultObject = countTheFinalResults(arrayOftheRightAnswers);
    showTheFinalResults(resultObject);

    const blablaBLA = countTheFinalResults(arrayOfQuestions)
    countAllThePossibleScores(blablaBLA);


    /** we have to remove button after the user submit the question */
    const buttonToRemove = document.getElementById("send-answers");
    buttonToRemove.remove();
}

const countTheFinalResults = arrayOftheRightAnswers => {
    let resultObject = {
        difficultyBoolean: {
            easy: 0,
            medium: 0,
            hard: 0
        },
        difficultyMultiple: {
            easy: 0,
            medium: 0,
            hard: 0
        }
    }
    for (let index = 0; index < arrayOftheRightAnswers.length; index++) {
        let answerObject = arrayOftheRightAnswers[index];
        console.log('type :>> ', answerObject.type);

        if (answerObject.type === "multiple") {
            for (key in resultObject.difficultyMultiple) {
                if (key === answerObject.difficulty) {
                    resultObject.difficultyMultiple[key] += 1;
                }

            }
        } else {
            for (key in resultObject.difficultyBoolean) {
                if (key === answerObject.difficulty) {
                    resultObject.difficultyBoolean[key] += 1;
                }

            }
        }

    }
    console.log('resultObject :>> ', resultObject);
    return resultObject;
    //showTheFinalResults(resultObject);
}

const showTheFinalResults = resultObject => {
    const table = document.querySelector(".table");

    let row = 1;
    let multiplicatorForDifficulty = 2;
    let totalScore = 0;


    for (let [key, value] of Object.entries(resultObject.difficultyMultiple)) {
        table.rows[row].cells[1].innerText = value;
        let valueTmp = parseInt(table.rows[row].cells[4].innerText);
        table.rows[row++].cells[4].innerText = valueTmp + (value * multiplicatorForDifficulty);

        totalScore += (value * multiplicatorForDifficulty);
        multiplicatorForDifficulty += 2;
    }
    row = 1;
    multiplicatorForDifficulty = 1;
    for (let [key, value] of Object.entries(resultObject.difficultyBoolean)) {
        table.rows[row].cells[3].innerText = value;
        let valueTmp = parseInt(table.rows[row].cells[4].innerText);
        table.rows[row++].cells[4].innerText = valueTmp + (value * multiplicatorForDifficulty);

        totalScore += (value * multiplicatorForDifficulty);
        multiplicatorForDifficulty++;
    }

    table.rows[4].cells[1].innerText = (totalScore);
}

const countAllThePossibleScores = (resultObject) => {
    const table = document.querySelector(".table");

    let row = 1;
    let multiplicatorForDifficulty = 2;
    let totalScore = 0;

    for (let [key, value] of Object.entries(resultObject.difficultyMultiple)) {
        //table.rows[row].cells[1].innerText = value;
        /* let valueTmp = parseInt(table.rows[row].cells[4].innerText);
        table.rows[row++].cells[4].innerText = valueTmp + (value * multiplicatorForDifficulty); */

        totalScore += (value * multiplicatorForDifficulty);
        multiplicatorForDifficulty += 2;
    }
    row = 1;
    multiplicatorForDifficulty = 1;
    for (let [key, value] of Object.entries(resultObject.difficultyBoolean)) {
        //table.rows[row].cells[3].innerText = value;
        /* let valueTmp = parseInt(table.rows[row].cells[4].innerText);
        table.rows[row++].cells[4].innerText = valueTmp + (value * multiplicatorForDifficulty); */

        totalScore += (value * multiplicatorForDifficulty);
        multiplicatorForDifficulty++;
    }

    table.rows[4].cells[3].innerText = (totalScore);

    const persentOfTheQuiz = Math.round((parseInt(table.rows[4].cells[1].innerText) / totalScore) * 100);
    table.rows[4].cells[4].innerText = "You scored: " + persentOfTheQuiz + "%";
}

/** Funktion takes incorrect_answers and correct_answer, shufle them and return as array  */
function toGetArrayOfAnswers(questionObject) {
    /** we create an aaray, first element is correct answer the last three elements are
        the elements from an array with incorrect answers */
    const answersArray = [questionObject.correct_answer, ...questionObject.incorrect_answers]
    //before return the array we sort it in random order
    const sortedAnswersArray = answersArray.sort(() => Math.random() - 0.5);
    return sortedAnswersArray;
}

/** End of the quiz section */

/** Timer functions */

const createTimer = (amountOfQuestions) => {

    const body = document.getElementById("timer-are");
    body.style.background = "#F8F9FA";
    body.style.borderRadius = "10px";

    // to clear timer
    if (body.hasChildNodes("h2")) {
        body.innerHTML = "";
    }

    const timer = document.createElement("h2");
    const timeLimit = document.createElement("h3");
    //Description how many time user have to answer the question
    timeLimit.innerText = "For " + amountOfQuestions + " questions you have " + ((amountOfQuestions * 10 >= 60) ? (Math.floor((amountOfQuestions * 10) / 60) + " min : " + (amountOfQuestions * 10 == 120 ? 0 : amountOfQuestions * 10 - 60)) : amountOfQuestions * 10) + " sec";
    const timeValue = 0;
    timer.innerText = timeValue;
    body.appendChild(timeLimit);
    body.appendChild(timer);
    runTimer(timeValue, amountOfQuestions);
}


const runTimer = (timeValue, amountOfQuestions) => {
    const timer = document.querySelector("h2")
    const timerLogic = () => {
        const seconds = timeValue++
        //timer.innerText = seconds

        if (seconds < 60) {
            timer.innerText = seconds
        } else {
            timer.innerText = Math.floor(seconds / 60) + " : " + (seconds == 120 ? 0 : seconds - 60)
        }

        if (seconds === (amountOfQuestions * 10)) {
            clearInterval(myInterval)
            const valueOfButton = document.getElementById("send-answers");
            valueOfButton.click();
        }
    }
    const myInterval = setInterval(timerLogic, 1000)

}

/** Results function */
