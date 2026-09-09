document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // DOCTOR LOGIN SYSTEM
    // =====================================================

    const CURRENT_DOCTOR_KEY = "medicaseCurrentDoctor";

    const DEMO_DOCTOR = {
        id: "DOC001",
        email: "doctor@medicase.com",
        password: "123456",
        name: "Dr. Ananya Sharma",
        specialization: "Ayurvedic Physician",
        clinic: "MediCase Clinic"
    };


    // =====================================================
    // LOGIN ELEMENTS
    // =====================================================

    const loginScreen =
        document.getElementById("loginScreen");

    const app =
        document.getElementById("app");

    const loginForm =
        document.getElementById("loginForm");

    const loginError =
        document.getElementById("loginError");


    // =====================================================
    // DOCTOR SESSION
    // =====================================================

    function getCurrentDoctor() {

        const savedDoctor =
            sessionStorage.getItem(CURRENT_DOCTOR_KEY);

        if (!savedDoctor) {
            return null;
        }

        try {

            return JSON.parse(savedDoctor);

        } catch (error) {

            console.error(
                "Error reading doctor session:",
                error
            );

            sessionStorage.removeItem(
                CURRENT_DOCTOR_KEY
            );

            return null;
        }
    }


    function setCurrentDoctor(doctor) {

        const safeDoctor = {
            id: doctor.id,
            email: doctor.email,
            name: doctor.name,
            specialization: doctor.specialization,
            clinic: doctor.clinic
        };

        sessionStorage.setItem(
            CURRENT_DOCTOR_KEY,
            JSON.stringify(safeDoctor)
        );
    }


    function logoutDoctor() {

        sessionStorage.removeItem(
            CURRENT_DOCTOR_KEY
        );

        window.location.reload();
    }


    // =====================================================
    // DOCTOR HEADER HTML
    // =====================================================

    function getDoctorHeaderHTML() {

        const doctor =
            getCurrentDoctor();

        if (!doctor) {
            return `
                <div class="doctor">
                    <div class="doctor-icon">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>

                    <div>
                        <strong>Doctor</strong>
                        <span>Specialization • Clinic</span>
                    </div>
                </div>
            `;
        }


        return `
            <div class="doctor">

                <div class="doctor-icon">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div>
                    <strong>
                        ${escapeHTML(doctor.name)}
                    </strong>

                    <span>
                        ${escapeHTML(doctor.specialization)}
                        •
                        ${escapeHTML(doctor.clinic)}
                    </span>
                </div>

            </div>
        `;
    }


    // =====================================================
    // SHOW / HIDE LOGIN AND APP
    // =====================================================

    function updateLoginState() {

        const doctor =
            getCurrentDoctor();


        if (doctor) {

            if (loginScreen) {
                loginScreen.style.display = "none";
            }

            if (app) {
                app.style.display = "flex";
            }

        } else {

            if (loginScreen) {
                loginScreen.style.display = "flex";
            }

            if (app) {
                app.style.display = "none";
            }
        }
    }


    // =====================================================
    // LOGIN
    // =====================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const doctorIdInput =
                    document.getElementById("doctorId");

                const doctorEmailInput =
                    document.getElementById("doctorEmail");

                const doctorPasswordInput =
                    document.getElementById("doctorPassword");


                const doctorId =
                    doctorIdInput
                        ? doctorIdInput.value.trim()
                        : "";

                const doctorEmail =
                    doctorEmailInput
                        ? doctorEmailInput.value.trim()
                        : "";

                const password =
                    doctorPasswordInput
                        ? doctorPasswordInput.value
                        : "";


                if (
                    doctorId.toLowerCase() ===
                        DEMO_DOCTOR.id.toLowerCase() &&

                    doctorEmail.toLowerCase() ===
                        DEMO_DOCTOR.email.toLowerCase() &&

                    password ===
                        DEMO_DOCTOR.password
                ) {

                    setCurrentDoctor(
                        DEMO_DOCTOR
                    );


                    if (loginError) {
                        loginError.textContent = "";
                    }


                    updateLoginState();


                    // Start on New Case
                    showNewCase();

                } else {

                    if (loginError) {

                        loginError.textContent =
                            "Invalid Doctor ID, email or password.";
                    }
                }
            }
        );
    }


    // =====================================================
    // INITIAL LOGIN CHECK
    // =====================================================

    updateLoginState();


    // =====================================================
    // MEDICASE CONFIGURATION
    // =====================================================

    const AI_API_URL =
        "https://medi-backend-six.vercel.app/api/summarize";


    const patientForm =
        document.getElementById("patientForm");


    const saveDraftBtn =
        document.getElementById("saveDraftBtn");


    const STORAGE_KEY =
        "medicasePatients";
            // =====================================================
    // DASHBOARD
    // =====================================================

    const dashboardLink =
        document.getElementById("dashboardLink");

    const dashboardPage =
        document.getElementById("dashboardPage");

    const dashboardPatientsBtn =
        document.getElementById("dashboardPatientsBtn");

    const dashboardNewCaseBtn =
        document.getElementById("dashboardNewCaseBtn");

    const dashboardViewPatientsBtn =
        document.getElementById("dashboardViewPatientsBtn");


    // SHOW DASHBOARD

    function showDashboard() {

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

        const patientsPage =
            document.getElementById("patientsPage");


        // Hide patient form

        if (form) {
            form.style.display = "none";
        }


        if (progress) {
            progress.style.display = "none";
        }


        cards.forEach(function (card) {
            card.style.display = "none";
        });


        if (formActions) {
            formActions.style.display = "none";
        }


        if (patientsPage) {
            patientsPage.style.display = "none";
        }


        // Show dashboard

        if (dashboardPage) {
            dashboardPage.style.display = "block";
        }


        // Dashboard topbar

        if (topbar) {

            topbar.innerHTML = `
                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Overview of your MediCase activity
                    </p>

                </div>

                <div class="doctor">

                    <div class="doctor-icon">

                        <i class="fa-solid fa-user-doctor"></i>

                    </div>

                    <div>

                        <strong id="dashboardTopDoctor">
                            Doctor
                        </strong>

                        <span id="dashboardTopDoctorDetails">
                            Medical Practitioner
                        </span>

                    </div>

                </div>
            `;

        }


        updateDashboard();

        setDashboardDoctor();

    }

    document
        .querySelectorAll(".sidebar nav a")
        .forEach(function (link) {

            link.classList.remove("active");

        });


    if (dashboardLink) {
        dashboardLink.classList.add("active");
    }
    // UPDATE DASHBOARD DATA

    function updateDashboard() {

        const patients =
            getPatients();


        const totalPatients =
            document.getElementById("totalPatients");

        const totalCases =
            document.getElementById("totalCases");

        const todayCases =
            document.getElementById("todayCases");


        if (totalPatients) {
            totalPatients.textContent =
                patients.length;
        }


        if (totalCases) {
            totalCases.textContent =
                patients.length;
        }


        // TODAY'S CASES

        const today =
            new Date().toLocaleDateString();


        const todayCount =
            patients.filter(function (patient) {

                if (!patient.savedAt) {
                    return false;
                }

                return patient.savedAt
                    .startsWith(today);

            }).length;


        if (todayCases) {
            todayCases.textContent =
                todayCount;
        }


        renderRecentPatients();

        updateDashboardDate();

    }


    // RECENT PATIENTS

    function renderRecentPatients() {

        const container =
            document.getElementById("recentPatients");


        if (!container) {
            return;
        }


        const patients =
            getPatients()
                .slice()
                .reverse()
                .slice(0, 5);


        if (patients.length === 0) {

            container.innerHTML = `

                <div class="dashboard-empty">

                    <i class="fa-solid fa-user-group"></i>

                    <p>
                        No patient records yet.
                    </p>

                    <span>
                        Add your first patient to see them here.
                    </span>

                </div>

            `;

            return;
        }


        let html = "";


        patients.forEach(function (patient) {

            const name =
                patient.patientName ||
                "Unnamed Patient";


            const age =
                patient.age ||
                "—";


            const gender =
                patient.gender ||
                "—";


            html += `

                <div class="dashboard-patient">

                    <div class="dashboard-patient-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>


                    <div class="dashboard-patient-info">

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <span>
                            ${escapeHTML(gender)}
                            •
                            ${escapeHTML(age)} years
                        </span>

                    </div>


                    <div class="dashboard-patient-date">

                        ${escapeHTML(
                            patient.savedAt || ""
                        )}

                    </div>

                </div>

            `;

        });


        container.innerHTML =
            html;

    }


    // DASHBOARD DATE

    function updateDashboardDate() {

        const dateElement =
            document.getElementById("dashboardDate");


        if (!dateElement) {
            return;
        }


        const today =
            new Date();


        dateElement.textContent =
            today.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

    }


    // DOCTOR INFORMATION

    function setDashboardDoctor() {

        let doctor = null;


        try {

            const savedDoctor =
                sessionStorage.getItem(
                    "medicaseCurrentDoctor"
                );


            if (savedDoctor) {

                doctor =
                    JSON.parse(savedDoctor);

            }

        } catch (error) {

            doctor = null;

        }


        if (!doctor) {

            return;

        }


        const greeting =
            document.getElementById(
                "dashboardGreeting"
            );


        const doctorName =
            document.getElementById(
                "dashboardDoctorName"
            );


        const specialization =
            document.getElementById(
                "dashboardDoctorSpecialization"
            );


        const doctorId =
            document.getElementById(
                "dashboardDoctorId"
            );


        const email =
            document.getElementById(
                "dashboardDoctorEmail"
            );


        const clinic =
            document.getElementById(
                "dashboardDoctorClinic"
            );


        const topDoctor =
            document.getElementById(
                "dashboardTopDoctor"
            );


        const topDoctorDetails =
            document.getElementById(
                "dashboardTopDoctorDetails"
            );


        if (greeting) {
            greeting.textContent =
                "Welcome, " +
                (doctor.name || "Doctor");
        }


        if (doctorName) {
            doctorName.textContent =
                doctor.name || "Doctor";
        }


        if (specialization) {
            specialization.textContent =
                doctor.specialization ||
                "Medical Practitioner";
        }


        if (doctorId) {
            doctorId.textContent =
                doctor.id || "—";
        }


        if (email) {
            email.textContent =
                doctor.email || "—";
        }


        if (clinic) {
            clinic.textContent =
                doctor.clinic || "—";
        }


        if (topDoctor) {
            topDoctor.textContent =
                doctor.name || "Doctor";
        }


        if (topDoctorDetails) {

            topDoctorDetails.textContent =
                (doctor.specialization || "Medical Practitioner")
                +
                " • "
                +
                (doctor.clinic || "Clinic");

        }

    }


    // =====================================================
    // STOP IF FORM DOES NOT EXIST
    // =====================================================

    if (!patientForm) {

        console.error(
            "MediCase patient form was not found."
        );

        return;
    }


    // =====================================================
    // SMART QUESTION SETUP
    // =====================================================

    function setupSmartQuestion(
        radioName,
        questionsId
    ) {

        const options =
            document.querySelectorAll(
                `input[name="${radioName}"]`
            );


        const questions =
            document.getElementById(
                questionsId
            );


        if (!options.length || !questions) {
            return;
        }


        options.forEach(function (option) {

            option.addEventListener(
                "change",
                function () {

                    if (this.value === "yes") {

                        questions.style.display =
                            "block";

                    } else {

                        questions.style.display =
                            "none";
                    }
                }
            );
        });
    }


    setupSmartQuestion(
        "digestiveProblem",
        "digestiveQuestions"
    );


    setupSmartQuestion(
        "respiratoryProblem",
        "respiratoryQuestions"
    );


    setupSmartQuestion(
        "sleepProblem",
        "sleepQuestions"
    );


    // =====================================================
    // GET PATIENTS
    // =====================================================

    function getPatients() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            ) || [];

        } catch (error) {

            console.error(
                "Error reading patients:",
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
                    new FormData(patientForm);


                const patientData = {};


                formData.forEach(
                    function (value, key) {

                        if (key !== "symptoms") {

                            patientData[key] =
                                value;
                        }
                    }
                );


                // =================================================
                // COLLECT SYMPTOMS
                // =================================================

                const symptoms =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="symptoms"]:checked'
                        )
                    ).map(function (checkbox) {

                        return checkbox.value;
                    });


                patientData.symptoms =
                    symptoms;


                // =================================================
                // SMART QUESTIONS
                // =================================================

                const digestiveProblem =
                    document.querySelector(
                        'input[name="digestiveProblem"]:checked'
                    );

                const respiratoryProblem =
                    document.querySelector(
                        'input[name="respiratoryProblem"]:checked'
                    );

                const sleepProblem =
                    document.querySelector(
                        'input[name="sleepProblem"]:checked'
                    );


                patientData.digestiveProblem =
                    digestiveProblem
                        ? digestiveProblem.value
                        : "";


                patientData.respiratoryProblem =
                    respiratoryProblem
                        ? respiratoryProblem.value
                        : "";


                patientData.sleepProblem =
                    sleepProblem
                        ? sleepProblem.value
                        : "";


                // =================================================
                // PATIENT ID
                // =================================================

                patientData.id =
                    Date.now().toString();


                patientData.savedAt =
                    new Date().toLocaleString();


                // =================================================
                // ADD LOGGED-IN DOCTOR
                // =================================================

                const doctor =
                    getCurrentDoctor();


                if (doctor) {

                    patientData.doctorId =
                        doctor.id;

                    patientData.doctorName =
                        doctor.name;

                    patientData.doctorEmail =
                        doctor.email;

                    patientData.doctorSpecialization =
                        doctor.specialization;

                    patientData.doctorClinic =
                        doctor.clinic;
                }


                // =================================================
                // SAVE
                // =================================================

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
                    "Patient case saved successfully!"
                );
            }
        );
    }


    // =====================================================
    // NAVIGATION
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

                patientsLink =
                    link;
            }


            if (text === "New Case") {

                newCaseLink =
                    link;
            }
        }
    );


    // =====================================================
    // LOGOUT BUTTON
    // =====================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (confirmed) {

                    logoutDoctor();
                }
            }
        );
    }


    // =====================================================
    // SHOW PATIENTS PAGE
    // =====================================================

    function showPatientsPage() {

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
                ".form-card"
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


        cards.forEach(function (card) {

            card.style.display = "none";
        });


        if (formActions) {
            formActions.style.display = "none";
        }


        let patientsPage =
            document.getElementById(
                "patientsPage"
            );


        if (!patientsPage) {

            patientsPage =
                document.createElement(
                    "div"
                );

            patientsPage.id =
                "patientsPage";

            patientsPage.className =
                "patients-page";

            document
                .querySelector(".main")
                .appendChild(
                    patientsPage
                );
        }


        patientsPage.style.display =
            "block";


        const topbar =
            document.querySelector(
                ".topbar"
            );


        if (topbar) {

            topbar.innerHTML = `

                <div>

                    <h1>
                        Patients
                    </h1>

                    <p>
                        View and manage saved patient cases
                    </p>

                </div>

                ${getDoctorHeaderHTML()}

            `;
        }


        renderPatients();
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
                ".form-card"
            );


        const formActions =
            document.querySelector(
                ".form-actions"
            );


        const patientsPage =
            document.getElementById(
                "patientsPage"
            );
            const dashboardPage =
    document.getElementById("dashboardPage");

        document
        .querySelectorAll(".sidebar nav a")
        .forEach(function (link) {

            link.classList.remove("active");

        });


    if (newCaseLink) {
        newCaseLink.classList.add("active");
    }


        // =================================================
        // RESET FORM
        // =================================================

        if (form) {

            form.reset();
        }


        // =================================================
        // HIDE SMART QUESTIONS
        // =================================================

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


        // =================================================
        // SHOW FORM
        // =================================================

        if (form) {
            form.style.display = "block";
        }


        if (progress) {
            progress.style.display = "flex";
        }


        cards.forEach(function (card) {

            card.style.display = "block";
        });


        if (formActions) {
            formActions.style.display = "flex";
        }


        if (patientsPage) {

            patientsPage.style.display =
                "none";
        }
        if (dashboardPage) {
    dashboardPage.style.display = "none";
}


        // =================================================
        // TOPBAR
        // =================================================

        const topbar =
            document.querySelector(
                ".topbar"
            );


        if (topbar) {

            topbar.innerHTML = `

                <div>

                    <h1>
                        New Patient Case
                    </h1>

                    <p>
                        Complete the patient's clinical information
                    </p>

                </div>

                ${getDoctorHeaderHTML()}

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


        // =================================================
        // EMPTY STATE
        // =================================================

        if (patients.length === 0) {

            patientsPage.innerHTML = `

                <div class="empty-patients">

                    <div class="empty-icon">

                        <i class="fa-solid fa-user-group"></i>

                    </div>

                    <h2>
                        No Patients Yet
                    </h2>

                    <p>
                        Saved patient cases will appear here.
                    </p>

                    <button
                        class="new-patient-btn"
                        id="emptyNewPatientBtn">

                        <i class="fa-solid fa-plus"></i>

                        New Patient

                    </button>

                </div>

            `;


            const emptyButton =
                document.getElementById(
                    "emptyNewPatientBtn"
                );


            if (emptyButton) {

                emptyButton.addEventListener(
                    "click",
                    showNewCase
                );
            }


            return;
        }


        // =================================================
        // PATIENT LIST
        // =================================================

        let html = `

            <div class="patients-header">

                <div>

                    <h2>
                        Saved Patients
                    </h2>

                    <p>
                        ${patients.length}
                        patient case${patients.length !== 1 ? "s" : ""}
                    </p>

                </div>

                <button
                    class="new-patient-btn"
                    id="patientsNewPatientBtn">

                    <i class="fa-solid fa-plus"></i>

                    New Patient

                </button>

            </div>


            <div class="patients-list">

        `;


        patients
            .slice()
            .reverse()
            .forEach(function (patient) {

                html += `

                    <div
                        class="patient-row"
                        data-id="${escapeHTML(patient.id)}">

                        <div class="patient-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>


                        <div class="patient-info">

                            <strong>
                                ${escapeHTML(
                                    patient.patientName ||
                                    "Unnamed Patient"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    patient.mainComplaint ||
                                    "No complaint entered"
                                )}
                            </span>

                        </div>


                        <div class="patient-meta">

                            <span>
                                <strong>Age:</strong>
                                ${escapeHTML(
                                    patient.age || "-"
                                )}
                            </span>

                            <span>
                                <strong>Gender:</strong>
                                ${escapeHTML(
                                    patient.gender || "-"
                                )}
                            </span>

                        </div>


                        <div class="patient-phone">

                            <i class="fa-solid fa-phone"></i>

                            ${escapeHTML(
                                patient.phone || "-"
                            )}

                        </div>


                        <div class="patient-date">

                            ${escapeHTML(
                                patient.savedAt || ""
                            )}

                        </div>


                        <div class="patient-actions">

                            <button
                                class="view-patient-btn"
                                data-id="${escapeHTML(patient.id)}">

                                <i class="fa-solid fa-eye"></i>

                                View

                            </button>


                            <button
                                class="delete-patient-btn"
                                data-id="${escapeHTML(patient.id)}">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </div>

                `;
            });


        html += `
            </div>
        `;


        patientsPage.innerHTML =
            html;


        // =================================================
        // NEW PATIENT BUTTON
        // =================================================

        const newPatientBtn =
            document.getElementById(
                "patientsNewPatientBtn"
            );


        if (newPatientBtn) {

            newPatientBtn.addEventListener(
                "click",
                showNewCase
            );
        }


        // =================================================
        // VIEW BUTTONS
        // =================================================

        document
            .querySelectorAll(
                ".view-patient-btn"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const patientId =
                            this.dataset.id;


                        const patient =
                            getPatients().find(
                                function (item) {

                                    return item.id ===
                                        patientId;
                                }
                            );


                        if (patient) {

                            showPatientDetails(
                                patient
                            );
                        }
                    }
                );
            });


        // =================================================
        // DELETE BUTTONS
        // =================================================

        document
            .querySelectorAll(
                ".delete-patient-btn"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const patientId =
                            this.dataset.id;


                        const confirmed =
                            confirm(
                                "Delete this patient record?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        const updatedPatients =
                            getPatients().filter(
                                function (patient) {

                                    return patient.id !==
                                        patientId;
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
            document.getElementById(
                "patientsPage"
            );


        if (!patientsPage) {
            return;
        }


        patientsPage.style.display =
            "block";


        const topbar =
            document.querySelector(
                ".topbar"
            );


        if (topbar) {

            topbar.innerHTML = `

                <div>

                    <h1>
                        Patient Details
                    </h1>

                    <p>
                        Complete clinical case information
                    </p>

                </div>

                ${getDoctorHeaderHTML()}

            `;
        }


        const symptoms =
            Array.isArray(patient.symptoms)
                ? patient.symptoms
                : [];


        const smartQuestions = [];


        if (patient.digestiveProblem) {

            smartQuestions.push(
                detailItem(
                    "Digestive Problem",
                    patient.digestiveProblem
                )
            );
        }


        if (patient.digestiveType) {

            smartQuestions.push(
                detailItem(
                    "Digestive Type",
                    patient.digestiveType
                )
            );
        }


        if (patient.digestiveSeverity) {

            smartQuestions.push(
                detailItem(
                    "Digestive Severity",
                    patient.digestiveSeverity
                )
            );
        }


        if (patient.respiratoryProblem) {

            smartQuestions.push(
                detailItem(
                    "Respiratory Problem",
                    patient.respiratoryProblem
                )
            );
        }


        if (patient.respiratoryType) {

            smartQuestions.push(
                detailItem(
                    "Respiratory Type",
                    patient.respiratoryType
                )
            );
        }


        if (patient.respiratoryDuration) {

            smartQuestions.push(
                detailItem(
                    "Respiratory Duration",
                    patient.respiratoryDuration
                )
            );
        }


        if (patient.sleepProblem) {

            smartQuestions.push(
                detailItem(
                    "Sleep Problem",
                    patient.sleepProblem
                )
            );
        }


        if (patient.sleepType) {

            smartQuestions.push(
                detailItem(
                    "Sleep Type",
                    patient.sleepType
                )
            );
        }


        if (patient.sleepHours) {

            smartQuestions.push(
                detailItem(
                    "Sleep Hours",
                    patient.sleepHours
                )
            );
        }


        // =================================================
        // DOCTOR INFORMATION
        // =================================================

        const doctorName =
            patient.doctorName ||
            getCurrentDoctor()?.name ||
            "-";


        const doctorId =
            patient.doctorId ||
            getCurrentDoctor()?.id ||
            "-";


        const doctorSpecialization =
            patient.doctorSpecialization ||
            getCurrentDoctor()?.specialization ||
            "-";


        const doctorClinic =
            patient.doctorClinic ||
            getCurrentDoctor()?.clinic ||
            "-";


        patientsPage.innerHTML = `

            <div class="patient-detail-page">

                <button
                    class="back-patients-btn"
                    id="backPatientsBtn">

                    <i class="fa-solid fa-arrow-left"></i>

                    Back to Patients

                </button>


                <div class="patient-detail-card">

                    <div class="patient-detail-header">

                        <div class="patient-detail-avatar">

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
                                Patient Case
                            </p>

                        </div>

                    </div>


                    <!-- PATIENT INFORMATION -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-user"></i>
                            Patient Information
                        </h3>


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
                                "Address",
                                patient.address
                            )}

                        </div>

                    </div>


                    <!-- COMPLAINT -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-notes-medical"></i>
                            Chief Complaint
                        </h3>


                        <div class="detail-grid">

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

                        </div>

                    </div>


                    <!-- SYMPTOMS -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-list-check"></i>
                            Symptoms
                        </h3>


                        <div class="symptoms-display">

                            ${
                                symptoms.length > 0
                                    ? symptoms
                                        .map(function (symptom) {

                                            return `
                                                <span class="symptom-tag">
                                                    ${escapeHTML(symptom)}
                                                </span>
                                            `;

                                        })
                                        .join("")
                                    : "<p>No symptoms selected.</p>"
                            }

                        </div>


                        ${
                            patient.otherSymptoms
                                ? `
                                    <div class="other-symptoms">

                                        <strong>
                                            Other Symptoms:
                                        </strong>

                                        <p>
                                            ${escapeHTML(
                                                patient.otherSymptoms
                                            )}
                                        </p>

                                    </div>
                                `
                                : ""
                        }

                    </div>


                    <!-- SMART QUESTIONS -->

                    ${
                        smartQuestions.length > 0
                            ? `
                                <div class="detail-section">

                                    <h3>
                                        <i class="fa-solid fa-circle-question"></i>
                                        Additional Assessment
                                    </h3>

                                    <div class="detail-grid">

                                        ${smartQuestions.join("")}

                                    </div>

                                </div>
                            `
                            : ""
                    }


                    <!-- LIFESTYLE -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-heart-pulse"></i>
                            Lifestyle
                        </h3>


                        <div class="detail-grid">

                            ${detailItem(
                                "Sleep",
                                patient.sleep
                            )}

                            ${detailItem(
                                "Water Intake",
                                patient.waterIntake
                            )}

                            ${detailItem(
                                "Physical Activity",
                                patient.physicalActivity
                            )}

                            ${detailItem(
                                "Stress Level",
                                patient.stressLevel
                            )}

                        </div>

                    </div>


                    <!-- AYURVEDIC ASSESSMENT -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-leaf"></i>
                            Ayurvedic Assessment
                        </h3>


                        <div class="detail-grid">

                            ${detailItem(
                                "Body Type",
                                patient.bodyType
                            )}

                            ${detailItem(
                                "Appetite",
                                patient.appetite
                            )}

                            ${detailItem(
                                "Sleep Quality",
                                patient.sleepQuality
                            )}

                        </div>

                    </div>


                    <!-- DOCTOR -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-user-doctor"></i>
                            Doctor Information
                        </h3>


                        <div class="detail-grid">

                            ${detailItem(
                                "Doctor",
                                doctorName
                            )}

                            ${detailItem(
                                "Doctor ID",
                                doctorId
                            )}

                            ${detailItem(
                                "Specialization",
                                doctorSpecialization
                            )}

                            ${detailItem(
                                "Clinic / Hospital",
                                doctorClinic
                            )}

                        </div>

                    </div>


                    <!-- NOTES -->

                    <div class="detail-section">

                        <h3>
                            <i class="fa-solid fa-pen"></i>
                            Practitioner Notes
                        </h3>


                        <div class="notes-display">

                            ${
                                patient.notes
                                    ? escapeHTML(
                                        patient.notes
                                    )
                                    : "No notes added."
                            }

                        </div>

                    </div>


                    <!-- AI SUMMARY -->

                    <div class="detail-section ai-section">

                        <h3>
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            AI Case Summary
                        </h3>


                        <button
                            id="generateAISummaryBtn"
                            class="ai-summary-btn">

                            <i class="fa-solid fa-sparkles"></i>

                            Generate AI Summary

                        </button>


                        <div
                            id="aiSummaryResult"
                            class="ai-summary-result">

                        </div>

                    </div>


                    <!-- SAVED TIME -->

                    <div class="saved-time">

                        <i class="fa-regular fa-clock"></i>

                        Saved:
                        ${escapeHTML(
                            patient.savedAt || "-"
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
                "backPatientsBtn"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    renderPatients();
                }
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
    // AI SUMMARY
    // =====================================================

    async function generateAISummary(patient) {

        const button =
            document.getElementById(
                "generateAISummaryBtn"
            );


        const result =
            document.getElementById(
                "aiSummaryResult"
            );


        if (!result) {
            return;
        }


        if (button) {

            button.disabled = true;

            button.innerHTML = `

                <i class="fa-solid fa-spinner fa-spin"></i>

                Generating Summary...

            `;
        }


        result.innerHTML = `

            <div class="ai-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    AI is analyzing the case...
                </p>

            </div>

        `;


        const aiPatientData = {

            name:
                patient.patientName || "",

            age:
                patient.age || "",

            gender:
                patient.gender || "",

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

            otherSymptoms:
                patient.otherSymptoms || "",

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

            sleep:
                patient.sleep || "",

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

            sleepQuality:
                patient.sleepQuality || "",

            notes:
                patient.notes || ""
        };


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


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );
            }


            const data =
                await response.json();


            const summary =
                data.summary ||
                data.output_text ||
                data.text ||
                "";


            if (!summary) {

                throw new Error(
                    "No summary was returned."
                );
            }


            displayAISummary(
                summary
            );


        } catch (error) {

            console.error(
                "AI Summary Error:",
                error
            );


            result.innerHTML = `

                <div class="ai-error">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <p>
                        Unable to generate AI summary.
                    </p>

                    <small>
                        ${escapeHTML(
                            error.message
                        )}
                    </small>

                </div>

            `;

        } finally {

            if (button) {

                button.disabled = false;

                button.innerHTML = `

                    <i class="fa-solid fa-sparkles"></i>

                    Generate AI Summary

                `;
            }
        }
    }


    // =====================================================
    // DISPLAY AI SUMMARY
    // =====================================================

    function displayAISummary(summary) {

        const result =
            document.getElementById(
                "aiSummaryResult"
            );


        if (!result) {
            return;
        }


        result.innerHTML = `

            <div class="ai-result-content">

                ${formatAISummary(summary)}

            </div>

        `;
    }


    // =====================================================
    // FORMAT AI SUMMARY
    // =====================================================

    function formatAISummary(text) {

        const lines =
            String(text)
                .split("\n")
                .map(function (line) {

                    return line.trim();
                })
                .filter(function (line) {

                    return line.length > 0;
                });


        let html = "";

        let listOpen = false;


        lines.forEach(function (line) {

            // =================================================
            // BULLET
            // =================================================

            if (
                line.startsWith("- ") ||
                line.startsWith("* ") ||
                line.startsWith("• ")
            ) {

                if (!listOpen) {

                    html +=
                        "<ul class='ai-result-list'>";

                    listOpen = true;
                }


                const bullet =
                    line
                        .replace(/^[-*•]\s*/, "");


                html +=
                    `<li>${escapeHTML(bullet)}</li>`;


                return;
            }


            // =================================================
            // CLOSE LIST
            // =================================================

            if (listOpen) {

                html += "</ul>";

                listOpen = false;
            }


            // =================================================
            // MARKDOWN HEADING
            // =================================================

            if (line.startsWith("#")) {

                const heading =
                    line.replace(
                        /^#+\s*/,
                        ""
                    );


                html +=
                    `<h4>${escapeHTML(heading)}</h4>`;


                return;
            }


            // =================================================
            // COLON HEADING
            // =================================================

            if (
                line.endsWith(":") &&
                line.length < 100
            ) {

                html +=
                    `<h4>${escapeHTML(line)}</h4>`;


                return;
            }


            // =================================================
            // NORMAL PARAGRAPH
            // =================================================

            html +=
                `<p>${escapeHTML(line)}</p>`;
        });


        if (listOpen) {

            html += "</ul>";
        }


        return html;
    }


    // =====================================================
    // DETAIL ITEM
    // =====================================================

    function detailItem(label, value) {

        const safeValue =
            value === undefined ||
            value === null ||
            value === ""
                ? "-"
                : value;


        return `

            <div class="detail-item">

                <span class="detail-label">
                    ${escapeHTML(label)}
                </span>

                <strong class="detail-value">
                    ${escapeHTML(
                        String(safeValue)
                    )}
                </strong>

            </div>

        `;
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        if (
            value === undefined ||
            value === null
        ) {

            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // =====================================================
    // PATIENTS NAVIGATION
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
    // NEW CASE NAVIGATION
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


    // =====================================================
    // INITIAL PAGE
    // =====================================================

    const currentDoctor =
        getCurrentDoctor();


    if (currentDoctor) {

        showNewCase();
    }

});