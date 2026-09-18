// IMAGE PREVIEW

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadContent = document.getElementById("uploadContent");

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

            previewImage.src = e.target.result;

            previewImage.style.display = "block";

            uploadContent.style.display = "none";

        };

        reader.readAsDataURL(file);
    }

});


// CROP ANALYSIS

function analyzeCrop() {

    const crop = document.getElementById("crop").value;
    const stage = document.getElementById("stage").value;
    const location = document.getElementById("location").value;
    const question = document.getElementById("question").value;

    if (!imageInput.files[0]) {

        alert("Please upload a crop image.");

        return;
    }

    if (!crop) {

        alert("Please select the crop.");

        return;
    }

    if (!stage) {

        alert("Please select the growth stage.");

        return;
    }


    // DEMO RESULT

    let disease = "Leaf Spot Disease";

    if (crop === "Rice") {
        disease = "Possible Bacterial Leaf Blight";
    }

    if (crop === "Tomato") {
        disease = "Possible Leaf Spot Infection";
    }

    if (crop === "Cotton") {
        disease = "Possible Leaf Disease";
    }


    document.getElementById("diseaseResult").innerText = disease;


    // Scroll to result

    document.getElementById("results").scrollIntoView({
        behavior: "smooth"
    });

}


// CHATBOT

function sendMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value.trim();

    if (message === "") {
        return;
    }


    const messages = document.getElementById("messages");


    // USER MESSAGE

    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.innerText = message;

    messages.appendChild(userMessage);


    input.value = "";


    // DEMO AI RESPONSE

    setTimeout(function () {

        const botMessage = document.createElement("div");

        botMessage.className = "bot-message";

        botMessage.innerText =
            "I understand your crop problem. Please upload a clear close-up image of the affected leaf so the crop health system can analyse the symptoms more accurately.";

        messages.appendChild(botMessage);

        messages.scrollTop = messages.scrollHeight;

    }, 700);

}


// ENTER KEY

function handleEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}