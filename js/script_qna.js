// API URLs
const getQuestionAPI = "https://llm-evaluators-qa-9c4bf9b44d84.herokuapp.com/question";
const submitAnswerAPI = "https://llm-evaluators-qa-9c4bf9b44d84.herokuapp.com/answer";
const datasetEntryAPI = "https://llm-evaluators-qa-9c4bf9b44d84.herokuapp.com/database_event";

// get data from the URL
// URL parameters
const urlParams = new URLSearchParams(window.location.search);

const encrypt_name = urlParams.get('name');
const encrypt_id = urlParams.get('reg');
const encrypt_email = urlParams.get('email');
const encrypt_phone = urlParams.get('phone');

// Decrypt the data
const u_name = encrypt_name.split('').reverse().join('');
const u_reg = encrypt_id.split('').reverse().join('');
const u_email = encrypt_email.split('').reverse().join('');
const u_phone = encrypt_phone.split('').reverse().join('');

// DOM elements
const imageContainer = document.getElementById("image-Container");
const questionDetailContainer = document.getElementById("question-detail-Container");
const questionContainer = document.getElementById("question-Container");
const answerInput = document.getElementById("answerInput");
const submitButton = document.getElementById("submitButton");

// Prevent pasting in the answer input field
document.getElementById('answerInput').addEventListener('paste', function(e) {
    e.preventDefault();
});

// Global variables
var global_unique_id;
var global_question_id;
var global_question_type;
var global_image_based;
var global_image_link;
var global_question;
var global_question_rating;

// Display the data
console.log(u_name, u_reg, u_email, u_phone);

// Disable the submit button and start a timer with a countdown for x seconds
function disableSubmitButtonForTime(totalSeconds = 60) {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "black";
    let timeLeft = totalSeconds;

    const countdown = setInterval(() => {
        submitButton.innerHTML = `Wait for ${timeLeft}s`;
        timeLeft--;

        // When countdown reaches zero, re-enable the submit button
        if (timeLeft < 0) {
            clearInterval(countdown); // Stop the countdown
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#ffffff"; // Reset the button color
            submitButton.innerHTML = 'Submit'; // Reset the button text
        }
    }, 1000); // Update every second
}

// Clear the containers
function clearContainers() {
    imageContainer.innerHTML = "Loading image...";
    questionDetailContainer.innerHTML = "Loading question details...";
    questionContainer.innerText = "Loading question...";
    answerInput.value = "";

    global_unique_id = undefined;
    global_question_id = undefined;
    global_question_type = undefined;
    global_image_based = undefined;
    global_image_link = undefined;
    global_question = undefined;
    global_question_rating = undefined;
}

// empty the containers
function emptyContainers() {
    imageContainer.innerHTML = "";
    questionDetailContainer.innerHTML = "";
    questionContainer.innerText = "";
    answerInput.value = "";
}

function fetchData() {
    clearContainers();

    // Fetch the question_type_number from localStorage
    var question_type_number_num = localStorage.getItem('question_type_number');
    var question_type_number = question_type_number_num.toString();

    console.log(question_type_number);

    // if question_type_number is 9, then redirect to the final page
    if (question_type_number === "11") {
        alert("Questions completed. Redirecting to the final page. Please wait!");
        window.location.href = `thankyou.html?name=${encrypt_name}&reg=${encrypt_id}&email=${encrypt_email}&phone=${encrypt_phone}`;
        return;
    }

    const fetchQuestionData = {
        "access": "AI4A-Lab",
        "question_type_num": question_type_number
    }

    console.log('Fetching Question and Details:', fetchQuestionData);

    fetch(getQuestionAPI, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(fetchQuestionData)
    })
    .then(response => response.json())
    .then(data => {
        // if no question available, then fetch the next question of different category or move to the final page
        if (data.error === "No question available. Contact the administrator.") {
            // update the question_type_number in localStorage
            var question_type_number = localStorage.getItem('question_type_number');
            var new_question_type_number = parseInt(question_type_number) + 1;
            localStorage.setItem('question_type_number', new_question_type_number);
            console.log("Question Type Number Updated due to Availability Issues:", new_question_type_number);

            if (new_question_type_number === 11) {
                alert("No more questions available. Redirecting to the final page. Please wait!");
                window.location.href = `thankyou.html?name=${encrypt_name}&reg=${encrypt_id}&email=${encrypt_email}&phone=${encrypt_phone}`;
                return;
            }

            alert('No question available. Fetching next question of different category. Please wait!');

            fetchData();  // Fetch the next question of different category

            return;
        }
        else if (data.error) {      // other types of errors
            alert('Error! ' + data.error);

            // enable the submit button
            submitButton.disabled = false;
            submitButton.innerHTML = "Submit";
            submitButton.style.backgroundColor = "#ffffff";

            fetchData();  // Fetch the next question

            return;
        }

        global_unique_id = data.unique_id;
        global_question_id = data.question_id;
        global_question_type = data.question_type;
        global_image_based = data.image_based;
        global_image_link = data.image_link;
        global_question = data.question;
        global_question_rating = data.question_rating;

        // empty the containers
        emptyContainers();

        // image_link in format "https://drive.google.com/uc?id="
        if (global_image_based === "yes") {
            imageContainer.innerHTML = `<img src="${global_image_link}" alt="Question Image" class="responsive-image">`;
        } 
        else {
            // use default image provided in the image_link
            imageContainer.innerHTML = `<img src="${global_image_link}" alt="Question Image" class="qa-responsive-image">`;
        }
        questionDetailContainer.innerHTML = `Question Type: ${global_question_type} | Question Rating: ${global_question_rating} | Image Based: ${global_image_based}`;
        questionContainer.innerText = global_question;
        answerInput.value = ""; // Clear previous input

        // Disable the submit button for 60 seconds
        disableSubmitButtonForTime(60);

        console.log('Question and Details:', data);
    })
    .catch(error => {
        console.error('Error fetching text from API:', error);
        alert('Error! ' + error);
    })
    .finally(() => {
        console.log('Question and Details API call done!');
    });
}

function handleSubmit() {
    const answer = answerInput.value;

    if (!answer) {
        alert("Please enter answer to the given question!");
        disableSubmitButtonForTime(30);
        return;
    }

    if (answer.split(" ").length < 5) {
        alert("Answer is too short. Please enter a longer answer!");
        disableSubmitButtonForTime(30);
        return;
    }

    if (global_unique_id === undefined || global_question_id === undefined || global_unique_id === "" || global_question_id === "") {
        //alert("Error! Please refresh the page and try again. Contact Administrator.");

        // throw an error and exit, if the question_id or unique_id is missing
        alert("Error: Question detail missing. Please try again or contact the administrator.");
        return;
    }

    // Disable the submit button
    submitButton.disabled = true;
    submitButton.innerHTML = "Updating...";
    submitButton.style.backgroundColor = "black";

    const submitAnswerData = {
        "unique_id": global_unique_id,
        "question_id": global_question_id,
        "user_answer": answer
    }

    // Submit the answer
    fetch(submitAnswerAPI, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(submitAnswerData)
    })
    .then(response => response.json())
    .then(data => {
        // Errors like the field is missing, blocked, etc.
        if (data.error) {
            // reload can get new question or simply submit the answer again
            //alert('Error while submitting answer. ' + data.error);
            console.error("Error submitting answer:", data);

            // enable the submit button
            submitButton.disabled = false;
            submitButton.innerHTML = "Submit";
            submitButton.style.backgroundColor = "#ffffff";

            // throw an error and exit
            err = "Error while submitting the answer. " + data.error;
            throw new Error(err);
            return;
        }

        console.log("Answer submitted successfully:", data);

        // update the question_type_number in localStorage
        var question_type_number = localStorage.getItem('question_type_number');
        var new_question_type_number = parseInt(question_type_number) + 1;
        localStorage.setItem('question_type_number', new_question_type_number);
        console.log("Question Type Number Updated:", new_question_type_number);

        // ----------------------------
        // Database entry

        if (u_name === undefined || u_reg === undefined || u_email === undefined || u_phone === undefined) {
            alert("Error! User details missing. Going back to the login page. Please try again.");

            // move to the login page
            window.location.href = "index.html";

            return;
        }

        const entryData = {
            "unique_id": global_unique_id,
            "question_id": global_question_id,
            "name": u_name,
            "id_reg": u_reg,
            "email": u_email,
            "phone": u_phone,
            "question": global_question,
            "user_answer": answer,
            "question_rating": global_question_rating
        }

        fetch(datasetEntryAPI, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(entryData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Database Entry Successful:", data);
            alert("Answer submitted successfully. Moving to the next question. Please wait!");
        })
        .catch(err => {
            console.error("Error submitting database entry:", err);
            alert("Error! " + err);
        });
        // ----------------------------
        
    })
    .catch(err => {
        alert("Error: " + err);
        console.error("Error submitting answer:", err);
    })
    .finally(() => {
        console.log("Answer submission API call done!");
        // Fetch the next question
        fetchData();
    });
}

// Fetch data when page is loaded
window.onload = fetchData;

document.getElementById("submitButton").addEventListener("click", handleSubmit);