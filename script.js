let previousPage = "home";

function showPage(pageId) {
    const activePage = document.querySelector(".page.active");

    if (activePage && activePage.id !== pageId) {
     previousPage = activePage.id;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    if (pageId === "profile") {
        loadPatientProfile();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function goBack() {
    showPage(previousPage);
}

function showToast(message) {
 const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function showStep(stepNumber) {
    document.querySelectorAll(".form-step").forEach(step => {
        step.classList.remove("active-step");
    });

    document.getElementById("step" + stepNumber).classList.add("active-step");

    document.querySelectorAll(".step-dot").forEach((dot, index) => {
        dot.classList.remove("active");
        dot.classList.remove("completed");

        if (index + 1 < stepNumber) {
            dot.classList.add("completed");
        } else if (index + 1 === stepNumber) {
            dot.classList.add("active");
        }
    });
}

function sendOTP() {
    const number = document.getElementById("mobileNumber").value.trim();

    if (!/^[0-9]{10}$/.test(number)) {
        showToast("Please enter a valid 10 digit mobile number.");
        return;
    }

    localStorage.setItem("patientPhone", number);

    showToast("OTP sent successfully! Use 123456 for testing.");

    setTimeout(() => {
        showStep(2);
    }, 600);
}

function verifyOTP() {
    const otp = document.getElementById("otpInput").value.trim();

    if (otp === "123456") {
        showToast("OTP verified successfully!");

        setTimeout(() => {
            showStep(3);
        }, 500);
    } else {
        showToast("Invalid OTP. Please enter 123456.");
    }
}

function completeProfile() {
    const name = document.getElementById("patientName").value.trim();
    const age = document.getElementById("patientAge").value;
    const gender = document.getElementById("patientGender").value;
    const blood = document.getElementById("bloodGroup").value;
    const condition = document.getElementById("medicalCondition").value;
    const allergies = document.getElementById("allergies").value.trim();
    const emergency = document.getElementById("emergencyContact").value.trim();

    if (name === "" || age === "" || gender === "" || blood === "") {
        showToast("Please complete all required profile information.");
        return;
    }

    localStorage.setItem("patientName", name);
    localStorage.setItem("patientAge", age);
    localStorage.setItem("patientGender", gender);
    localStorage.setItem("bloodGroup", blood);
    localStorage.setItem("medicalCondition", condition || "Not Added");
    localStorage.setItem("allergies", allergies || "None Added");
    localStorage.setItem("emergencyContact", emergency || "Not Added");

    saveEmergencyExtras();
    showToast("Profile completed successfully!");

    setTimeout(() => {
        showPage("profile");
    }, 700);
}

function loadPatientProfile() {
    const name = localStorage.getItem("patientName");
    const age = localStorage.getItem("patientAge");
    const gender = localStorage.getItem("patientGender");
    const blood = localStorage.getItem("bloodGroup");
    const condition = localStorage.getItem("medicalCondition");
    const allergies = localStorage.getItem("allergies");
    const emergency = localStorage.getItem("emergencyContact");
    const phone = localStorage.getItem("patientPhone");

    document.getElementById("profileName").innerText = name || "Citizen";
    document.getElementById("profileAge").innerText = age || "Not Added";
    document.getElementById("profileGender").innerText = gender || "Not Added";
    document.getElementById("profileBlood").innerText = blood || "Not Added";
    document.getElementById("profileCondition").innerText = condition || "Not Added";
    document.getElementById("profileAllergies").innerText = allergies || "Not Added";
    document.getElementById("profileEmergency").innerText = emergency || "Not Added";
    document.getElementById("profilePhone").innerText = phone ? "📱 +91 " + phone : "📱 Not Added";
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function quickQuestion(question) {
    document.getElementById("chatInput").value = question;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();

    if (!message) return;

    const messages = document.getElementById("messages");

    messages.innerHTML += `
        <div class="message user-message">
            ${message}
        </div>
    `;

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        const response = getAIResponse(message.toLowerCase());

        messages.innerHTML += `
            <div class="message bot-message">
                ${response}
            </div>
        `;

        messages.scrollTop = messages.scrollHeight;
    }, 600);
}

function getAIResponse(message) {
    if (
        message.includes("clinic") ||
        message.includes("hospital") ||
        message.includes("nearby")
    ) {
        return `
            📍 I can help you find healthcare facilities near your location.
            <br><br>
            <button class="card-link" onclick="showPage('locator')">
                Find Nearby Clinics →
            </button>
        `;
    }

    if (
        message.includes("scheme") ||
        message.includes("eligibility")
    ) {
        return `
            📋 You can check available healthcare schemes
            using our Scheme Eligibility Checker.
            <br><br>
            <button class="card-link" onclick="showPage('schemes')">
                Check Schemes →
            </button>
        `;
    }

    if (
        message.includes("ambulance") ||
        message.includes("emergency")
    ) {
        return `
            🚨 If you need emergency assistance,
            please use the Emergency Ambulance service.
            <br><br>
            <button class="card-link" onclick="showPage('ambulance')">
                Request Emergency Assistance →
            </button>
        `;
    }

    if (message.includes("profile")) {
        return `
            👤 Your Patient Profile stores your basic
            healthcare information.
            <br><br>
            <button class="card-link" onclick="showPage('profile')">
                Open Patient Profile →
            </button>
        `;
    }

    return `
        Namaste! 😊
        <br><br>
        I can help you with:
        <br><br>
        📍 Finding nearby clinics
        <br>
        📋 Healthcare schemes
        <br>
        🚑 Emergency assistance
        <br>
        👤 Patient profile guidance
        <br><br>
        Please tell me what you need help with.
    `;
}

function checkSchemes() {
    const age = parseInt(document.getElementById("schemeAge").value);
    const condition = document.getElementById("schemeCondition").value;

    if (!age || !condition) {
        showToast("Please enter your age and select a medical condition.");
        return;
    }

    let results = `
        <h2>Matching Healthcare Support</h2>

        <p style="color:#62728a; margin:10px 0 20px;">
            Based on your provided information.
        </p>

        <div class="scheme-card">
            <h3>Healthcare Coverage Support</h3>
            <p>
                Explore applicable healthcare support
                based on official eligibility criteria.
            </p>
            <span class="eligible">✓ Potentially Relevant</span>
        </div>
    `;

    if (condition === "Pregnancy") {
        results += `
            <div class="scheme-card">
                <h3>Maternal Healthcare Support</h3>
                <p>
                    Explore healthcare services related
                    to maternal and pregnancy care.
                </p>
                <span class="eligible">✓ Relevant to Your Need</span>
            </div>
        `;
    }

    if (age >= 60) {
        results += `
            <div class="scheme-card">
                <h3>Senior Citizen Healthcare Support</h3>
                <p>
                    Explore healthcare support services
                    available for senior citizens.
                </p>
                <span class="eligible">✓ Age-Based Support</span>
            </div>
        `;
    }

    document.getElementById("schemeResults").innerHTML = results;
}

function getLocation() {
    const status = document.getElementById("locationStatus");

    if (navigator.geolocation) {
        status.innerHTML = "📡 Detecting your current location...";

        navigator.geolocation.getCurrentPosition(
            function (position) {
                status.innerHTML = `
                    📍 Location shared successfully
                    <br>
                    Latitude: ${position.coords.latitude.toFixed(4)}
                    <br>
                    Longitude: ${position.coords.longitude.toFixed(4)}
                `;
            },
            function () {
                status.innerHTML = "⚠️ Unable to access location. Please enable location permission.";
            }
        );
    } else {
        status.innerHTML = "⚠️ Location services are not supported by this browser.";
    }
}

function requestAmbulance() {
    const confirmed = confirm("Are you sure you want to request emergency ambulance assistance?");

    if (confirmed) {
        showToast("Emergency request submitted. Please keep your phone available.");
    }
}

function callNumber(number) {
    window.location.href = "tel:" + number;
}

const CHILD_STORE_KEY = "gramrahiChildProfiles_v1";
const VACCINE_CHECKLIST = [
    {id:"birth", label:"Birth-dose records (verify against vaccination card)"},
    {id:"6w", label:"Around 6 weeks — verify due doses with health worker"},
    {id:"10w", label:"Around 10 weeks — verify due doses with health worker"},
    {id:"14w", label:"Around 14 weeks — verify due doses with health worker"},
    {id:"9m", label:"Around 9 months — verify due doses with health worker"},
    {id:"16m", label:"Later infant / toddler doses — confirm exact timing locally"},
    {id:"school", label:"School-age / adolescent doses — confirm current national/state schedule"}
];

function getChildren() {
    try { return JSON.parse(localStorage.getItem(CHILD_STORE_KEY) || "[]"); }
    catch (_) { return []; }
}
function putChildren(children) {
    localStorage.setItem(CHILD_STORE_KEY, JSON.stringify(children));
}
function escapeChildText(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function saveChild(event) {
    event.preventDefault();
    const child = {
        id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        name: document.getElementById("childName").value.trim(),
        ageMonths: Number(document.getElementById("childAgeMonths").value),
        sex: document.getElementById("childSex").value,
        weight: document.getElementById("childWeight").value,
        height: document.getElementById("childHeight").value,
        allergies: document.getElementById("childAllergies").value.trim(),
        conditions: document.getElementById("childConditions").value.trim(),
        vaccines: {}
    };
    if (!child.name || !Number.isFinite(child.ageMonths) || child.ageMonths < 0 || child.ageMonths > 204) {
        showToast("Enter the child's name and a valid age (0–204 months)."); return;
    }
    const children = getChildren();
    children.push(child);
    try { putChildren(children); }
    catch (_) { showToast("Could not save in this browser. Check storage settings."); return; }
    document.getElementById("childForm").reset();
    renderChildren();
    showToast("Child profile saved on this device.");
}
function renderChildren() {
    const children = getChildren();
    const list = document.getElementById("childProfiles");
    const options = children.map(c => `<option value="${escapeChildText(c.id)}">${escapeChildText(c.name)} (${c.ageMonths} months)</option>`).join("");
    ["vaccineChild","growthChild"].forEach(id => {
        const el = document.getElementById(id), old = el.value;
        el.innerHTML = `<option value="">Choose child</option>${options}`;
        if (children.some(c => c.id === old)) el.value = old;
    });
    list.innerHTML = children.length ? children.map(c => `
        <div class="child-record"><h3>👶 ${escapeChildText(c.name)}</h3>
        <p>Age: ${c.ageMonths} months · Sex: ${c.sex === "female" ? "Female" : "Male"}</p>
        <p>Weight: ${c.weight ? escapeChildText(c.weight)+" kg" : "Not added"} · Height: ${c.height ? escapeChildText(c.height)+" cm" : "Not added"}</p>
        <p>Allergies: ${escapeChildText(c.allergies || "Not added")}</p><p>Conditions: ${escapeChildText(c.conditions || "Not added")}</p>
        <button onclick="removeChild('${escapeChildText(c.id)}')">Remove profile</button></div>`).join("") : `<p class="child-note">No child profiles yet. Add your first child above.</p>`;
    renderVaccines();
}
function removeChild(id) {
    if (!confirm("Remove this child profile and its demo vaccination checklist from this browser?")) return;
    putChildren(getChildren().filter(c => c.id !== id));
    renderChildren();
}
function renderVaccines() {
    const id = document.getElementById("vaccineChild").value;
    const child = getChildren().find(c => c.id === id);
    const target = document.getElementById("vaccineTracker");
    if (!child) { target.innerHTML = `<p class="child-note">Choose a saved child to view the checklist.</p>`; return; }
    target.innerHTML = `<h3>${escapeChildText(child.name)}'s checklist</h3><table class="child-table"><thead><tr><th>Checkpoint</th><th>Record</th></tr></thead><tbody>` +
        VACCINE_CHECKLIST.map(v => `<tr><td>${escapeChildText(v.label)}</td><td><label><input type="checkbox" ${child.vaccines[v.id] ? "checked" : ""} onchange="markVaccine('${child.id}','${v.id}',this.checked)"> Dose record checked</label></td></tr>`).join("") +
        `</tbody></table><p class="child-note">Checkboxes only record what you mark; they do not mean the dose is medically due or completed. Use the child's official vaccination card.</p>` +
        (child.cardPhotoId ? `<div class="vaccine-card-photo"><h4>Saved vaccination card photo</h4><a href="${escapeChildText(cldDocUrl(child.cardPhotoId, "full"))}" target="_blank" rel="noopener"><img src="${escapeChildText(cldDocUrl(child.cardPhotoId, "card"))}" alt="Vaccination card" loading="lazy"></a></div>` : "");
}
function markVaccine(childId, vaccineId, checked) {
    const children = getChildren(), child = children.find(c => c.id === childId);
    if (!child) return;
    child.vaccines = child.vaccines || {};
    child.vaccines[vaccineId] = checked;
    putChildren(children);
}
function remindVaccines() {
    const child = getChildren().find(c => c.id === document.getElementById("vaccineChild").value);
    if (!child) { showToast("Choose a child first."); return; }
    showToast("Demo only: reminders are not sent. Ask your health worker about the next due dose.");
}
function fillGrowth() {
    const child = getChildren().find(c => c.id === document.getElementById("growthChild").value);
    document.getElementById("growthWeight").value = child?.weight || "";
    document.getElementById("growthHeight").value = child?.height || "";
    document.getElementById("growthResult").innerHTML = "";
}
function checkGrowth() {
    const child = getChildren().find(c => c.id === document.getElementById("growthChild").value);
    const w = Number(document.getElementById("growthWeight").value), h = Number(document.getElementById("growthHeight").value);
    const result = document.getElementById("growthResult");
    if (!child || !(w > 0) || !(h > 0)) { showToast("Choose a child and enter valid height and weight."); return; }
    child.weight = String(w); child.height = String(h);
    const children = getChildren(); putChildren(children);
    renderChildren();
    result.innerHTML = `<div class="child-status yellow"><strong>Measurements recorded — clinical interpretation needed.</strong><br>Age: ${child.ageMonths} months; weight: ${w} kg; height/length: ${h} cm. This demo does not calculate a nutrition category. Ask an Anganwadi worker or health professional to plot these measurements on the appropriate age- and sex-specific growth chart, especially if weight is falling, feeding is difficult, or you are concerned.</div>`;
}
function checkChildSymptoms() {
    const age = Number(document.getElementById("symptomAge").value);
    const symptom = document.getElementById("childSymptom").value;
    const danger = document.getElementById("dangerSign").value;
    const out = document.getElementById("symptomResult");
    if (!Number.isFinite(age) || age < 0 || age > 204 || !symptom) { showToast("Enter age and select the main symptom."); return; }
    if (danger !== "no" || (symptom === "Fever" && age < 3)) {
        out.innerHTML = `<div class="child-status red"><strong>Seek urgent medical care now.</strong><br>Warning signs can indicate a serious illness. For a baby younger than 3 months with fever, seek urgent medical assessment. If the child has difficulty breathing, is hard to wake, has a seizure, cannot drink, or is rapidly worsening, use emergency services. Do not delay care to use this website.</div>`;
    } else {
        out.innerHTML = `<div class="child-status yellow"><strong>Contact a qualified health worker for advice.</strong><br>Monitor drinking/feeding, urination, breathing and alertness. Seek prompt care if symptoms worsen, persist, the child is very young, or you are worried. Do not give medicines or antibiotics without appropriate clinical advice.</div>`;
    }
}
function startChildEmergency() {
    const age = document.getElementById("emergencyChildAge").value;
    const symptoms = document.getElementById("emergencyChildSymptoms").value.trim();
    if (age === "" || !symptoms) { showToast("Enter the child's age and symptoms first."); return; }
    const summary = document.getElementById("childEmergencySummary");
    summary.style.display = "block";
    summary.textContent = "Child emergency details (demo): age " + age + " months; symptoms: " + symptoms + ". This information has not been sent to emergency services.";
    showPage("ambulance");
}
document.addEventListener("DOMContentLoaded", renderChildren);

let currentLanguage = "en";

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "en,hi",
            autoDisplay: false
        },
        "google_translate_element"
    );
}

function toggleLanguage() {
    const button = document.getElementById("languageBtn");
    const select = document.querySelector(".goog-te-combo");

    if (!select) {
        if (typeof showToast === "function") {
            showToast("Translation is loading. Please try again.");
        } else {
            alert("Translation is still loading. Please try again.");
        }
        return;
    }

    const targetLanguage = select.value === "hi" ? "en" : "hi";

    select.value = targetLanguage;
    select.dispatchEvent(new Event("change", {bubbles: true}));

    button.textContent =
        targetLanguage === "hi"
            ? "🌐 View in English"
            : "🌐 हिंदी में देखें";
}

const HANDOFF_ENDPOINT = null;
const HANDOFF_LOG_KEY = "gramrahiEmergencyLog_v1";
const HANDOFF_HOSPITALS = [
    {id: "chc", name: "Community Health Centre", km: 1.2},
    {id: "phc", name: "Primary Health Centre", km: 2.8},
    {id: "dh", name: "District Government Hospital", km: 5.4}
];

function hsGet(key, fallback) {
    const v = localStorage.getItem(key);
    return (v === null || v === "") ? (fallback || "") : v;
}
function hsMask(id) {
    if (!id) return "Not added";
    return id.length > 4 ? "•••• " + id.slice(-4) : id;
}
function hsSleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function saveEmergencyExtras() {
    const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
    localStorage.setItem("pastIssues", val("pastIssues"));
    localStorage.setItem("currentTreatment", val("currentTreatment"));
    localStorage.setItem("ayushmanId", val("ayushmanId"));
    const c = document.getElementById("shareConsent");
    localStorage.setItem("shareConsent", c && c.checked ? "yes" : "no");
    registerPatient();
}

const _origLoadPatientProfile = loadPatientProfile;
window.loadPatientProfile = function () {
    _origLoadPatientProfile();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    set("profileAyushman", hsMask(hsGet("ayushmanId")));
    set("profilePast", hsGet("pastIssues", "Not Added"));
    set("profileTreatment", hsGet("currentTreatment", "Not Added"));
    set("profileShare", hsGet("shareConsent") === "yes" ? "On — sent to hospital in emergencies" : "Off");
};

const _origShowPage = showPage;
window.showPage = function (id) {
    _origShowPage(id);
    if (id === "ambulance") refreshHandoffPanel();
};

function refreshHandoffPanel() {
    const patientSel = document.getElementById("handoffPatient");
    if (!patientSel) return;
    const oldPatient = patientSel.value;

    const me = hsGet("patientName", "Myself");
    let opts = `<option value="self">${escapeChildText(me)} (myself)</option>`;
    getChildren().forEach(c => {
        opts += `<option value="${escapeChildText(c.id)}">${escapeChildText(c.name)} (child, ${c.ageMonths} months)</option>`;
    });
    patientSel.innerHTML = opts;
    if ([...patientSel.options].some(o => o.value === oldPatient)) patientSel.value = oldPatient;

    const auto = nearestHospital();
    document.getElementById("handoffHospitalAuto").textContent = "📍 Sent automatically to the nearest hospital: " + auto.name + " (" + auto.km + " km)";

    document.getElementById("handoffShare").checked = hsGet("shareConsent") === "yes";
    renderHandoffPreview();
}

function handoffPatientData() {
    const who = document.getElementById("handoffPatient").value;
    if (who !== "self") {
        const c = getChildren().find(x => x.id === who);
        if (c) return {
            type: "child", patientId: hsGet("patientId"), name: c.name, age: c.ageMonths + " months",
            gender: c.sex === "female" ? "Female" : "Male",
            weight: c.weight ? c.weight + " kg" : "",
            allergies: c.allergies || "None added",
            conditions: c.conditions || "None added",
            pastIssues: hsGet("pastIssues", "None added"),
            treatment: c.conditions || "None added",
            bloodGroup: "",
            ayushman: hsGet("ayushmanId"),
            emergencyContact: hsGet("emergencyContact"),
            phone: hsGet("patientPhone")
        };
    }
    if (!hsGet("patientName")) return null;
    return {
        type: "adult", patientId: hsGet("patientId"), name: hsGet("patientName"), age: hsGet("patientAge") + " years",
        gender: hsGet("patientGender"), bloodGroup: hsGet("bloodGroup"),
        conditions: hsGet("medicalCondition", "None added"),
        allergies: hsGet("allergies", "None added"),
        pastIssues: hsGet("pastIssues", "None added"),
        treatment: hsGet("currentTreatment", "None added"),
        ayushman: hsGet("ayushmanId"),
        emergencyContact: hsGet("emergencyContact"),
        phone: hsGet("patientPhone"),
        photoUrl: cldPhotoUrl(hsGet("patientPhotoId"), "record"),
        documents: getPatientDocs().map(d => ({name: d.name, url: cldDocUrl(d.id, "full")}))
    };
}

function renderHandoffPreview() {
    const box = document.getElementById("handoffPreview");
    const p = handoffPatientData();
    if (!p) {
        box.innerHTML = `<div class="handoff-warn">No health profile saved yet, so no health details can be sent. You can still request an ambulance, but please <button class="card-link" onclick="showPage('login');showStep(3)">complete your health profile</button> to use this feature.</div>`;
        return;
    }
    const item = (l, v) => `<div><span>${l}</span>${escapeChildText(v || "Not added")}</div>`;
    box.innerHTML = `<p class="child-note" style="margin-top:0">Details that will be sent:</p><div class="handoff-preview">` +
        item("Gramrahi Patient ID", p.patientId) + item("Name", p.name) + item("Age", p.age) + item("Gender", p.gender) + item("Blood group", p.bloodGroup) +
        item("Previous health issues", p.pastIssues) + item("Current treatment", p.treatment) +
        item("Medical conditions", p.conditions) + item("Allergies", p.allergies) +
        item("Ayushman card / ABHA", hsMask(p.ayushman)) + item("Emergency contact", p.emergencyContact) +
        `</div>`;
}

function handoffLocation() {
    const t = (document.getElementById("locationStatus") || {}).textContent || "";
    const m = t.match(/Latitude:\s*(-?[\d.]+)[\s\S]*?Longitude:\s*(-?[\d.]+)/);
    return m ? {lat: Number(m[1]), lng: Number(m[2])} : null;
}

function handoffRow(i, text, state) {
    const icon = {wait: "○", run: "⏳", done: "✅", fail: "❌"}[state];
    const row = document.getElementById("hp" + i);
    if (row) { row.className = "hp-row " + state; row.innerHTML = `<span>${icon}</span><span>${text}</span>`; }
}

async function transmitHandoff(payload) {
    if (HANDOFF_ENDPOINT) {
        const r = await fetch(HANDOFF_ENDPOINT, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error("Hospital system returned " + r.status);
        return {simulated: false, response: await r.json().catch(() => ({}))};
    }
    await hsSleep(1100);
    return {simulated: true};
}

window.requestAmbulance = async function () {
    if (!confirm("Are you sure you want to request emergency ambulance assistance?")) return;

    const btn = document.querySelector(".request-ambulance");
    const hosp = nearestHospital();
    const share = document.getElementById("handoffShare").checked;
    const patient = handoffPatientData();
    const childBox = document.getElementById("childEmergencySummary");

    const payload = {
        requestId: "GRM-" + Date.now().toString(36).toUpperCase(),
        sentAt: new Date().toISOString(),
        hospital: hosp.name,
        healthDataShared: !!(share && patient),
        patient: (share && patient) ? patient : {phone: hsGet("patientPhone")},
        location: handoffLocation(),
        incident: (childBox && childBox.style.display !== "none") ? childBox.textContent : ""
    };

    const prog = document.getElementById("handoffProgress");
    const rec = document.getElementById("handoffReceipt");
    rec.style.display = "none"; rec.innerHTML = "";
    prog.style.display = "block";
    prog.innerHTML = [0, 1, 2, 3].map(i => `<div class="hp-row wait" id="hp${i}"></div>`).join("");
    const labels = [
        "Ambulance request created",
        share && patient ? "Collecting health profile and Ayushman card details" : "Preparing request (health details not shared)",
        "Sending to " + hosp.name,
        "Hospital acknowledged"
    ];
    labels.forEach((t, i) => handoffRow(i, t, "wait"));
    btn.disabled = true;

    try {
        handoffRow(0, labels[0], "run"); await hsSleep(500); handoffRow(0, labels[0], "done");
        handoffRow(1, labels[1], "run"); await hsSleep(600); handoffRow(1, labels[1], "done");
        handoffRow(2, labels[2], "run");
        const res = await transmitHandoff(payload);
        handoffRow(2, labels[2], "done");
        handoffRow(3, labels[3] + (res.simulated ? " (demo)" : ""), "run"); await hsSleep(500);
        handoffRow(3, labels[3] + (res.simulated ? " (demo)" : ""), "done");

        try {
            const log = JSON.parse(localStorage.getItem(HANDOFF_LOG_KEY) || "[]");
            log.unshift({requestId: payload.requestId, sentAt: payload.sentAt, hospital: payload.hospital, shared: payload.healthDataShared});
            localStorage.setItem(HANDOFF_LOG_KEY, JSON.stringify(log.slice(0, 10)));
        } catch (_) {}

        showHospitalReceipt(payload, hosp, res.simulated);
        showToast("Emergency request sent to " + hosp.name + ".");
    } catch (err) {
        const failedIdx = [0, 1, 2, 3].find(i => !document.getElementById("hp" + i).classList.contains("done")) ?? 2;
        handoffRow(failedIdx, "Could not reach the hospital system", "fail");
        rec.style.display = "block";
        rec.style.borderColor = "var(--danger)";
        rec.innerHTML = `<div class="hr-head" style="background:var(--danger)">⚠️ Request not delivered</div><div class="hr-body"><p>Please call for help directly now.</p><div class="child-actions"><button class="primary-btn" onclick="callNumber('108')">Call 108</button><button class="primary-btn" onclick="callNumber('112')">Call 112</button></div></div>`;
    } finally {
        btn.disabled = false;
    }
};

function showHospitalReceipt(p, hosp, simulated) {
    const rec = document.getElementById("handoffReceipt");
    const d = p.patient || {};
    const row = (l, v) => v ? `<div><span>${l}</span>${escapeChildText(v)}</div>` : "";
    let body;
    if (p.healthDataShared) {
        body = (d.photoUrl ? `<img class="record-photo" src="${escapeChildText(d.photoUrl)}" alt="Patient photo">` : "") + `<div class="handoff-preview">` +
            row("Gramrahi Patient ID", d.patientId) + row("Patient", d.name) + row("Age", d.age) + row("Gender", d.gender) + row("Blood group", d.bloodGroup) +
            row("Previous health issues", d.pastIssues) + row("Current treatment", d.treatment) +
            row("Medical conditions", d.conditions) + row("Allergies", d.allergies) +
            row("Ayushman card / ABHA", d.ayushman) + row("Emergency contact", d.emergencyContact) +
            row("Phone", d.phone) +
            row("Location", p.location ? p.location.lat.toFixed(4) + ", " + p.location.lng.toFixed(4) : "Not shared") +
            row("Incident details", p.incident) + `</div>`;
    } else {
        body = `<p>Health details were <strong>not</strong> shared. Only the callback number${p.location ? " and location" : ""} reached the hospital.</p>`;
    }
    rec.style.display = "block";
    rec.style.borderColor = "var(--green)";
    rec.innerHTML = `<div class="hr-head">🏥 ${escapeChildText(hosp.name)} — Incoming emergency patient</div>
        <div class="hr-body"><p style="margin-bottom:10px"><strong>Reference:</strong> ${escapeChildText(p.requestId)}</p>${body}
        <div class="child-actions"><button class="primary-btn" onclick="callNumber('108')">🚑 Call 108 now</button></div></div>
        <div class="hr-foot">${simulated ? "Demo mode: this shows what the hospital's reception screen would display. No real hospital or ambulance has been contacted. In a real emergency, call 108 or 112." : "Delivered to the hospital system. If help has not arrived, call 108 or 112."}</div>`;
    rec.scrollIntoView({behavior: "smooth", block: "center"});
}

const PATIENT_REGISTRY_KEY = "gramrahiPatientRegistry_v1";
const ACCESS_LOG_KEY = "gramrahiAccessLog_v1";
let pendingLookupId = null;

function nearestHospital() {
    return [...HANDOFF_HOSPITALS].sort((a, b) => a.km - b.km)[0];
}
function getRegistry() {
    try { return JSON.parse(localStorage.getItem(PATIENT_REGISTRY_KEY) || "{}"); }
    catch (_) { return {}; }
}
function generatePatientId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const reg = getRegistry();
    let id;
    do {
        const n = new Uint32Array(8);
        (window.crypto || {getRandomValues: a => a.map(() => Math.random() * 4294967296)}).getRandomValues(n);
        const t = Array.from(n, v => chars[v % chars.length]).join("");
        id = "GRM-" + t.slice(0, 4) + "-" + t.slice(4);
    } while (reg[id]);
    return id;
}
function registerPatient() {
    if (!hsGet("patientName")) return;
    let id = hsGet("patientId");
    if (!id) { id = generatePatientId(); localStorage.setItem("patientId", id); }
    const reg = getRegistry();
    reg[id] = {
        id: id, name: hsGet("patientName"), age: hsGet("patientAge"), gender: hsGet("patientGender"),
        bloodGroup: hsGet("bloodGroup"), conditions: hsGet("medicalCondition", "None added"),
        allergies: hsGet("allergies", "None added"), pastIssues: hsGet("pastIssues", "None added"),
        treatment: hsGet("currentTreatment", "None added"), ayushman: hsGet("ayushmanId"),
        emergencyContact: hsGet("emergencyContact"), phone: hsGet("patientPhone"),
        consent: hsGet("shareConsent"), updatedAt: new Date().toISOString(),
        photoId: hsGet("patientPhotoId"), docs: getPatientDocs()
    };
    localStorage.setItem(PATIENT_REGISTRY_KEY, JSON.stringify(reg));
    const el = document.getElementById("profilePatientId");
    if (el) el.innerText = id;
}

const _loadProfileV2 = window.loadPatientProfile;
window.loadPatientProfile = function () {
    _loadProfileV2();
    if (hsGet("patientName") && !hsGet("patientId")) registerPatient();
    const el = document.getElementById("profilePatientId");
    if (el) el.innerText = hsGet("patientId", "Complete your profile to get an ID");
};

function copyPatientId() {
    const id = hsGet("patientId");
    if (!id) { showToast("Complete your profile first to get your Patient ID."); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(id).then(() => showToast("Patient ID copied: " + id), () => showToast("Your ID: " + id));
    else showToast("Your ID: " + id);
}

function logAccess(entry) {
    try {
        const log = JSON.parse(localStorage.getItem(ACCESS_LOG_KEY) || "[]");
        log.unshift(entry);
        localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(log.slice(0, 15)));
    } catch (_) {}
    renderAccessLog();
}
function renderAccessLog() {
    const box = document.getElementById("accessLog");
    if (!box) return;
    let log = [];
    try { log = JSON.parse(localStorage.getItem(ACCESS_LOG_KEY) || "[]"); } catch (_) {}
    box.innerHTML = log.length
        ? log.map(l => `<div>${escapeChildText(l.id)} viewed by ${escapeChildText(l.hospital)} · ${new Date(l.time).toLocaleString()}</div>`).join("")
        : `<div>No records accessed yet.</div>`;
}

function lookupPatient() {
    const out = document.getElementById("lookupResult");
    const id = document.getElementById("lookupId").value.trim().toUpperCase();
    if (!/^GRM-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id)) {
        out.innerHTML = `<div class="child-status red">Enter a valid ID in the format GRM-XXXX-XXXX.</div>`;
        return;
    }
    const rec = getRegistry()[id];
    if (!rec) {
        out.innerHTML = `<div class="child-status red">No patient found with this ID. Please check the ID and try again.</div>`;
        return;
    }
    if (rec.consent !== "yes") {
        pendingLookupId = id;
        out.innerHTML = `<div class="child-status yellow"><strong>Patient approval needed.</strong><br>This patient has not switched on automatic sharing. Ask the patient for the one-time code sent to their registered mobile (demo code: 123456).</div>
            <div class="form-group" style="margin-top:14px"><label for="lookupOtp">One-time code</label><input id="lookupOtp" type="text" maxlength="6" placeholder="Enter code"></div>
            <button class="primary-btn" onclick="verifyLookupOtp()">Verify and view details</button>`;
        return;
    }
    showPatientRecord(rec);
}

function verifyLookupOtp() {
    const code = document.getElementById("lookupOtp").value.trim();
    if (code !== "123456") { showToast("Incorrect code."); return; }
    const rec = getRegistry()[pendingLookupId];
    if (rec) showPatientRecord(rec);
}

function showPatientRecord(rec) {
    const out = document.getElementById("lookupResult");
    const hospital = document.getElementById("lookupHospital").value;
    const item = (l, v) => `<div><span>${l}</span>${escapeChildText(v || "Not added")}</div>`;
    const kids = (rec.id === hsGet("patientId")) ? getChildren() : [];
    out.innerHTML = `<div class="hospital-receipt" style="display:block">
        <div class="hr-head">✅ ${escapeChildText(rec.name)} · ${escapeChildText(rec.id)}</div>
        <div class="hr-body">` +
        (rec.photoId ? `<img class="record-photo" src="${escapeChildText(cldPhotoUrl(rec.photoId, "record"))}" alt="Patient photo">` : "") +
        `<div class="handoff-preview">` +
        item("Age", rec.age + " years") + item("Gender", rec.gender) + item("Blood group", rec.bloodGroup) +
        item("Medical conditions", rec.conditions) + item("Previous health issues", rec.pastIssues) +
        item("Current treatment", rec.treatment) + item("Allergies", rec.allergies) +
        item("Ayushman card / ABHA", rec.ayushman) + item("Emergency contact", rec.emergencyContact) +
        item("Phone", rec.phone) + `</div>` +
        ((rec.docs && rec.docs.length) ? `<h4 style="margin:16px 0 6px">Medical documents</h4><div class="doc-gallery">` +
            rec.docs.map(d => `<a class="doc-item" href="${escapeChildText(cldDocUrl(d.id, "full"))}" target="_blank" rel="noopener"><img src="${escapeChildText(cldDocUrl(d.id, "thumb"))}" alt="${escapeChildText(d.name)}" loading="lazy"><div><span>${escapeChildText(d.name)}</span></div></a>`).join("") + `</div>` : "") +
        (kids.length ? `<h4 style="margin:16px 0 6px">Children linked to this ID</h4><div class="handoff-preview">` +
            kids.map(c => item(c.name, c.ageMonths + " months · Allergies: " + (c.allergies || "None added") + " · Conditions: " + (c.conditions || "None added"))).join("") + `</div>` : "") +
        `</div><div class="hr-foot">Record shared with ${escapeChildText(hospital)}. This access has been logged. Last updated ${new Date(rec.updatedAt).toLocaleString()}.</div></div>`;
    logAccess({id: rec.id, hospital: hospital, time: new Date().toISOString()});
    pendingLookupId = null;
}

const _showPageV3 = window.showPage;
window.showPage = function (id) {
    _showPageV3(id);
    if (id === "hospital") renderAccessLog();
};



const CLOUDINARY_CLOUD_NAME = "ov3w3oiq";
const CLOUDINARY_UPLOAD_PRESET = "gramrahi_unsigned";

const CLD_PHOTO_TRANSFORMS = {
    avatar: "c_thumb,g_face,w_240,h_240,q_auto,f_auto",   
    record: "c_thumb,g_face,w_300,h_300,q_auto,f_auto"
};
const CLD_DOC_TRANSFORMS = {
    thumb: "c_fill,w_300,h_220,q_auto,f_auto",
    full: "c_limit,w_1600,q_auto,f_auto",                  
};

function cloudinaryReady() {
    if (typeof cloudinary === "undefined") {
        showToast("Upload tool is still loading or you are offline. Please try again.");
        return false;
    }
    if (CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" || CLOUDINARY_UPLOAD_PRESET === "YOUR_UNSIGNED_PRESET") {
        showToast("Cloudinary is not set up yet. Add your cloud name and upload preset in script.js.");
        return false;
    }
    return true;
}

function cldBase() { return "https://res.cloudinary.com/" + CLOUDINARY_CLOUD_NAME + "/image/upload/"; }
function cldPhotoUrl(publicId, kind) {
    return publicId ? cldBase() + CLD_PHOTO_TRANSFORMS[kind || "avatar"] + "/" + publicId : "";
}
function cldDocUrl(publicId, kind) {
    return publicId ? cldBase() + CLD_DOC_TRANSFORMS[kind || "full"] + "/" + publicId : "";
}

function openCloudinaryWidget(options, onSuccess) {
    if (!cloudinaryReady()) return;
    const widget = cloudinary.createUploadWidget(Object.assign({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "camera"],
        multiple: false,
        maxFileSize: 5000000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        showPoweredBy: false
    }, options), function (error, result) {
        if (error) { showToast("Upload failed. Please try again."); return; }
        if (result && result.event === "success") onSuccess(result.info);
    });
    widget.open();
}

function getPatientDocs() {
    try { return JSON.parse(localStorage.getItem("patientDocs") || "[]"); }
    catch (_) { return []; }
}

/* ---- Patient photo ---- */
function uploadProfilePhoto() {
    openCloudinaryWidget({
        folder: "gramrahi/patient-photos",
        tags: ["gramrahi", "patient-photo"],
        cropping: true,
        croppingAspectRatio: 1
    }, function (info) {
        localStorage.setItem("patientPhotoId", info.public_id);
        if (hsGet("patientName")) registerPatient();
        renderPatientPhoto();
        showToast("Photo saved. Hospitals can now identify you faster.");
    });
}

function renderPatientPhoto() {
    const id = hsGet("patientPhotoId");
    const url = cldPhotoUrl(id, "avatar");
    const avatar = document.getElementById("profileAvatar");
    if (avatar) avatar.innerHTML = url ? `<img src="${url}" alt="Your photo">` : "👤";
    const prev = document.getElementById("photoPreviewStep3");
    if (prev) { prev.src = url; prev.style.display = url ? "block" : "none"; }
}

/* ---- Medical documents (prescriptions, reports) ---- */
function uploadMedicalDoc() {
    if (!hsGet("patientName")) { showToast("Please complete your health profile first."); return; }
    openCloudinaryWidget({
        folder: "gramrahi/medical-documents",
        tags: ["gramrahi", "medical-document"]
    }, function (info) {
        const docs = getPatientDocs();
        docs.unshift({id: info.public_id, name: (info.original_filename || "Document").slice(0, 30), at: new Date().toISOString()});
        localStorage.setItem("patientDocs", JSON.stringify(docs.slice(0, 12)));
        registerPatient();
        renderDocGallery();
        showToast("Document saved to your health record.");
    });
}

function removeMedicalDoc(id) {
    if (!confirm("Remove this document from your health record?")) return;
    localStorage.setItem("patientDocs", JSON.stringify(getPatientDocs().filter(d => d.id !== id)));
    registerPatient();
    renderDocGallery();
}

function renderDocGallery() {
    const box = document.getElementById("docGallery");
    if (!box) return;
    const docs = getPatientDocs();
    box.innerHTML = docs.length ? docs.map(d => `
        <div class="doc-item">
            <a href="${escapeChildText(cldDocUrl(d.id, "full"))}" target="_blank" rel="noopener">
                <img src="${escapeChildText(cldDocUrl(d.id, "thumb"))}" alt="${escapeChildText(d.name)}" loading="lazy">
            </a>
            <div><span>${escapeChildText(d.name)}</span>
            <button onclick="removeMedicalDoc('${escapeChildText(d.id)}')">Remove</button></div>
        </div>`).join("") : `<p class="child-note">No documents uploaded yet.</p>`;
}

/* ---- Child vaccination card photo ---- */
function uploadVaccineCard() {
    const childId = document.getElementById("vaccineChild").value;
    if (!childId) { showToast("Choose a child first."); return; }
    openCloudinaryWidget({
        folder: "gramrahi/vaccination-cards",
        tags: ["gramrahi", "vaccination-card"]
    }, function (info) {
        const children = getChildren();
        const child = children.find(c => c.id === childId);
        if (!child) return;
        child.cardPhotoId = info.public_id;
        putChildren(children);
        renderVaccines();
        showToast("Vaccination card photo saved.");
    });
}


const _loadProfileV3 = window.loadPatientProfile;
window.loadPatientProfile = function () {
    _loadProfileV3();
    renderPatientPhoto();
    renderDocGallery();
};
document.addEventListener("DOMContentLoaded", renderPatientPhoto);
