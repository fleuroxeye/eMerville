let selectedDocument = "";

window.openDetailsModal = function(trackingId) {
    const currentRequests = JSON.parse(localStorage.getItem('savedRequests')) || [];
    const foundRequest = currentRequests.find(req => req.id === trackingId);

    if (!foundRequest) return;

    document.getElementById('modalTrackId').innerText = foundRequest.id;
    document.getElementById('modalRequestedOn').innerText = foundRequest.requestedOn;
    document.getElementById('modalEta').innerText = foundRequest.eta;
    document.getElementById('modalPurpose').innerText = foundRequest.purpose;
    document.getElementById('detailsModal').style.display = 'flex';
};

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('loginPassword');
    const eyeIcon = document.querySelector('.toggle-password-eye');

    if (passwordInput && eyeIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
         
            eyeIcon.classList.add('fa-eye-slash');
            eyeIcon.classList.remove('fa-eye');
        } else {
            passwordInput.type = 'password';
         
            eyeIcon.classList.add('fa-eye');
            eyeIcon.classList.remove('fa-eye-slash');
        }
    }
}

function toggleSignUpPasswordVisibility() {
    const signUpPasswordInput = document.getElementById('signUpPassword');
    const eyeIconSignUp = document.querySelector('.toggle-password-eye-signup');

    if (signUpPasswordInput && eyeIconSignUp) {
        if (signUpPasswordInput.type === 'password') {
            signUpPasswordInput.type = 'text';
         
            eyeIconSignUp.classList.add('fa-eye-slash');
            eyeIconSignUp.classList.remove('fa-eye');
        } else {
            signUpPasswordInput.type = 'password';
        
            eyeIconSignUp.classList.add('fa-eye');
            eyeIconSignUp.classList.remove('fa-eye-slash');
        }
    }
}

function switchAuthScreen(targetId) {
    document.querySelectorAll('.auth-sub-screen').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(targetId).classList.remove('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    showScreen('dashboard-screen');
}

function handleSignUp(event) {
    event.preventDefault();

    const signUpPassInput = document.getElementById('signUpPassword');
    const passwordValue = signUpPassInput ? signUpPassInput.value : '';

    if (passwordValue.length < 8) {
        alert("Password must be at least 8 characters long!");
        return; 
    }

    alert("Account registered successfully!");

    const signUpIcon = document.querySelector('.toggle-password-eye-signup');
    if (signUpPassInput && signUpIcon) {
        signUpPassInput.type = 'password';
        signUpIcon.classList.add('fa-eye');
        signUpIcon.classList.remove('fa-eye-slash');
    }

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    showScreen('dashboard-screen');
}

function handleForgotPassword(event) {
    event.preventDefault();
    alert("Recovery security verification token generated and dispatched.");
    
    switchAuthScreen('auth-verify');
}


function handleVerification(event) {
    event.preventDefault();
    alert("Identity confirmed. Redirecting back to authentication platform.");
    
    switchAuthScreen('auth-login');
}


function handleLogout() {
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    switchAuthScreen('auth-login');
}

const docRequirements = {
    "Barangay Clearance": ["Valid ID", "Proof of Residency"],
    "Certificate of Indigency": ["Voter's ID", "No Income Certificate"],
    "Certificate of Residency": ["Latest Cedula (2026)", "Utility Bill"],
    "Business Permit": ["DTI/SEC Registration", "Lease Contract"],
    "Cedula": ["Valid Government ID", "Proof of Income Status"],
    "Barangay ID Card": ["2 Government Valid IDs", "Barangay Clearance Record"]
};

function openForm(documentName) {
    selectedDocument = documentName;
    document.getElementById('form-title').innerText = `${documentName} Application`;

    const reqList = document.getElementById('req-list');
    reqList.innerHTML = ""; // Linisin ang lumang list
    
    const requirements = docRequirements[documentName] || ["General Requirements"];
    requirements.forEach(req => {
        let li = document.createElement('li');
        li.innerText = req;
        reqList.appendChild(li);
    });
    showScreen('form-screen');
}

function submitRequest() {
    const fileInput = document.getElementById('requirementFile');
    if (fileInput.files.length === 0) {
        alert("Please upload a photocopy of the requirements before submitting.");
        return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `MRVL-${randomNum}`;
    
    document.getElementById('receipt-doc').innerText = selectedDocument;
    document.getElementById('receipt-track').innerText = trackingNumber;

    const ngayon = new Date();
    const optionsFormat = { month: 'short', day: 'numeric', year: 'numeric' };
    const requestedDateStr = ngayon.toLocaleDateString('en-US', optionsFormat);
    
    // ETA logic
    ngayon.setDate(ngayon.getDate() + 2);
    const etaDateStr = ngayon.toLocaleDateString('en-US', optionsFormat);

    const newRequest = {
        document: selectedDocument,
        id: trackingNumber,
        requestedOn: requestedDateStr,
        eta: etaDateStr,
        purpose: "Scholarship Requirement" 
    };

    let currentRequests = JSON.parse(localStorage.getItem('savedRequests')) || [];
    currentRequests.push(newRequest);
    localStorage.setItem('savedRequests', JSON.stringify(currentRequests));

    renderTrackingList(); 
    showScreen('success-screen'); 
}

// Siguraduhin na isa lang ang window.onload
window.onload = function() {
    renderTrackingList();
};

function updateRequirements() {
    const purpose = document.getElementById('purposeSelect').value;
    const reqText = document.getElementById('req-text');
    
    const requirements = {
        "Employment": "Valid ID, Barangay Clearance, Medical Certificate",
        "ID Requirement": "Birth Certificate, 2x2 Picture, Proof of Residency"
    };

    if (purpose === "") {
        reqText.innerText = "Select a purpose to see requirements.";
    } else {
        reqText.innerText = requirements[purpose] || "No specific requirements found.";
    }
}

function renderTrackingList() {
    const trackingContainer = document.querySelector('.tracking-card-container');
    if (!trackingContainer) return;

    const currentRequests = JSON.parse(localStorage.getItem('savedRequests')) || [];

    if (currentRequests.length === 0) return;

    trackingContainer.innerHTML = "";

    currentRequests.forEach(req => {
        const newTrackingCard = document.createElement('div');
        newTrackingCard.className = 'universal-tracking-card';

        newTrackingCard.innerHTML = `
    <!-- ID Badge solo sa pinakataas ng card -->
    <div class="track-id-header">
        <span class="tracking-id-badge">ID: ${req.id || 'MRVL-6793'}</span>
    </div>

    <!-- MAIN CONTENT: Sabay magsisimula ang ETA at Status Box dito -->
    <div class="track-split-layout">
        
        <!-- LEFT SIDE: ETA + Document Metadata -->
        <div class="track-details">
            <div class="estimated-pickup">
                <i class="fa-solid fa-calendar-days"></i> Estimated Pickup: June 8, 2026
            </div>
            
            <div class="track-meta-grid">
                <div class="meta-item">
                    <span class="meta-label">Requested On:</span>
                    <span class="meta-value">${req.requestedOn || 'Jun 4, 2026'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Purpose:</span>
                    <span class="meta-value">${req.purpose || 'Scholarship Requirement'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Pickup Location:</span>
                    <span class="meta-value">Barangay Hall</span>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE: Status Section (Pantay na sa ETA) -->
        <div class="track-timeline-box">
            <div class="track-timeline-stepper">
                <div class="step-item step-done">
                    <div class="step-line"></div>
                    <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                    <div class="step-label">Submitted</div>
                </div>
                <div class="step-item step-active">
                    <div class="step-line"></div>
                    <div class="step-circle"><i class="fa-solid fa-circle-dot"></i></div>
                    <div class="step-label">Under Review</div>
                </div>
                <div class="step-item step-pending">
                    <div class="step-circle"></div>
                    <div class="step-label">Ready for Pickup</div>
                </div>
            </div>
        </div>
    </div>

    <!-- BOTTOM ROW: Actions Row -->
    <div class="track-buttons-container">
        <div class="track-top-btns">
            <button class="t-btn t-view" onclick="console.log('View', '${req.id}')">View Details</button>
            <button class="t-btn t-dl"><i class="fa-solid fa-download"></i> Download Receipt</button>
        </div>
        <button class="t-btn t-contact">Contact Barangay</button>
    </div>
`;
        trackingContainer.appendChild(newTrackingCard);
    });
}




window.addEventListener('DOMContentLoaded', renderTrackingList);
function resetApp() {
    document.getElementById('requestForm').reset();
    showScreen('dashboard-screen');
}

function switchMainTab(targetScreenId) {
    document.querySelectorAll('.tab-link').forEach(button => {
        button.classList.remove('active-tab');
    });

    const clickedButtonIndex = targetScreenId === 'dashboard-screen' ? 0 : 1;
    document.querySelectorAll('.tab-link')[clickedButtonIndex].classList.add('active-tab');


    showScreen(targetScreenId);
}

function executeTrackSearch() {
    const inputCodeValue = document.getElementById('trackingCodeInput').value.trim();

    if (inputCodeValue === "") {
        alert("Please enter a valid tracking number sequence.");
        return;
    }

    document.getElementById('display-track-code').innerText = inputCodeValue.toUpperCase();

    document.getElementById('tracking-result-box').classList.remove('hidden');
}

function populateDOBDropdowns() {
    const daySelect = document.getElementById('dob-day');
    const yearSelect = document.getElementById('dob-year');

    if (!daySelect || !yearSelect) return;

    daySelect.innerHTML = '<option value="">Birth Day</option>';
    yearSelect.innerHTML = '<option value="">Birth Year</option>';


    for (let d = 1; d <= 31; d++) {
        let option = document.createElement('option');
        option.value = d;
        option.innerText = d;
        daySelect.appendChild(option);
    }


    for (let y = 2026; y >= 1920; y--) {
        let option = document.createElement('option');
        option.value = y;
        option.innerText = y;
        yearSelect.appendChild(option);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateDOBDropdowns);
} else {
    populateDOBDropdowns();
}

function toggleProfileDropdown(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation(); 
    }
    
    const menu = document.getElementById('profileMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

window.addEventListener('click', function(event) {
    const menu = document.getElementById('profileMenu');
    const trigger = document.querySelector('.profile-trigger');
    
    if (menu && menu.classList.contains('show')) {
        if (trigger && !trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    }
});

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.style.setProperty('display', 'none', 'important');
        s.classList.add('hidden');
    });
    
    // Ipakita ang target
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.setProperty('display', 'block', 'important');
        targetScreen.classList.remove('hidden');
    }

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = Array.from(tabs).find(t => {
        const clickAttr = t.getAttribute('onclick') || '';
        return clickAttr.includes(screenId);
    });
    if (activeTab) activeTab.classList.add('active');

    const footer = document.getElementById('portal-footer');
    if (footer) {
        const visibleScreens = ['dashboard-screen', 'blotter-screen', 'tracking-screen', 'request-screen', 'form-screen'];
        footer.style.setProperty('display', visibleScreens.includes(screenId) ? 'block' : 'none', 'important');
    }
    
    window.scrollTo(0, 0);
}


function handleBlotterSubmit(event) {
    event.preventDefault();
    alert("Your incident report has been securely encoded into the Barangay Merville database repository. An officer will review this shortly.");
    event.target.reset();
    showScreen('dashboard-screen');
}


function setupNavigation() {
    const navLinks = document.querySelectorAll('.app-header nav a, .header-links a, ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetText = this.textContent.trim().toLowerCase();
            if (targetText === 'home') {
                e.preventDefault();
                showScreen('dashboard-screen');
            } else if (targetText === 'request document' || targetText === 'services') {
                e.preventDefault();
                showScreen('request-screen'); 
            } else if (targetText === 'track request') {
                e.preventDefault();
                showScreen('track-screen');
            } else if (targetText === 'blotter report' || targetText === 'contact us') {
                e.preventDefault();
                showScreen('blotter-screen');
            }
        });
    });
}

const originalOpenForm = window.openForm;
window.openForm = function(formType) {
  
    showScreen('request-screen');
    
    if (typeof originalOpenForm === 'function') {
        originalOpenForm(formType);
    } else {
       
        const docSelect = document.getElementById('document-type');
        if (docSelect) {
            docSelect.value = formType;
            docSelect.dispatchEvent(new Event('change'));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    populateDOBDropdowns();
    renderTrackingList();
});

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('requirementFile');
    const fileText = document.getElementById('file-text');

    if (fileInput && fileText) {
        fileInput.addEventListener('change', function() {
            // Kunin ang pangalan ng in-upload na file
            const fileName = this.files[0] ? this.files[0].name : "Click to upload or drag files here";
         
            fileText.innerText = fileName;
            
        
            fileText.style.color = "#2e7559";
            fileText.style.fontWeight = "bold";
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('requirementFile');
    const fileText = document.getElementById('file-text');
    const uploadBox = document.getElementById('upload-box');

    // 1. Siguraduhin na clickable ang box
    if (uploadBox) {
        uploadBox.onclick = () => fileInput.click();
    }

    if (fileInput && fileText) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
   
                fileText.innerText = this.files[0].name;
                fileText.style.color = "#2e7559";
                fileText.style.fontWeight = "bold";
            }
        });
    }
});

function closeDetailsModal() {
    
    const modal = document.querySelector('.modal-content-container');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }

}
