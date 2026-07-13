// =========================================================
// AI CONTENT STUDIO
// Frontend Logic - Part 1
// Built by Maria Khan
// =========================================================

// =========================================================
// BACKEND CONFIGURATION
// =========================================================

const API_BASE = "http://127.0.0.1:8000";

// =========================================================
// DOM ELEMENTS
// =========================================================

// Input Elements
const contentType = document.getElementById("contentType");
const topic = document.getElementById("topic");
const tone = document.getElementById("tone");
const wordCount = document.getElementById("wordCount");
const wordValue = document.getElementById("wordValue");

// Buttons
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

// Output
const output = document.getElementById("output");

// Status Badge
const statusBadge = document.querySelector(".status");

// Statistics
const wordsGenerated = document.getElementById("wordsGenerated");
const charactersGenerated = document.getElementById("charactersGenerated");
const generationTime = document.getElementById("generationTime");

// Toast
const toast = document.getElementById("toast");

// =========================================================
// GLOBAL VARIABLES
// =========================================================

let lastPrompt = null;
let isGenerating = false;

// =========================================================
// WORD COUNT SLIDER
// =========================================================

wordValue.textContent = wordCount.value;

wordCount.addEventListener("input", () => {

    wordValue.textContent = wordCount.value;

});

// =========================================================
// TOAST NOTIFICATION
// =========================================================

function showToast(message, type = "info") {

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

// =========================================================
// OUTPUT HELPERS
// =========================================================

function clearOutput() {

    output.innerHTML =
        "Your AI-generated content will appear here...";

}

function showThinkingAnimation() {

    output.innerHTML = `
        <div class="thinking">

            <span class="brain">🧠</span>

            Gemini is thinking

            <span class="dots"></span>

        </div>
    `;

}

function removeThinkingAnimation() {

    if (output.querySelector(".thinking")) {

        output.innerHTML = "";

    }

}

// =========================================================
// STATISTICS
// =========================================================

function updateStatistics(text, seconds) {

    const trimmed = text.trim();

    const wordCountValue = trimmed.length === 0
        ? 0
        : trimmed.split(/\s+/).length;

    wordsGenerated.textContent =
        wordCountValue;

    charactersGenerated.textContent =
        text.length;

    generationTime.textContent =
        seconds + " s";

}

function resetStatistics() {

    wordsGenerated.textContent = "0";

    charactersGenerated.textContent = "0";

    generationTime.textContent = "0 s";

}

// =========================================================
// CONNECTION CHECK
// =========================================================

async function checkConnection() {

    try {

        const response =
            await fetch(`${API_BASE}/health`);

        if (!response.ok) {

            throw new Error();

        }

        statusBadge.innerHTML =
            "🟢 Connected";

        statusBadge.style.background =
            "rgba(34,197,94,.18)";

        statusBadge.style.color =
            "#86efac";

    }

    catch {

        statusBadge.innerHTML =
            "🔴 Offline";

        statusBadge.style.background =
            "rgba(239,68,68,.18)";

        statusBadge.style.color =
            "#fecaca";

    }

}

// =========================================================
// BUTTON HELPERS
// =========================================================

function disableGenerateButton() {

    isGenerating = true;

    generateBtn.disabled = true;

    generateBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i>
         Generating...`;

}

function enableGenerateButton() {

    isGenerating = false;

    generateBtn.disabled = false;

    generateBtn.innerHTML =
        `<i class="fa-solid fa-wand-magic-sparkles"></i>
         Generate Content`;

}

// =========================================================
// RESET APP
// =========================================================

function resetApplication() {

    clearOutput();

    resetStatistics();

}

// =========================================================
// INITIALIZATION
// =========================================================

checkConnection();

resetStatistics();

// =========================================================
// GENERATE CONTENT
// =========================================================

generateBtn.addEventListener("click", generateContent);

async function generateContent() {

    // Prevent duplicate requests

    if (isGenerating) {

        return;

    }

    // Validate Topic

    if (topic.value.trim() === "") {

        showToast(
            "⚠ Please enter a topic.",
            "warning"
        );

        topic.focus();

        return;

    }

    // Save last prompt

    lastPrompt = {

        topic: topic.value,

        content_type: contentType.value,

        tone: tone.value,

        word_count: Number(wordCount.value)

    };

    disableGenerateButton();

    resetStatistics();

    showThinkingAnimation();

    const startTime = performance.now();

    let generatedText = "";

    try {

        const response = await fetch(

            `${API_BASE}/generate-stream`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(lastPrompt)

            }

        );

        if (!response.ok) {

            throw new Error(
                "Unable to connect to FastAPI."
            );

        }

        // Remove thinking animation

        removeThinkingAnimation();

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        while (true) {

            const { done, value } =
                await reader.read();

            if (done) {

                break;

            }

            const chunk =
                decoder.decode(value);

            generatedText += chunk;

            output.innerHTML =
                generatedText +
                `<span class="cursor">|</span>`;

            output.scrollTop =
                output.scrollHeight;

            // Live Statistics

            const currentSeconds =
                (
                    (performance.now() - startTime)
                    / 1000
                ).toFixed(2);

            updateStatistics(

                generatedText,

                currentSeconds

            );

        }

        // Remove Cursor

        output.textContent =
            generatedText;

            saveOutput(generatedText);

        const totalSeconds =
            (
                (performance.now() - startTime)
                / 1000
            ).toFixed(2);

        updateStatistics(

            generatedText,

            totalSeconds

        );

        showToast(

            "✨ Content generated successfully!",

            "success"

        );

    }

    catch (error) {

        console.error(error);

        output.innerHTML =

        `
        <div style="padding:25px;text-align:center;">

            <h3 style="color:#ef4444;">
                Generation Failed
            </h3>

            <p style="margin-top:12px;line-height:1.7;">
                Unable to generate content.

                <br><br>

                Make sure:

                <br>

                ✅ FastAPI is running

                <br>

                ✅ Gemini API Key is valid

                <br>

                ✅ Internet connection is available

            </p>

        </div>
        `;

        resetStatistics();

        showToast(

            "❌ Failed to generate content.",

            "error"

        );

    }

    finally {

        enableGenerateButton();

    }

}

// =========================================================
// COPY BUTTON
// =========================================================

copyBtn.addEventListener("click", async () => {

    const text = output.textContent.trim();

    if (
        text === "" ||
        text === "Your AI-generated content will appear here..."
    ) {

        showToast("Nothing to copy.", "warning");
        return;

    }

    try {

        await navigator.clipboard.writeText(text);

        const oldText = copyBtn.innerHTML;

        copyBtn.innerHTML =
            '<i class="fa-solid fa-check"></i> Copied';

        showToast("Copied to clipboard!", "success");

        setTimeout(() => {

            copyBtn.innerHTML = oldText;

        }, 1800);

    }

    catch {

        showToast("Unable to copy.", "error");

    }

});


// =========================================================
// DOWNLOAD BUTTON
// =========================================================

downloadBtn.addEventListener("click", () => {

    const text = output.textContent.trim();

    if (
        text === "" ||
        text === "Your AI-generated content will appear here..."
    ) {

        showToast("Nothing to download.", "warning");
        return;

    }

    const blob = new Blob(
        [text],
        { type: "text/plain" }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    const filename =
        topic.value.trim() === ""
            ? "generated-content.txt"
            : `${topic.value
                .trim()
                .replace(/[^\w]/g, "_")
                .substring(0, 30)}.txt`;

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    showToast("Download started!", "success");

});


// =========================================================
// CLEAR BUTTON
// =========================================================

clearBtn.addEventListener("click", () => {

    output.textContent =
        "Your AI-generated content will appear here...";

    resetStatistics();

    showToast("Workspace cleared.", "success");

});


// =========================================================
// CTRL + ENTER
// =========================================================

topic.addEventListener("keydown", (event) => {

    if (
        event.ctrlKey &&
        event.key === "Enter"
    ) {

        generateContent();

    }

});


// =========================================================
// AUTO SAVE LAST OUTPUT
// =========================================================

function saveOutput(text) {

    localStorage.setItem(
        "lastGeneratedContent",
        text
    );

}

function loadSavedOutput() {

    const saved =
        localStorage.getItem(
            "lastGeneratedContent"
        );

    if (!saved) return;

    output.textContent = saved;

    updateStatistics(
        saved,
        0
    );

}


// =========================================================
// AUTO SAVE AFTER GENERATION
// =========================================================

function saveOutput(text) {

    if (text.trim() !== "") {

        localStorage.setItem(
            "lastGeneratedContent",
            text
        );

    }

}


// =========================================================
// PAGE LOAD
// =========================================================

window.addEventListener("load", () => {

    loadSavedOutput();

});


// =========================================================
// ESC TO CLEAR
// =========================================================

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        !isGenerating
    ) {

        clearBtn.click();

    }

});


// =========================================================
// AUTO RESIZE TEXTAREA
// =========================================================

topic.addEventListener("input", () => {

    topic.style.height = "auto";

    topic.style.height =
        topic.scrollHeight + "px";

});


// =========================================================
// PREVENT EMPTY SPACE INPUT
// =========================================================

topic.addEventListener("blur", () => {

    topic.value =
        topic.value.trim();

});


// =========================================================
// ENTER ANIMATION
// =========================================================

document.body.classList.add("loaded");

// =========================================================
// REGENERATE LAST PROMPT
// =========================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "F5" && lastPrompt && !isGenerating) {

        event.preventDefault();

        generateContent();

    }

});


// =========================================================
// PROMPT HISTORY
// =========================================================

function savePromptHistory() {

    if (!lastPrompt) return;

    let history =
        JSON.parse(
            localStorage.getItem("promptHistory")
        ) || [];

    history.unshift(lastPrompt);

    history = history.slice(0, 10);

    localStorage.setItem(
        "promptHistory",
        JSON.stringify(history)
    );

}

function getPromptHistory() {

    return JSON.parse(

        localStorage.getItem("promptHistory")

    ) || [];

}


// =========================================================
// SAVE HISTORY AFTER SUCCESS
// =========================================================

const oldGenerate = generateContent;

generateContent = async function () {

    await oldGenerate();

    savePromptHistory();

};


// =========================================================
// CHARACTER COUNTER
// =========================================================

topic.addEventListener("input", () => {

    const max = 1000;

    if (topic.value.length > max) {

        topic.value =
            topic.value.substring(0, max);

        showToast(

            "Maximum 1000 characters.",

            "warning"

        );

    }

});


// =========================================================
// CONNECTION CHECK EVERY 30 SECONDS
// =========================================================

setInterval(() => {

    checkConnection();

}, 30000);


// =========================================================
// FOCUS INPUT WHEN PAGE LOADS
// =========================================================

window.addEventListener("load", () => {

    topic.focus();

});


// =========================================================
// RANDOM PLACEHOLDER IDEAS
// =========================================================

const topicIdeas = [

    "Benefits of Artificial Intelligence",

    "Future of Cybersecurity",

    "Blockchain in Banking",

    "Instagram Caption for Coffee",

    "Travel Blog about Dubai",

    "Professional Leave Email",

    "LinkedIn Career Post",

    "Startup Product Description",

    "Healthy Lifestyle Tips",

    "Python Programming Guide"

];

window.addEventListener("load", () => {

    topic.placeholder =

        topicIdeas[

            Math.floor(

                Math.random()

                * topicIdeas.length

            )

        ];

});


// =========================================================
// SHOW GENERATION TIME IN CONSOLE
// =========================================================

window.addEventListener("beforeunload", () => {

    console.log(

        "Thanks for using AI Content Studio."

    );

});


// =========================================================
// SMALL OUTPUT FADE EFFECT
// =========================================================

const observer = new MutationObserver(() => {

    output.style.opacity = ".6";

    setTimeout(() => {

        output.style.opacity = "1";

    }, 150);

});

observer.observe(output, {

    childList: true,

    subtree: true,

    characterData: true

});


// =========================================================
// END
// =========================================================

console.log(

`=========================================
 AI CONTENT STUDIO
 Powered by Gemini 3.5
 Built with HTML • CSS • JavaScript
 Backend: FastAPI
=========================================`
);