/* =========================================================
   CROPCARE AI - FRONTEND JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const uploadArea = document.getElementById("uploadArea");
    const imageInput = document.getElementById("imageInput");
    const chooseImageBtn = document.getElementById("chooseImageBtn");
    const previewImage = document.getElementById("previewImage");
    const uploadContent = document.getElementById("uploadContent");
    const analyzeBtn = document.getElementById("analyzeBtn");

    const cropInput = document.getElementById("crop");
    const stageInput = document.getElementById("stage");
    const locationInput = document.getElementById("location");
    const questionInput = document.getElementById("question");

    const diseaseResult = document.getElementById("diseaseResult");
    const statusResult = document.getElementById("statusResult");
    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceBar = document.getElementById("confidenceBar");
    const evidenceList = document.getElementById("evidenceList");
    const actionsList = document.getElementById("actionsList");

    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const messages = document.getElementById("messages");


    let selectedFile = null;


    /* =====================================================
       PAGE NAVIGATION
    ===================================================== */

    window.showPage = function(pageId) {

        const pages = document.querySelectorAll(".page");
        const navButtons = document.querySelectorAll(".nav-btn");

        pages.forEach(page => {
            page.classList.remove("active");
        });

        navButtons.forEach(button => {
            button.classList.remove("active");
        });

        const selectedPage = document.getElementById(pageId);

        if (!selectedPage) {
            console.error("Page not found:", pageId);
            return;
        }

        selectedPage.classList.add("active");

        const activeButton = document.querySelector(
            `.nav-btn[data-page="${pageId}"]`
        );

        if (activeButton) {
            activeButton.classList.add("active");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        history.pushState(
            null,
            "",
            "#" + pageId
        );
    };


    /* =====================================================
       INITIAL PAGE
    ===================================================== */

    function loadInitialPage() {

        const hash = window.location.hash.replace("#", "");

        const validPages = [
            "home",
            "diagnosis",
            "results",
            "chat"
        ];

        if (validPages.includes(hash)) {

            document.querySelectorAll(".page")
                .forEach(page => page.classList.remove("active"));

            document.querySelectorAll(".nav-btn")
                .forEach(button => button.classList.remove("active"));

            const page = document.getElementById(hash);

            if (page) {
                page.classList.add("active");
            }

            const button = document.querySelector(
                `.nav-btn[data-page="${hash}"]`
            );

            if (button) {
                button.classList.add("active");
            }

        } else {

            const home = document.getElementById("home");
            const homeButton = document.querySelector(
                `.nav-btn[data-page="home"]`
            );

            if (home) {
                home.classList.add("active");
            }

            if (homeButton) {
                homeButton.classList.add("active");
            }
        }
    }


    loadInitialPage();


    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    function handleFile(file) {

        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            alert(
                "Please upload a JPG, PNG or WEBP image."
            );

            return;
        }


        /* Maximum 10 MB */

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Image size must be less than 10MB."
            );

            return;
        }


        selectedFile = file;


        const reader = new FileReader();


        reader.onload = function(event) {

            previewImage.src = event.target.result;

            previewImage.style.display = "block";

            uploadContent.style.display = "none";

        };


        reader.onerror = function() {

            alert("Unable to read the image.");

        };


        reader.readAsDataURL(file);
    }


    /* Choose image button */

    if (chooseImageBtn && imageInput) {

        chooseImageBtn.addEventListener(
            "click",
            () => imageInput.click()
        );
    }


    /* Upload area click */

    if (uploadArea && imageInput) {

        uploadArea.addEventListener(
            "click",
            () => imageInput.click()
        );
    }


    /* File selected */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            event => {

                const file = event.target.files[0];

                handleFile(file);
            }
        );
    }


    /* =====================================================
       DRAG & DROP
    ===================================================== */

    if (uploadArea) {

        uploadArea.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                uploadArea.classList.add("drag-over");
            }
        );


        uploadArea.addEventListener(
            "dragleave",
            () => {

                uploadArea.classList.remove("drag-over");
            }
        );


        uploadArea.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                uploadArea.classList.remove("drag-over");

                const file =
                    event.dataTransfer.files[0];

                handleFile(file);
            }
        );
    }


    /* =====================================================
       ANALYZE CROP
    ===================================================== */

    if (analyzeBtn) {

        analyzeBtn.addEventListener(
            "click",
            analyzeCrop
        );
    }


    async function analyzeCrop() {

        const crop = cropInput
            ? cropInput.value
            : "";

        const stage = stageInput
            ? stageInput.value
            : "";

        const location = locationInput
            ? locationInput.value.trim()
            : "";

        const question = questionInput
            ? questionInput.value.trim()
            : "";


        /* Basic validation */

        if (!selectedFile) {

            alert(
                "Please upload a crop image first."
            );

            return;
        }


        if (!crop) {

            alert(
                "Please select the crop name."
            );

            return;
        }


        if (!stage) {

            alert(
                "Please select the growth stage."
            );

            return;
        }


        /* Loading state */

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML =
            "⏳ Analyzing Crop...";


        try {

            /*
             * DEMO RESULT
             *
             * Replace this section with your backend API.
             */

            await new Promise(
                resolve => setTimeout(resolve, 1500)
            );


            const result = generateDemoResult(
                crop,
                stage,
                question
            );


            displayResult(result);


            showPage("results");


        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );

            alert(
                "Something went wrong during analysis."
            );

        } finally {

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                "🔍 Analyze Crop";
        }
    }


    /* =====================================================
       DEMO AI RESULT
    ===================================================== */

    function generateDemoResult(
        crop,
        stage,
        question
    ) {

        const text =
            question.toLowerCase();


        let disease =
            "General Crop Stress";

        let status =
            "Needs Attention";

        let confidence =
            78;

        let evidence = [
            "Visible leaf discoloration may indicate crop stress.",
            "Symptoms should be compared with field conditions.",
            `Crop selected: ${crop}.`,
            `Growth stage: ${stage}.`
        ];

        let actions = [
            "Inspect affected and healthy plants separately.",
            "Check soil moisture and recent weather conditions.",
            "Monitor the crop for changes over the next few days.",
            "Consult a local agriculture expert before applying chemicals."
        ];


        if (
            text.includes("yellow") ||
            text.includes("yellowing")
        ) {

            disease =
                "Possible Nutrient or Water Stress";

            confidence = 82;

            evidence = [
                "Yellowing leaves can occur under nutrient or water stress.",
                "Recent rainfall or irrigation may influence symptoms.",
                `The crop is currently at the ${stage} stage.`
            ];

        }


        else if (
            text.includes("spot") ||
            text.includes("spots")
        ) {

            disease =
                "Possible Leaf Spot Symptoms";

            confidence = 80;

            evidence = [
                "Leaf spots can be associated with fungal or bacterial problems.",
                "Affected leaves should be inspected for spot shape and progression.",
                "Weather and humidity can influence disease development."
            ];

        }


        else if (
            text.includes("pest") ||
            text.includes("insect") ||
            text.includes("bug")
        ) {

            disease =
                "Possible Pest Damage";

            confidence = 84;

            evidence = [
                "Insect feeding can create holes, curling or discoloration.",
                "Inspect the underside of leaves for insects or eggs.",
                "Check whether damage is increasing on new leaves."
            ];

        }


        return {
            disease,
            status,
            confidence,
            evidence,
            actions
        };
    }


    /* =====================================================
       DISPLAY RESULTS
    ===================================================== */

    function displayResult(result) {

        if (diseaseResult) {

            diseaseResult.textContent =
                result.disease;
        }


        if (statusResult) {

            statusResult.textContent =
                result.status;
        }


        if (confidenceValue) {

            confidenceValue.textContent =
                result.confidence + "%";
        }


        if (confidenceBar) {

            confidenceBar.style.width =
                result.confidence + "%";
        }


        if (evidenceList) {

            evidenceList.innerHTML = "";


            result.evidence.forEach(
                item => {

                    const li =
                        document.createElement("li");

                    li.textContent = item;

                    evidenceList.appendChild(li);
                }
            );
        }


        if (actionsList) {

            actionsList.innerHTML = "";


            result.actions.forEach(
                (item, index) => {

                    const div =
                        document.createElement("div");

                    div.className = "action";


                    const number =
                        document.createElement("span");

                    number.textContent =
                        String(index + 1)
                        .padStart(2, "0");


                    const paragraph =
                        document.createElement("p");

                    paragraph.textContent = item;


                    div.appendChild(number);

                    div.appendChild(paragraph);

                    actionsList.appendChild(div);
                }
            );
        }
    }


    /* =====================================================
       CHAT
    ===================================================== */

    function addMessage(
        text,
        type
    ) {

        if (!messages) {
            return;
        }


        const message =
            document.createElement("div");

        message.className =
            type === "user"
                ? "user-message"
                : "bot-message";


        /*
         * textContent prevents arbitrary HTML
         * from being inserted into the chat.
         */

        message.textContent = text;


        messages.appendChild(message);


        messages.scrollTop =
            messages.scrollHeight;
    }


    function getBotResponse(question) {

        const q =
            question.toLowerCase();


        if (
            q.includes("yellow") ||
            q.includes("yellowing")
        ) {

            return (
                "Yellow leaves can have several causes, " +
                "including nutrient imbalance, water stress, " +
                "root problems or disease. Check soil moisture, " +
                "recent weather and whether the yellowing starts " +
                "on older or newer leaves."
            );
        }


        if (
            q.includes("pest") ||
            q.includes("insect") ||
            q.includes("bug")
        ) {

            return (
                "Inspect both sides of the leaves and young shoots " +
                "for insects, eggs, webbing or feeding damage. " +
                "Take a clear close-up photo before choosing a treatment."
            );
        }


        if (
            q.includes("water") ||
            q.includes("irrigation") ||
            q.includes("irrigate")
        ) {

            return (
                "Irrigation should depend on crop type, soil, weather " +
                "and growth stage. Avoid keeping the root zone continuously " +
                "waterlogged, and check soil moisture before irrigating."
            );
        }


        if (
            q.includes("disease") ||
            q.includes("spot") ||
            q.includes("fungus")
        ) {

            return (
                "For suspected disease, photograph both healthy and " +
                "affected leaves. Note recent rainfall, humidity, irrigation " +
                "and how quickly the symptoms are spreading."
            );
        }


        if (
            q.includes("rice")
        ) {

            return (
                "For rice, monitor leaf color, water management, weeds, " +
                "insect damage and disease symptoms. The correct advice " +
                "depends on the growth stage and field conditions."
            );
        }


        if (
            q.includes("tomato")
        ) {

            return (
                "For tomato, inspect leaves, stems and fruit separately. " +
                "Look for spots, curling, yellowing, insects and fruit damage. " +
                "A clear image can help with preliminary assessment."
            );
        }


        return (
            "I can help with crop symptoms, pests, irrigation and general " +
            "crop-health questions. Tell me the crop name, growth stage, " +
            "symptoms and recent weather or irrigation conditions."
        );
    }


    function sendMessage() {

        if (!chatInput) {
            return;
        }


        const question =
            chatInput.value.trim();


        if (!question) {
            return;
        }


        addMessage(
            question,
            "user"
        );


        chatInput.value = "";


        /*
         * Small delay to make the demo feel like
         * an AI assistant is processing the question.
         */

        setTimeout(
            () => {

                const response =
                    getBotResponse(question);

                addMessage(
                    response,
                    "bot"
                );

            },
            600
        );
    }


    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );
    }


    if (chatInput) {

        chatInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();
                }
            }
        );
    }


    /* =====================================================
       BROWSER BACK BUTTON
    ===================================================== */

    window.addEventListener(
        "popstate",
        () => {

            const hash =
                window.location.hash.replace("#", "")
                || "home";


            const validPages = [
                "home",
                "diagnosis",
                "results",
                "chat"
            ];


            if (validPages.includes(hash)) {

                document.querySelectorAll(".page")
                    .forEach(page =>
                        page.classList.remove("active")
                    );


                document.querySelectorAll(".nav-btn")
                    .forEach(button =>
                        button.classList.remove("active")
                    );


                const page =
                    document.getElementById(hash);

                if (page) {
                    page.classList.add("active");
                }


                const button =
                    document.querySelector(
                        `.nav-btn[data-page="${hash}"]`
                    );

                if (button) {
                    button.classList.add("active");
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    );

});
