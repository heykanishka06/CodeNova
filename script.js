document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MEDICASE CONFIGURATION
    // =====================================================

    /*
        IMPORTANT:

        Do NOT put your OpenAI API key here.

        Your GitHub Pages website should call a secure backend.

        Example:
        https://your-backend-url.vercel.app/api/summarize

        Once your backend is ready, replace the value below.
    */

    const AI_API_URL = "/api/summarize";

    const patientForm =
        document.getElementById("patientForm");

    const saveDraftBtn =
        document.getElementById("saveDraftBtn");

    const STORAGE_KEY =
        "medicasePatients";


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!patientForm) {
        console.error("Patient form not found.");
        return;
    }


    // =====================================================
    // SMART QUESTIONS
    // =====================================================

    function setupSmartQuestion(radioName, questionBox) {

        if (!questionBox) {
            return;
        }

        const options =
            document.querySelectorAll(
                `input[name="${radioName}"]`
            );

        options.forEach(function (option) {

            option.addEventListener(
                "change",
                function () {

                    if (this.value === "yes") {

                        questionBox.style.display =
                            "grid";

                    } else {

                        questionBox.style.display =
                            "none";
                    }
                }
            );
        });
    }


    const digestiveQuestions =
        document.getElementById(
            "digestiveQuestions"
        );

    const respiratoryQuestions =
        document.getElementById(
            "respiratoryQuestions"
        );

    const sleepQuestions =
        document.getElementById(
            "sleepQuestions"
        );


    setupSmartQuestion(
        "digestiveProblem",
        digestiveQuestions
    );

    setupSmartQuestion(
        "respiratoryProblem",
        respiratoryQuestions
    );

    setupSmartQuestion(
        "sleepProblem",
        sleepQuestions
    );


    // =====================================================
    // GET ALL PATIENTS
    // =====================================================

    function getPatients() {

        const savedPatients =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!savedPatients) {
            return [];
        }

        try {

            return JSON.parse(
                savedPatients
            );

        } catch (error) {

            console.error(
                "Could not read patients:",
                error
            );

            return [];
        }
    }


    // =====================================================
    // SAVE PATIENT
    // =====================================================

    if (saveDraftBtn) {

        saveDraftBtn.addEventListener(
            "click",
            function () {

                const formData =
                    new FormData(
                        patientForm
                    );

                const patientData = {};


                // -----------------------------------------
                // NORMAL FORM FIELDS
                // -----------------------------------------

                formData.forEach(
                    function (value, key) {

                        if (key !== "symptoms") {

                            patientData[key] =
                                value;
                        }
                    }
                );


                // -----------------------------------------
                // MULTIPLE SYMPTOMS
                // -----------------------------------------

                patientData.symptoms = [];

                const selectedSymptoms =
                    document.querySelectorAll(
                        'input[name="symptoms"]:checked'
                    );

                selectedSymptoms.forEach(
                    function (checkbox) {

                        patientData.symptoms.push(
                            checkbox.value
                        );
                    }
                );


                // -----------------------------------------
                // DIGESTIVE QUESTIONS
                // -----------------------------------------

                patientData.digestiveProblem =
                    document.querySelector(
                        'input[name="digestiveProblem"]:checked'
                    )?.value || "";

                patientData.digestiveType =
                    document.getElementById(
                        "digestiveType"
                    )?.value || "";

                patientData.digestiveSeverity =
                    document.getElementById(
                        "digestiveSeverity"
                    )?.value || "";


                // -----------------------------------------
                // RESPIRATORY QUESTIONS
                // -----------------------------------------

                patientData.respiratoryProblem =
                    document.querySelector(
                        'input[name="respiratoryProblem"]:checked'
                    )?.value || "";

                patientData.respiratoryType =
                    document.getElementById(
                        "respiratoryType"
                    )?.value || "";

                patientData.respiratoryDuration =
                    document.getElementById(
                        "respiratoryDuration"
                    )?.value || "";


                // -----------------------------------------
                // SLEEP QUESTIONS
                // -----------------------------------------

                patientData.sleepProblem =
                    document.querySelector(
                        'input[name="sleepProblem"]:checked'
                    )?.value || "";

                patientData.sleepType =
                    document.getElementById(
                        "sleepType"
                    )?.value || "";

                patientData.sleepHours =
                    document.getElementById(
                        "sleepHours"
                    )?.value || "";


                // -----------------------------------------
                // PATIENT ID + DATE
                // -----------------------------------------

                patientData.id =
                    Date.now().toString();

                patientData.savedAt =
                    new Date().toLocaleString();


                // -----------------------------------------
                // ADD PATIENT
                // -----------------------------------------

                const patients =
                    getPatients();

                patients.push(
                    patientData
                );

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(patients)
                );


                alert(
                    "Patient information saved successfully!"
                );
            }
        );
    }


    // =====================================================
    // PATIENTS NAVIGATION
    // =====================================================

    const navLinks =
        document.querySelectorAll(
            ".sidebar nav a"
        );

    let patientsLink = null;
    let newCaseLink = null;


    navLinks.forEach(
        function (link) {

            const text =
                link.innerText.trim();

            if (text === "Patients") {
                patientsLink = link;
            }

            if (text === "New Case") {
                newCaseLink = link;
            }
        }
    );


    // =====================================================
    // SHOW PATIENTS PAGE
    // =====================================================

    function showPatientsPage() {

        const form =
            document.getElementById(
                "patientForm"
            );

        const topbar =
            document.querySelector(
                ".topbar"
            );

        const progress =
            document.querySelector(
                ".progress-container"
            );

        const cards =
            document.querySelectorAll(
                ".card"
            );

        const formActions =
            document.querySelector(
                ".form-actions"
            );


        if (form) {
            form.style.display = "none";
        }

        if (progress) {
            progress.style.display = "none";
        }

        cards.forEach(
            function (card) {
                card.style.display = "none";
            }
        );

        if (formActions) {
            formActions.style.display = "none";
        }


        // -----------------------------------------
        // TOP BAR
        // -----------------------------------------

        if (topbar) {

            topbar.innerHTML = `

                <div>

                    <h1>Patients</h1>

                    <p>
                        View and manage saved patient records
                    </p>

                </div>

                <button
                    id="newPatientBtn"
                    class="submit-btn"
                    type="button"
                >

                    <i class="fa-solid fa-plus"></i>

                    New Patient

                </button>

            `;
        }


        // -----------------------------------------
        // PATIENTS PAGE
        // -----------------------------------------

        let patientsPage =
            document.getElementById(
                "patientsPage"
            );


        if (!patientsPage) {

            patientsPage =
                document.createElement(
                    "section"
                );

            patientsPage.id =
                "patientsPage";

            patientsPage.className =
                "patients-page";


            if (form) {

                form.parentNode.insertBefore(
                    patientsPage,
                    form
                );
            }
        }


        patientsPage.style.display =
            "block";


        renderPatients();


        const newPatientBtn =
            document.getElementById(
                "newPatientBtn"
            );

        if (newPatientBtn) {

            newPatientBtn.addEventListener(
                "click",
                showNewCase
            );
        }
    }


    // =====================================================
    // SHOW NEW CASE
    // =====================================================

    function showNewCase() {

        const form =
            document.getElementById(
                "patientForm"
            );

        const progress =
            document.querySelector(
                ".progress-container"
            );

        const cards =
            document.querySelectorAll(
                ".card"
            );

        const formActions =
            document.querySelector(
                ".form-actions"
            );

        const patientsPage =
            document.getElementById(
                "patientsPage"
            );

        const topbar =
            document.querySelector(
                ".topbar"
            );


        // -----------------------------------------
        // CLEAR OLD INFORMATION
        // -----------------------------------------

        if (form) {
            form.reset();
        }


        // -----------------------------------------
        // HIDE SMART QUESTIONS
        // -----------------------------------------

        if (digestiveQuestions) {
            digestiveQuestions.style.display =
                "none";
        }

        if (respiratoryQuestions) {
            respiratoryQuestions.style.display =
                "none";
        }

        if (sleepQuestions) {
            sleepQuestions.style.display =
                "none";
        }


        // -----------------------------------------
        // HIDE PATIENTS PAGE
        // -----------------------------------------

        if (patientsPage) {
            patientsPage.style.display =
                "none";
        }


        // -----------------------------------------
        // SHOW FORM
        // -----------------------------------------

        if (form) {
            form.style.display =
                "block";
        }

        if (progress) {
            progress.style.display =
                "flex";
        }

        cards.forEach(
            function (card) {

                card.style.display =
                    "block";
            }
        );

        if (formActions) {

            formActions.style.display =
                "flex";
        }


        // -----------------------------------------
        // RESTORE TOP BAR
        // -----------------------------------------

        if (topbar) {

            topbar.innerHTML = `

                <div>

                    <h1>New Patient Case</h1>

                    <p>
                        Complete the patient's clinical information
                    </p>

                </div>


                <div class="doctor">

                    <div class="doctor-icon">

                        <i class="fa-solid fa-user-doctor"></i>

                    </div>


                    <div>

                        <strong>
                            Practitioner
                        </strong>

                        <span>
                            Ayurveda Clinic
                        </span>

                    </div>

                </div>

            `;
        }
    }


    // =====================================================
    // RENDER PATIENTS
    // =====================================================

    function renderPatients() {

        const patientsPage =
            document.getElementById(
                "patientsPage"
            );

        if (!patientsPage) {
            return;
        }


        const patients =
            getPatients();


        // -----------------------------------------
        // NO PATIENTS
        // -----------------------------------------

        if (patients.length === 0) {

            patientsPage.innerHTML = `

                <div class="empty-patients">

                    <div class="empty-icon">

                        <i class="fa-solid fa-users"></i>

                    </div>

                    <h2>
                        No Patients Yet
                    </h2>

                    <p>
                        Saved patient records will appear here.
                    </p>

                </div>

            `;

            return;
        }


        // -----------------------------------------
        // PATIENT HEADER
        // -----------------------------------------

        let html = `

            <div class="patients-header">

                <div>

                    <h2>
                        Patient Records
                    </h2>

                    <p>

                        ${patients.length}

                        patient${patients.length === 1 ? "" : "s"}

                        saved

                    </p>

                </div>

            </div>


            <div class="patient-list">

        `;


        // -----------------------------------------
        // PATIENT ROWS
        // -----------------------------------------

        patients
            .slice()
            .reverse()
            .forEach(
                function (patient) {

                    const name =
                        patient.patientName ||
                        "Unnamed Patient";

                    const age =
                        patient.age ||
                        "—";

                    const gender =
                        patient.gender ||
                        "—";

                    const phone =
                        patient.phone ||
                        "No phone";

                    const complaint =
                        patient.mainComplaint ||
                        "No complaint added";


                    html += `

                        <div class="patient-row">

                            <div class="patient-avatar">

                                <i class="fa-solid fa-user"></i>

                            </div>


                            <div class="patient-info">

                                <h3>
                                    ${escapeHTML(name)}
                                </h3>

                                <p>

                                    ${escapeHTML(gender)}

                                    &nbsp; • &nbsp;

                                    ${escapeHTML(age)}

                                    years

                                </p>

                            </div>


                            <div class="patient-complaint">

                                <span>
                                    Main Complaint
                                </span>

                                <strong>
                                    ${escapeHTML(complaint)}
                                </strong>

                            </div>


                            <div class="patient-phone">

                                <i class="fa-solid fa-phone"></i>

                                ${escapeHTML(phone)}

                            </div>


                            <div class="patient-date">

                                ${escapeHTML(
                                    patient.savedAt || ""
                                )}

                            </div>


                            <div class="patient-actions">

                                <button
                                    class="view-patient"
                                    data-id="${patient.id}"
                                >

                                    <i class="fa-solid fa-eye"></i>

                                    View

                                </button>


                                <button
                                    class="delete-patient"
                                    data-id="${patient.id}"
                                >

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        </div>

                    `;
                }
            );


        html += `</div>`;


        patientsPage.innerHTML =
            html;


        // =================================================
        // VIEW BUTTONS
        // =================================================

        document
            .querySelectorAll(
                ".view-patient"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const patient =
                                patients.find(
                                    function (p) {

                                        return (
                                            p.id ===
                                            this.dataset.id
                                        );

                                    }.bind(this)
                                );


                            if (patient) {

                                showPatientDetails(
                                    patient
                                );
                            }

                        }
                    );
                }
            );


        // =================================================
        // DELETE BUTTONS
        // =================================================

        document
            .querySelectorAll(
                ".delete-patient"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                this.dataset.id;


                            const confirmed =
                                confirm(
                                    "Delete this patient record?"
                                );


                            if (!confirmed) {
                                return;
                            }


                            const updatedPatients =
                                patients.filter(
                                    function (patient) {

                                        return (
                                            patient.id !== id
                                        );

                                    }
                                );


                            localStorage.setItem(
                                STORAGE_KEY,
                                JSON.stringify(
                                    updatedPatients
                                )
                            );


                            renderPatients();

                        }
                    );
                }
            );
    }


    // =====================================================
    // PATIENT DETAILS
    // =====================================================

    function showPatientDetails(patient) {

        const patientsPage =
            document.getElementById(
                "patientsPage"
            );

        if (!patientsPage) {
            return;
        }


        const symptoms =
            patient.symptoms &&
            patient.symptoms.length
                ? patient.symptoms.join(", ")
                : "No symptoms selected";


        patientsPage.innerHTML = `

            <div class="patient-detail">


                <!-- BACK BUTTON -->

                <button
                    id="backToPatients"
                    class="back-btn"
                    type="button"
                >

                    <i class="fa-solid fa-arrow-left"></i>

                    Back to Patients

                </button>


                <!-- PATIENT CARD -->

                <div class="detail-card">


                    <!-- HEADER -->

                    <div class="detail-header">


                        <div class="large-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>


                        <div>

                            <h2>

                                ${escapeHTML(
                                    patient.patientName ||
                                    "Unnamed Patient"
                                )}

                            </h2>


                            <p>
                                Patient Record
                            </p>

                        </div>


                    </div>


                    <!-- PATIENT INFORMATION -->

                    <div class="detail-grid">


                        ${detailItem(
                            "Age",
                            patient.age
                        )}


                        ${detailItem(
                            "Gender",
                            patient.gender
                        )}


                        ${detailItem(
                            "Phone",
                            patient.phone
                        )}


                        ${detailItem(
                            "Occupation",
                            patient.occupation
                        )}


                        ${detailItem(
                            "Main Complaint",
                            patient.mainComplaint
                        )}


                        ${detailItem(
                            "Duration",
                            `${patient.complaintDuration || ""} ${patient.complaintDurationUnit || ""}`
                        )}


                        ${detailItem(
                            "Severity",
                            patient.severity
                        )}


                        ${detailItem(
                            "Water Intake",
                            patient.waterIntake
                                ? patient.waterIntake +
                                  " glasses/day"
                                : ""
                        )}


                        ${detailItem(
                            "Physical Activity",
                            patient.physicalActivity
                        )}


                        ${detailItem(
                            "Stress Level",
                            patient.stressLevel
                        )}


                        ${detailItem(
                            "Body Type",
                            patient.bodyType
                        )}


                        ${detailItem(
                            "Appetite",
                            patient.appetite
                        )}

                    </div>


                    <!-- SYMPTOMS -->

                    <div class="detail-section">

                        <h3>
                            Symptoms
                        </h3>

                        <p>
                            ${escapeHTML(symptoms)}
                        </p>

                    </div>


                    <!-- SMART QUESTIONS -->

                    <div class="detail-section smart-detail-section">

                        <h3>
                            Additional Information
                        </h3>


                        ${detailItem(
                            "Digestive Problem",
                            patient.digestiveProblem
                        )}

                        ${detailItem(
                            "Digestive Type",
                            patient.digestiveType
                        )}

                        ${detailItem(
                            "Digestive Severity",
                            patient.digestiveSeverity
                        )}

                        ${detailItem(
                            "Respiratory Problem",
                            patient.respiratoryProblem
                        )}

                        ${detailItem(
                            "Respiratory Type",
                            patient.respiratoryType
                        )}

                        ${detailItem(
                            "Respiratory Duration",
                            patient.respiratoryDuration
                        )}

                        ${detailItem(
                            "Sleep Problem",
                            patient.sleepProblem
                        )}

                        ${detailItem(
                            "Sleep Type",
                            patient.sleepType
                        )}

                        ${detailItem(
                            "Sleep Hours",
                            patient.sleepHours
                        )}

                    </div>


                    <!-- PRACTITIONER NOTES -->

                    <div class="detail-section">

                        <h3>
                            Practitioner Notes
                        </h3>

                        <p>

                            ${
                                escapeHTML(
                                    patient.notes ||
                                    "No notes added"
                                )
                            }

                        </p>

                    </div>


                    <!-- =================================================
                         AI CASE SUMMARY
                    ================================================== -->

                    <div class="ai-summary-card">


                        <div class="ai-summary-header">


                            <div class="ai-summary-icon">

                                <i class="fa-solid fa-wand-magic-sparkles"></i>

                            </div>


                            <div>

                                <h3>
                                    AI Case Summary
                                </h3>

                                <p>
                                    Generate a structured summary from this case
                                </p>

                            </div>

                        </div>


                        <div
                            id="aiSummaryContent"
                            class="ai-summary-content"
                        >

                            <div class="ai-summary-empty">

                                <div class="ai-empty-icon">

                                    <i class="fa-solid fa-sparkles"></i>

                                </div>


                                <h4>
                                    Ready to summarize
                                </h4>


                                <p>
                                    AI will organize the patient's
                                    information into a concise
                                    clinical case summary.
                                </p>

                            </div>

                        </div>


                        <div class="ai-summary-actions">

                            <button
                                id="generateAISummaryBtn"
                                class="ai-generate-btn"
                                type="button"
                            >

                                <i class="fa-solid fa-wand-magic-sparkles"></i>

                                Generate AI Summary

                            </button>

                        </div>


                        <div class="ai-disclaimer">

                            <i class="fa-solid fa-circle-info"></i>

                            <span>
                                AI-generated summary for documentation support.
                                Review by a qualified practitioner before clinical use.
                            </span>

                        </div>

                    </div>


                    <!-- SAVED TIME -->

                    <div class="saved-time">

                        Saved:

                        ${escapeHTML(
                            patient.savedAt || ""
                        )}

                    </div>


                </div>

            </div>

        `;


        // =================================================
        // BACK BUTTON
        // =================================================

        const backButton =
            document.getElementById(
                "backToPatients"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                renderPatients
            );
        }


        // =================================================
        // AI BUTTON
        // =================================================

        const aiButton =
            document.getElementById(
                "generateAISummaryBtn"
            );


        if (aiButton) {

            aiButton.addEventListener(
                "click",
                function () {

                    generateAISummary(
                        patient
                    );

                }
            );
        }
    }


    // =====================================================
    // GENERATE AI CASE SUMMARY
    // =====================================================

    async function generateAISummary(patient) {

        const button =
            document.getElementById(
                "generateAISummaryBtn"
            );

        const content =
            document.getElementById(
                "aiSummaryContent"
            );


        if (!button || !content) {
            return;
        }


        // -----------------------------------------
        // LOADING STATE
        // -----------------------------------------

        button.disabled = true;

        button.innerHTML = `

            <span class="ai-spinner"></span>

            Generating Summary...

        `;


        content.innerHTML = `

            <div class="ai-loading">

                <div class="ai-loading-animation">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                <h4>
                    AI is analyzing the case
                </h4>


                <p>
                    Organizing the patient's information
                    into a structured summary...
                </p>

            </div>

        `;


        // -----------------------------------------
        // PREPARE PATIENT DATA
        // -----------------------------------------

        const aiPatientData = {

            patientName:
                patient.patientName || "",

            age:
                patient.age || "",

            gender:
                patient.gender || "",

            occupation:
                patient.occupation || "",

            mainComplaint:
                patient.mainComplaint || "",

            complaintDuration:
                patient.complaintDuration || "",

            complaintDurationUnit:
                patient.complaintDurationUnit || "",

            severity:
                patient.severity || "",

            symptoms:
                patient.symptoms || [],

            waterIntake:
                patient.waterIntake || "",

            physicalActivity:
                patient.physicalActivity || "",

            stressLevel:
                patient.stressLevel || "",

            bodyType:
                patient.bodyType || "",

            appetite:
                patient.appetite || "",

            digestiveProblem:
                patient.digestiveProblem || "",

            digestiveType:
                patient.digestiveType || "",

            digestiveSeverity:
                patient.digestiveSeverity || "",

            respiratoryProblem:
                patient.respiratoryProblem || "",

            respiratoryType:
                patient.respiratoryType || "",

            respiratoryDuration:
                patient.respiratoryDuration || "",

            sleepProblem:
                patient.sleepProblem || "",

            sleepType:
                patient.sleepType || "",

            sleepHours:
                patient.sleepHours || "",

            notes:
                patient.notes || ""
        };


        // -----------------------------------------
        // SEND TO BACKEND
        // -----------------------------------------

        try {

            const response =
                await fetch(
                    AI_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            patient:
                                aiPatientData
                        })
                    }
                );


            // -----------------------------------------
            // CHECK RESPONSE
            // -----------------------------------------

            if (!response.ok) {

                let errorMessage =
                    "Unable to generate AI summary.";

                try {

                    const errorData =
                        await response.json();

                    if (
                        errorData &&
                        errorData.error
                    ) {

                        errorMessage =
                            errorData.error;
                    }

                } catch (error) {
                    // Ignore JSON parsing error
                }

                throw new Error(
                    errorMessage
                );
            }


            const data =
                await response.json();


            // -----------------------------------------
            // GET SUMMARY
            // -----------------------------------------

            const summary =
                data.summary ||
                data.output_text ||
                data.text ||
                "";


            if (!summary) {

                throw new Error(
                    "The AI returned an empty summary."
                );
            }


            // -----------------------------------------
            // DISPLAY SUMMARY
            // -----------------------------------------

            displayAISummary(
                summary
            );


        } catch (error) {

            console.error(
                "AI Summary Error:",
                error
            );


            content.innerHTML = `

                <div class="ai-error">

                    <div class="ai-error-icon">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>


                    <div>

                        <h4>
                            Could not generate summary
                        </h4>


                        <p>
                            ${escapeHTML(
                                error.message ||
                                "Something went wrong."
                            )}
                        </p>


                        <small>
                            Make sure the AI backend is connected
                            and available.
                        </small>

                    </div>

                </div>

            `;

        } finally {

            button.disabled = false;

            button.innerHTML = `

                <i class="fa-solid fa-wand-magic-sparkles"></i>

                Generate AI Summary

            `;
        }
    }


    // =====================================================
    // DISPLAY AI SUMMARY
    // =====================================================

    function displayAISummary(summary) {

        const content =
            document.getElementById(
                "aiSummaryContent"
            );


        if (!content) {
            return;
        }


        /*
            The backend can return plain text.

            This function converts simple headings
            into a cleaner display.
        */


        const formatted =
            formatAISummary(
                summary
            );


        content.innerHTML = `

            <div class="ai-result">

                ${formatted}

            </div>

        `;
    }


    // =====================================================
    // FORMAT AI SUMMARY
    // =====================================================

    function formatAISummary(text) {

        const safeText =
            escapeHTML(text);


        const lines =
            safeText.split("\n");


        let html = "";

        let insideList = false;


        lines.forEach(
            function (line) {

                const trimmed =
                    line.trim();


                if (!trimmed) {

                    if (insideList) {

                        html += "</ul>";

                        insideList = false;
                    }

                    return;
                }


                // -----------------------------------------
                // HEADINGS
                // -----------------------------------------

                if (
                    /^#{1,3}\s+/.test(
                        trimmed
                    )
                ) {

                    if (insideList) {

                        html += "</ul>";

                        insideList = false;
                    }


                    const heading =
                        trimmed.replace(
                            /^#{1,3}\s+/,
                            ""
                        );


                    html += `

                        <h4 class="ai-result-heading">

                            ${heading}

                        </h4>

                    `;

                    return;
                }


                // -----------------------------------------
                // BOLD STYLE HEADINGS
                // -----------------------------------------

                if (
                    /^[A-Z][A-Za-z\s&-]{2,40}:$/.test(
                        trimmed
                    )
                ) {

                    if (insideList) {

                        html += "</ul>";

                        insideList = false;
                    }


                    const heading =
                        trimmed.slice(
                            0,
                            -1
                        );


                    html += `

                        <h4 class="ai-result-heading">

                            ${heading}

                        </h4>

                    `;

                    return;
                }


                // -----------------------------------------
                // BULLET POINTS
                // -----------------------------------------

                if (
                    /^[-*•]\s+/.test(
                        trimmed
                    )
                ) {

                    if (!insideList) {

                        html +=
                            "<ul class='ai-result-list>";

                        insideList = true;
                    }


                    const bullet =
                        trimmed.replace(
                            /^[-*•]\s+/,
                            ""
                        );


                    html += `

                        <li>
                            ${bullet}
                        </li>

                    `;

                    return;
                }


                // -----------------------------------------
                // NORMAL TEXT
                // -----------------------------------------

                if (insideList) {

                    html += "</ul>";

                    insideList = false;
                }


                html += `

                    <p class="ai-result-paragraph">

                        ${trimmed}

                    </p>

                `;
            }
        );


        if (insideList) {

            html += "</ul>";
        }


        return html;
    }


    // =====================================================
    // DETAIL ITEM
    // =====================================================

    function detailItem(label, value) {

        return `

            <div class="detail-item">

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>

                    ${escapeHTML(
                        value || "Not provided"
                    )}

                </strong>

            </div>

        `;
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        return String(
            value || ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    // =====================================================
    // PATIENTS BUTTON
    // =====================================================

    if (patientsLink) {

        patientsLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showPatientsPage();

            }
        );
    }


    // =====================================================
    // NEW CASE BUTTON
    // =====================================================

    if (newCaseLink) {

        newCaseLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showNewCase();

            }
        );
    }


});