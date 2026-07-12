// ===========================================
// AI CONTENT STUDIO
// Frontend JavaScript
// ===========================================

// ---------- Backend URL ----------
const API_BASE = "http://127.0.0.1:8000";

// ---------- Elements ----------
const contentType = document.getElementById("contentType");
const topic = document.getElementById("topic");
const tone = document.getElementById("tone");
const wordCount = document.getElementById("wordCount");
const wordValue = document.getElementById("wordValue");

const generateBtn = document.getElementById("generateBtn");

const output = document.getElementById("output");

const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

const statusBadge = document.querySelector(".status");

// ---------- Word Count ----------
wordValue.textContent = wordCount.value;

wordCount.addEventListener("input", () => {
    wordValue.textContent = wordCount.value;
});

// ---------- Health Check ----------
async function checkConnection() {

    try {

        const res = await fetch(`${API_BASE}/health`);

        if (res.ok) {

            statusBadge.textContent = "🟢 Connected";

            statusBadge.style.background =
                "rgba(34,197,94,.18)";

        } else {

            throw new Error();

        }

    }

    catch {

        statusBadge.textContent = "🔴 Offline";

        statusBadge.style.background =
            "rgba(239,68,68,.18)";

    }

}

checkConnection();

// ---------- Generate ----------

generateBtn.addEventListener("click", generateContent);

async function generateContent() {

    if (topic.value.trim() === "") {

        alert("Please enter a topic.");

        topic.focus();

        return;

    }

    output.textContent = "";

    generateBtn.disabled = true;

    generateBtn.innerHTML =
        "⏳ Generating...";

    const start = performance.now();

    try {

        const response = await fetch(
            `${API_BASE}/generate-stream`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    topic: topic.value,

                    content_type: contentType.value,

                    tone: tone.value,

                    word_count: Number(wordCount.value)

                })

            }
        );

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const reader = response.body.getReader();

        const decoder = new TextDecoder();

        while (true) {

            const { done, value } =
                await reader.read();

            if (done) break;

            const chunk =
                decoder.decode(value);

            output.textContent += chunk;

            output.scrollTop =
                output.scrollHeight;

        }

        const end = performance.now();

        console.log(
            `Generated in ${(
                (end - start) / 1000
            ).toFixed(2)} sec`
        );

    }

    catch (err) {

        console.error(err);

        output.innerHTML =
            "❌ Failed to generate content.<br><br>Check that FastAPI is running.";

    }

    finally {

        generateBtn.disabled = false;

        generateBtn.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Content';

    }

}

// ---------- Copy ----------

copyBtn.addEventListener("click", async () => {

    if (output.textContent.trim() === "")
        return;

    try {

        await navigator.clipboard.writeText(
            output.textContent
        );

        const old = copyBtn.innerHTML;

        copyBtn.innerHTML = "✅ Copied";

        setTimeout(() => {

            copyBtn.innerHTML = old;

        }, 1800);

    }

    catch {

        alert("Unable to copy.");

    }

});

// ---------- Download ----------

downloadBtn.addEventListener("click", () => {

    if (output.textContent.trim() === "")
        return;

    const blob = new Blob(

        [output.textContent],

        { type: "text/plain" }

    );

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "generated-content.txt";

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

});

// ---------- Clear ----------

clearBtn.addEventListener("click", () => {

    output.textContent =
        "Your AI-generated content will appear here...";

});

// ---------- Ctrl + Enter ----------

topic.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "Enter") {

        generateContent();

    }

});
