document.addEventListener("DOMContentLoaded", function () {

    const patientForm = document.getElementById("patientForm");
    const saveDraftBtn = document.getElementById("saveDraftBtn");

    const STORAGE_KEY = "medicasePatients";


    // =====================================================
    // SMART QUESTIONS
    // =====================================================

    function setupSmartQuestion(radioName, questionBox) {

        const options = document.querySelectorAll(
            `input[name="${radioName}"]`
        );

        options.forEach(function (option) {

            option.addEventListener("change", function () {

                if (this.value === "yes") {
                    questionBox.style.display = "grid";
                } else {
                    questionBox.style.display = "none";
                }

            });

        });
    }


    const digestiveQuestions =
        document.getElementById("digestiveQuestions");

    const respiratoryQuestions =
        document.getElementById("respiratoryQuestions");

    const sleepQuestions =
        document.getElementById("sleepQuestions");


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
            localStorage.getItem(STORAGE_KEY);

        if (!savedPatients) {
            return [];
        }

        try {
            return JSON.parse(savedPatients);
        } catch (error) {
            return [];
        }
    }


    // =====================================================
    // SAVE PATIENT
    // =====================================================

    saveDraftBtn.addEventListener("click", function () {

        const formData = new FormData(patientForm);

        const patientData = {};


        formData.forEach(function (value, key) {

            if (key !== "symptoms") {
                patientData[key] = value;
            }

        });


        // SAVE MULTIPLE SYMPTOMS

        patientData.symptoms = [];

        const selectedSymptoms =
            document.querySelectorAll(
                'input[name="symptoms"]:checked'
            );

        selectedSymptoms.forEach(function (checkbox) {

            patientData.symptoms.push(
                checkbox.value
            );

        });


        // SMART QUESTIONS

        patientData.digestiveProblem =
            document.querySelector(
                'input[name="digestiveProblem"]:checked'
            )?.value || "";

        patientData.digestiveType =
            document.getElementById("digestiveType")?.value || "";

        patientData.digestiveSeverity =
            document.getElementById("digestiveSeverity")?.value || "";


        patientData.respiratoryProblem =
            document.querySelector(
                'input[name="respiratoryProblem"]:checked'
            )?.value || "";

        patientData.respiratoryType =
            document.getElementById("respiratoryType")?.value || "";

        patientData.respiratoryDuration =
            document.getElementById("respiratoryDuration")?.value || "";


        patientData.sleepProblem =
            document.querySelector(
                'input[name="sleepProblem"]:checked'
            )?.value || "";

        patientData.sleepType =
            document.getElementById("sleepType")?.value || "";

        patientData.sleepHours =
            document.getElementById("sleepHours")?.value || "";


        // PATIENT ID + DATE

        patientData.id =
            Date.now().toString();

        patientData.savedAt =
            new Date().toLocaleString();


        // ADD PATIENT

        const patients = getPatients();

        patients.push(patientData);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(patients)
        );


        alert(
            "Patient information saved successfully!"
        );

    });


    // =====================================================
    // PATIENTS NAVIGATION
    // =====================================================

    const navLinks =
        document.querySelectorAll(".sidebar nav a");

    let patientsLink = null;
    let newCaseLink = null;

    navLinks.forEach(function (link) {

        const text =
            link.innerText.trim();

        if (text === "Patients") {
            patientsLink = link;
        }

        if (text === "New Case") {
            newCaseLink = link;
        }

    });


    // =====================================================
    // SHOW PATIENTS PAGE
    // =====================================================

    function showPatientsPage() {

        const form =
            document.getElementById("patientForm");

        const topbar =
            document.querySelector(".topbar");

        const progress =
            document.querySelector(".progress-container");

        const cards =
            document.querySelectorAll(".card");

        const formActions =
            document.querySelector(".form-actions");


        form.style.display = "none";


        if (progress) {
            progress.style.display = "none";
        }


        cards.forEach(function (card) {
            card.style.display = "none";
        });


        if (formActions) {
            formActions.style.display = "none";
        }


        topbar.innerHTML = `
            <div>
                <h1>Patients</h1>
                <p>View and manage saved patient records</p>
            </div>

            <button
                id="newPatientBtn"
                class="submit-btn"
                type="button">

                <i class="fa-solid fa-plus"></i>
                New Patient

            </button>
        `;


        let patientsPage =
            document.getElementById("patientsPage");


        if (!patientsPage) {

            patientsPage =
                document.createElement("section");

            patientsPage.id =
                "patientsPage";

            patientsPage.className =
                "patients-page";

            form.parentNode.insertBefore(
                patientsPage,
                form
            );

        }


        patientsPage.style.display = "block";


        renderPatients();


        document
            .getElementById("newPatientBtn")
            .addEventListener(
                "click",
                showNewCase
            );

    }


    // =====================================================
    // SHOW NEW CASE
    // =====================================================

    function showNewCase() {

        const form =
            document.getElementById("patientForm");

        const progress =
            document.querySelector(".progress-container");

        const cards =
            document.querySelectorAll(".card");

        const formActions =
            document.querySelector(".form-actions");

        const patientsPage =
            document.getElementById("patientsPage");

        const topbar =
            document.querySelector(".topbar");


        // ================================================
        // CLEAR OLD PATIENT INFORMATION
        // ================================================

        form.reset();


        // Hide smart question boxes

        if (digestiveQuestions) {
            digestiveQuestions.style.display = "none";
        }

        if (respiratoryQuestions) {
            respiratoryQuestions.style.display = "none";
        }

        if (sleepQuestions) {
            sleepQuestions.style.display = "none";
        }


        // Hide Patients page

        if (patientsPage) {
            patientsPage.style.display = "none";
        }


        // Show form

        form.style.display = "block";


        if (progress) {
            progress.style.display = "flex";
        }


        cards.forEach(function (card) {
            card.style.display = "block";
        });


        if (formActions) {
            formActions.style.display = "flex";
        }


        // Restore topbar

        topbar.innerHTML = `
            <div>
                <h1>New Patient Case</h1>
                <p>Complete the patient's clinical information</p>
            </div>

            <div class="doctor">

                <div class="doctor-icon">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div>
                    <strong>Practitioner</strong>
                    <span>Ayurveda Clinic</span>
                </div>

            </div>
        `;

    }


    // =====================================================
    // RENDER PATIENTS
    // =====================================================

    function renderPatients() {

        const patientsPage =
            document.getElementById("patientsPage");

        const patients =
            getPatients();


        if (patients.length === 0) {

            patientsPage.innerHTML = `

                <div class="empty-patients">

                    <div class="empty-icon">
                        <i class="fa-solid fa-users"></i>
                    </div>

                    <h2>No Patients Yet</h2>

                    <p>
                        Saved patient records will appear here.
                    </p>

                </div>

            `;

            return;
        }


        let html = `

            <div class="patients-header">

                <div>
                    <h2>Patient Records</h2>

                    <p>
                        ${patients.length}
                        patient${patients.length === 1 ? "" : "s"}
                        saved
                    </p>
                </div>

            </div>

            <div class="patient-list">
        `;


        patients.slice().reverse().forEach(
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
                                ${escapeHTML(age)} years
                            </p>

                        </div>

                        <div class="patient-complaint">

                            <span>Main Complaint</span>

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
                                data-id="${patient.id}">

                                <i class="fa-solid fa-eye"></i>
                                View

                            </button>

                            <button
                                class="delete-patient"
                                data-id="${patient.id}">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </div>

                `;

            }
        );


        html += `</div>`;

        patientsPage.innerHTML = html;


        // VIEW BUTTONS

        document
            .querySelectorAll(".view-patient")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const patient =
                            patients.find(
                                function (p) {
                                    return p.id ===
                                        this.dataset.id;
                                }.bind(this)
                            );

                        if (patient) {
                            showPatientDetails(patient);
                        }

                    }
                );

            });


        // DELETE BUTTONS

        document
            .querySelectorAll(".delete-patient")
            .forEach(function (button) {

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
                                    return patient.id !== id;
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

            });

    }


    // =====================================================
    // PATIENT DETAILS
    // =====================================================

    function showPatientDetails(patient) {

        const patientsPage =
            document.getElementById("patientsPage");


        patientsPage.innerHTML = `

            <div class="patient-detail">

                <button
                    id="backToPatients"
                    class="back-btn">

                    <i class="fa-solid fa-arrow-left"></i>
                    Back to Patients

                </button>


                <div class="detail-card">

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
                                ? patient.waterIntake + " glasses/day"
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


                    <div class="detail-section">

                        <h3>Symptoms</h3>

                        <p>
                            ${
                                patient.symptoms &&
                                patient.symptoms.length
                                    ? patient.symptoms.join(", ")
                                    : "No symptoms selected"
                            }
                        </p>

                    </div>


                    <div class="detail-section">

                        <h3>Practitioner Notes</h3>

                        <p>
                            ${
                                escapeHTML(
                                    patient.notes ||
                                    "No notes added"
                                )
                            }
                        </p>

                    </div>


                    <div class="saved-time">

                        Saved:
                        ${escapeHTML(
                            patient.savedAt || ""
                        )}

                    </div>

                </div>

            </div>

        `;


        document
            .getElementById("backToPatients")
            .addEventListener(
                "click",
                renderPatients
            );

    }


    // =====================================================
    // DETAIL ITEM
    // =====================================================

    function detailItem(label, value) {

        return `

            <div class="detail-item">

                <span>${label}</span>

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

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

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