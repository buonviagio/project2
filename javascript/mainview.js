/** Method retrieves data from API
 * based on parameters that user selected
*/
const getDataFromApi = () => {

    const url = 'https://opentdb.com/api.php?amount=48';
    fetch(url).then((response) => { return response.json() })
        //.then((response) => { chooseQuestionsNew(response.results); })
        .then((data) => {
            controller(data.results);
            //console.log('data.result :>> ', data);
        })
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
    //console.log('arrayOfQuestions :>> ', arrayOfQuestions);
    showFunction(arrayOfQuestions);
}


const addInitialEvent = () => {
    window.addEventListener("load", getDataFromApi)
}
/** Entry point of the programm */
addInitialEvent();

const showCardsFunction = (arrayOfQuestions) => {
    /*     //clear table
        const answersContainer = document.getElementById("radioButtonsWrapElem");
        answersContainer.innerHTML = "";
        //delete duplicate button send-answers
        let buttonToRemove = document.getElementById("send-answers");
        if (buttonToRemove !== null) {
            buttonToRemove.remove();
        } */
    clearFunction();

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
    submitAnswers(arrayOfQuestions);
}

const submitAnswers = (arrayOfQuestions) => {
    document.getElementById("send-answers").addEventListener("click", () => {
        checkAnswers(arrayOfQuestions)
    });
}

function checkAnswers(arrayOfQuestions) {
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
                    //Setting green border for right answered card
                    card.classList.remove("border-secondary");
                    card.classList.add("border-success");
                    //Setting green color of the right answered question
                    cardText.classList.remove("text-secondary");
                    cardText.classList.add("text-success");
                    //Setting header of the card
                    const rightAnswer = document.getElementById("header" + index);
                    rightAnswer.innerText = "Your answer was correct";
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
                    wrongAnswer.innerText = "I'm sorry, but you're wrong";
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
    /** we have to remove button after the user submit the question */
    const buttonToRemove = document.getElementById("send-answers");
    buttonToRemove.remove();
}


const filterQuestionDependOnUserChoose = (arrayOfQuestions) => {
    let inputValue = document.getElementById("category-input").value
    let radioButtonValue = document.querySelector("input[type='radio']:checked").value
    let checkboxValues = document.querySelectorAll("input[type='checkbox']:checked");
    const checkedValuesOfCheckedBoxes = Array.from(checkboxValues).map(item => item.value);

    const result = arrayOfQuestions.filter((item) => {
        //console.log("inputValue =>", inputValue, " radioButtonValue =>", radioButtonValue);
        const result = (item.category.toLowerCase().includes(inputValue.toLowerCase()) && (item.type.includes(radioButtonValue))
            //in this case array of difficulty transfotms in string with RegExp we're looking for matching 
            && (checkedValuesOfCheckedBoxes.toString().match(item.difficulty) || checkedValuesOfCheckedBoxes.toString().length == 0));
        return result;
    });
    //if there aren't any matches we alert, or call the showCardsFunction function
    if (result.length === 0) {
        console.log('NO MATCHES');
        clearFunction()
        const radioButtonsWrapElemNew = document.getElementById("radioButtonsWrapElem");
        const allertMessage = document.createElement("h3");
        allertMessage.style.background = "#F8F9FA";
        allertMessage.style.borderRadius = "10px";
        allertMessage.innerText = "Sorry, but there aren't any matches, try to change the parameters";
        radioButtonsWrapElemNew.appendChild(allertMessage);

    } else {
        showCardsFunction(result);
    }
}

const setEventListeners = (arrayOfQuestions) => {
    const input = document.getElementById("category-input");
    input.addEventListener("input", () => {
        filterQuestionDependOnUserChoose(arrayOfQuestions)
    });

    const radioButton = document.querySelector(".btn-group");
    radioButton.addEventListener("change", () => {
        filterQuestionDependOnUserChoose(arrayOfQuestions)
    });

    const checkBoxes = document.getElementById("checkbox-for-difficulty");
    checkBoxes.addEventListener("change", () => {
        filterQuestionDependOnUserChoose(arrayOfQuestions)
    });
}


function controller(arrayOfQuestions) {
    console.log('Method controller :>> ');
    // build cards with all questions recieved from api
    showCardsFunction(arrayOfQuestions);
    //create filter functions
    setEventListeners(arrayOfQuestions);
    // set event listeners
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

/** Clear Function */
const clearFunction = () => {
    //clear table
    const answersContainer = document.getElementById("radioButtonsWrapElem");
    answersContainer.innerHTML = "";
    //delete duplicate button send-answers
    let buttonToRemove = document.getElementById("send-answers");
    if (buttonToRemove !== null) {
        buttonToRemove.remove();
    }
}


/** Animating link function */
let quizImage = document.querySelector("img");
let angle = Math.PI / 2;
const animateImage = (time, lastTime) => {
    if (lastTime != null) {

        angle += (time - lastTime) * 0.001;

    }
    quizImage.style.top = (Math.sin(angle) * 20) + "px";
    quizImage.style.left = (Math.cos(angle) * 200) + "px";
    requestAnimationFrame(newTime => animateImage(newTime, time));
}
requestAnimationFrame(animateImage);
