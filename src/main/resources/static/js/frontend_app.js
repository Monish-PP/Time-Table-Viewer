// =========================
// ROLE-BASED AUTHENTICATION
// =========================
const AUTH_CONFIG = {
    STUDENT: { prefix: 's', title: 'Student Login', example: 'sarjuk012345', icon: 'fa-user-graduate', color: 'success' },
    FACULTY: { prefix: 'f', title: 'Faculty Login', example: 'fkartr012345', icon: 'fa-chalkboard-user', color: 'warning' },
    ADMIN:   { prefix: 'a', title: 'Admin Login', example: 'shiva25012007', icon: 'fa-user-shield', color: 'danger' }
};
const ADMIN_USERNAME = 'shiva25012007';
const ADMIN_INITIAL_PASSWORD = 'shiv2501';

function normalizeNamePart(name) {
    return String(name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function buildGeneratedUsername(role, fullName) {
    const clean = normalizeNamePart(fullName);
    const words = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    const first = normalizeNamePart(words[0] || '');
    const last = normalizeNamePart(words[words.length - 1] || '');
    if (!first || !last || first.length < 4) return '';
    return AUTH_CONFIG[role].prefix + first.slice(0, 4) + last.charAt(0) + '012345';
}

function buildClassAdvisorUsername(fullName) {
    const words = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    const first = normalizeNamePart(words[0] || '');
    const last = normalizeNamePart(words[words.length - 1] || '');
    if (!first || !last || first.length < 4) return '';
    return 'ad' + first.slice(0, 4) + last.charAt(0) + '012345';
}

function buildClassAdvisorPassword(username) {
    const clean = String(username || '').toLowerCase();
    return clean.startsWith('ad') ? clean.slice(2) : clean;
}

function buildGeneratedPassword(role, username) {
    const clean = String(username || '').toLowerCase();
    if (role === 'ADMIN') return ADMIN_INITIAL_PASSWORD;
    return clean.startsWith(AUTH_CONFIG[role].prefix) ? clean.slice(1) : clean;
}

function isLowercaseAlnum(value) {
    return /^[a-z0-9]+$/.test(value);
}

function getStoredPassword(username) {
    const clean = String(username || '').toLowerCase();
    const saved = localStorage.getItem('sece_password_' + clean);
    if (saved) return saved;
    if (clean === ADMIN_USERNAME) return ADMIN_INITIAL_PASSWORD;
    if (clean.startsWith('s')) {
        const student = studentsRoster.find(s => (s.username || buildGeneratedUsername('STUDENT', s.name)) === clean);
        return student ? buildGeneratedPassword('STUDENT', clean) : null;
    }
    if (clean.startsWith('f')) {
        const staff = staffDirectory.find(s => buildGeneratedUsername('FACULTY', s.name) === clean);
        return staff ? buildGeneratedPassword('FACULTY', clean) : null;
    }
    return null;
}

function isValidUsername(role, username) {
    const clean = String(username || '').trim().toLowerCase();
    if (!isLowercaseAlnum(clean)) return false;
    if (role === 'ADMIN') return clean === ADMIN_USERNAME;
    if (role === 'STUDENT') {
        return studentsRoster.some(s => (s.username || buildGeneratedUsername('STUDENT', s.name)) === clean);
    }
    if (role === 'FACULTY') {
        return staffDirectory.some(s => buildGeneratedUsername('FACULTY', s.name) === clean);
    }
    return false;
}

function usernameRuleText(role) {
    if (role === 'ADMIN') return `Admin username is fixed: "${ADMIN_USERNAME}". Initial password: "${ADMIN_INITIAL_PASSWORD}".`;
    const config = AUTH_CONFIG[role];
    return `${role} username = "${config.prefix}" + first 4 letters of first name + last name initial + 012345. Example: ${config.example}.`;
}

function openLoginForm(role) {
    const config = AUTH_CONFIG[role];
    document.getElementById('selectedLoginRole').value = role;
    document.getElementById('loginRoleBadge').innerText = role;
    document.getElementById('loginTitle').innerText = config.title;
    document.getElementById('loginHint').innerText = usernameRuleText(role);
    document.getElementById('usernameRule').innerText = `Example: ${config.example}`;
    document.getElementById('loginUsername').placeholder = config.example;
    document.getElementById('loginIcon').innerHTML =
        `<i class="fa-solid ${config.icon}"></i>`;

    document.getElementById('roleSelection').classList.add('login-hidden');
    document.getElementById('loginFormPanel').classList.remove('login-hidden');
    document.getElementById('loginUsername').focus();
}

function backToRoleSelection() {
    document.getElementById('loginFormPanel').classList.add('login-hidden');
    document.getElementById('roleSelection').classList.remove('login-hidden');
    document.getElementById('roleLoginForm').reset();
}

function toggleLoginPassword() {
    const input = document.getElementById('loginPassword');
    const icon = document.getElementById('loginPasswordEye');
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.className = input.type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
}

function handleRoleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('selectedLoginRole').value;
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!isLowercaseAlnum(username) || !isLowercaseAlnum(password)) {
        alert('Username and password can contain only lowercase letters and numbers.');
        return;
    }
    if (!isValidUsername(role, username)) {
        alert(`Invalid ${role.toLowerCase()} username.\n${usernameRuleText(role)}`);
        return;
    }
    const expectedPassword = getStoredPassword(username);
    if (!expectedPassword || password !== expectedPassword) {
        alert('Invalid password. Use Forgot Password or Account Settings to set a new password.');
        return;
    }

    currentUserRole = role;
    localStorage.setItem('sece_logged_in_user', username);
    localStorage.setItem('sece_logged_in_role', role);

    if (role === 'ADMIN') {
        window.location.href = '/admin';
    } else if (role === 'FACULTY') {
        window.location.href = '/faculty';
    } else {
        window.location.href = '/student';
    }
}

function logoutUser() {
    localStorage.removeItem('sece_logged_in_user');
    localStorage.removeItem('sece_logged_in_role');
    currentUserRole = null;
    window.location.href = '/login';
}

// =========================
// ACCOUNT SETTINGS: change username / password after login
// =========================
function openAccountSettingsModal() {
    const username = localStorage.getItem('sece_logged_in_user') || '';
    const role = currentUserRole;
    document.getElementById('asCurrentUsername').innerText = username || '-';
    document.getElementById('asUsernameHint').innerText =
        role === 'ADMIN' ? 'Admin username is fixed and cannot be changed.' :
        'Username is fixed from the enrolled/staff name. Only the password can be changed.';
    const u = document.getElementById('asNewUsername');
    if (u) { u.value = ''; u.disabled = true; u.placeholder = 'Username cannot be changed'; }
    document.getElementById('accountSettingsForm').reset();
    new bootstrap.Modal(document.getElementById('accountSettingsModal')).show();
}

function handleAccountSettingsSubmit(e) {
    e.preventDefault();
    const username = localStorage.getItem('sece_logged_in_user');
    const role = currentUserRole;
    if (!username || !role) { alert('Please log in first.'); return; }

    const newPassword = document.getElementById('asNewPassword').value;
    const confirmPassword = document.getElementById('asConfirmPassword').value;
    if (!newPassword || !confirmPassword) { alert('Enter and confirm your new password.'); return; }
    if (!isLowercaseAlnum(newPassword) || !isLowercaseAlnum(confirmPassword)) {
        alert('Password can contain only lowercase letters and numbers.');
        return;
    }
    if (newPassword.length < 4) { alert('Password must be at least 4 characters.'); return; }
    if (newPassword !== confirmPassword) { alert('New passwords do not match.'); return; }

    localStorage.setItem('sece_password_' + username, newPassword);
    const modalEl = document.getElementById('accountSettingsModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    document.getElementById('accountSettingsForm').reset();
    showToast('Password Updated', 'Your new password has been saved successfully.');
}

function updateForgotPasswordHint() {
    const role = document.getElementById('fpUserType').value;
    const config = AUTH_CONFIG[role];
    document.getElementById('fpIdentifier').placeholder = config.example;
    document.getElementById('fpUsernameHint').innerText = usernameRuleText(role);
}

function openForgotPasswordForLogin() {
    const role = document.getElementById('selectedLoginRole').value || 'STUDENT';
    document.getElementById('fpUserType').value = role;
    updateForgotPasswordHint();
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

function restoreLoginSession() {
    const username = localStorage.getItem('sece_logged_in_user');
    const role = localStorage.getItem('sece_logged_in_role');

    if (username && role && isValidUsername(role, username) && getStoredPassword(username)) {
        currentUserRole = role;
        const currentRoleLabel = document.getElementById('currentRoleLabel');
        if (currentRoleLabel) currentRoleLabel.innerText = `Role: ${role}`;
        const usernameLabel = document.getElementById('loggedInUsernameLabel');
        if (usernameLabel) usernameLabel.innerText = `Username: ${username}`;
        
        // Don't redirect if we are already on a dashboard page
        if (window.location.pathname === '/login' || window.location.pathname === '/' || window.location.pathname === '/login.html') {
             if (role === 'ADMIN') window.location.href = '/admin';
             else if (role === 'FACULTY') window.location.href = '/faculty';
             else window.location.href = '/student';
        } else {
             switchRole(role, true);
        }
    } else {
        // If not logged in and not on login page, redirect to login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/login.html') {
             window.location.href = '/login';
        }
    }
}


// =========================
// PERSISTENT STUDENT ROSTER
// =========================
const STUDENT_STORAGE_KEY = 'sece_students_roster_v1';

function loadSavedStudents() {
    try {
        const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Unable to load saved students:', error);
        return [];
    }
}

function saveStudents() {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentsRoster));
}

function canManageStudents() {
    return currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY';
}

function ensureStudentManagementAccess() {
    if (!canManageStudents()) {
        alert('Access denied. Only Faculty and Admin can add or remove students.');
        return false;
    }
    return true;
}

function canManageSections() {
    return currentUserRole === 'ADMIN';
}

function ensureSectionManagementAccess() {
    if (!canManageSections()) {
        alert('Access denied. Only Admin can add or remove sections.');
        return false;
    }
    return true;
}

// Show/hide the Sections tab based on role: Admin only
function updateRosterPermissionsUI() {
    const sectionsTabItem = document.getElementById('sectionsTabItem');
    const sectionsNote = document.getElementById('sectionsAdminOnlyNote');
    if (!sectionsTabItem) return;
    const isAdmin = canManageSections();
    sectionsTabItem.classList.toggle('d-none', !isAdmin);
    if (sectionsNote) sectionsNote.classList.toggle('d-none', isAdmin);

    // If a non-admin somehow has the sections pane active, snap back to students tab
    if (!isAdmin) {
        const sectionsPane = document.getElementById('tabAddSection');
        const studentsPane = document.getElementById('tabStudents');
        const studentsTabBtn = document.querySelector('#rosterTabs button[data-bs-target="#tabStudents"]');
        if (sectionsPane && sectionsPane.classList.contains('active')) {
            sectionsPane.classList.remove('show', 'active');
            if (studentsPane) studentsPane.classList.add('show', 'active');
            if (studentsTabBtn) studentsTabBtn.classList.add('active');
        }
    }
}


function clearSavedStudents() {
    if (currentUserRole !== 'ADMIN') {
        alert('Only Admin can clear the saved student roster.');
        return;
    }
    if (!confirm('Delete all saved student records from this browser?')) return;
    studentsRoster = [];
    saveStudents();
    renderStudentsRoster();
    showToast('Student Records Cleared', 'All locally saved student records were removed.');
}

// System State
let currentUserRole = null; // Set only after successful login
let currentDept = 'CSE';
let currentSection = 'CSE_C';

// Official Data Extracted from Uploaded Schedule Image (II CSE C)
const DEFAULT_TIMETABLE_DATA = {
    'CSE_C': {
        'Monday': [
            { sub: 'SE', code: 'U23IT481', faculty: 'Dr.S.K.Harikarthick', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'AIML LAB', code: 'U23AM495', faculty: 'Dr.N.Saranya / Dr.M.Praveen', venue: 'Intel AI Lab', cat: 'cat-lab' },
            { sub: 'AIML LAB', code: 'U23AM495', faculty: 'Dr.N.Saranya / Dr.M.Praveen', venue: 'Intel AI Lab', cat: 'cat-lab' },
            { sub: 'JAVA', code: 'U23CS491', faculty: 'Mr.M.Karthickraja', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DAA', code: 'U23CS403', faculty: 'Mr.R.Karthick', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DM', code: 'U23MA204', faculty: 'Dr.N.Murugavelli', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'SE', code: 'U23IT481', faculty: 'Dr.S.K.Harikarthick', venue: 'SF 04', cat: 'cat-theory' }
        ],
        'Tuesday': [
            { sub: 'JAVA', code: 'U23CS491', faculty: 'Mr.M.Karthickraja', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DBMS', code: 'U23CS404', faculty: 'Ms.E.Saranya', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'AIML', code: 'U23AM495', faculty: 'Dr.N.Saranya', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'JAVA LAB', code: 'U23CS491', faculty: 'Mr.M.Karthickraja / Mr.B.Saravanan', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'JAVA LAB', code: 'U23CS491', faculty: 'Mr.M.Karthickraja / Mr.B.Saravanan', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'DM', code: 'U23MA204', faculty: 'Dr.N.Murugavelli', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'UHV', code: 'U23HV101', faculty: 'Dr.M.P.Sindhu', venue: 'SF 04', cat: 'cat-theory' }
        ],
        'Wednesday': [
            { sub: 'DAA', code: 'U23CS403', faculty: 'Mr.R.Karthick', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'SE LAB', code: 'U23IT481', faculty: 'Dr.S.K.Harikarthick / Mr.P.Arunprakash', venue: 'Intel AI Lab', cat: 'cat-lab' },
            { sub: 'SE LAB', code: 'U23IT481', faculty: 'Dr.S.K.Harikarthick / Mr.P.Arunprakash', venue: 'Intel AI Lab', cat: 'cat-lab' },
            { sub: 'ALT', code: 'U23EM753', faculty: 'Placement Team', venue: 'SF 05', cat: 'cat-alt' },
            { sub: 'ALT', code: 'U23EM753', faculty: 'Placement Team', venue: 'SF 05', cat: 'cat-alt' },
            { sub: 'COE', code: 'COE2026', faculty: 'Domain Experts', venue: 'COE Lab', cat: 'cat-project' },
            { sub: 'COE', code: 'COE2026', faculty: 'Domain Experts', venue: 'COE Lab', cat: 'cat-project' }
        ],
        'Thursday': [
            { sub: 'AIML', code: 'U23AM495', faculty: 'Dr.N.Saranya', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DAA LAB', code: 'U23CS453', faculty: 'Mr.R.Karthick / Ms.Rajeswari', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'DAA LAB', code: 'U23CS453', faculty: 'Mr.R.Karthick / Ms.Rajeswari', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'DM', code: 'U23MA204', faculty: 'Dr.N.Murugavelli', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'SS', code: 'U23SS101', faculty: 'Placement Team', venue: 'SF 04', cat: 'cat-alt' },
            { sub: 'DBMS LAB', code: 'U23CS454', faculty: 'Ms.E.Saranya / Dr.K.Suresh kumar', venue: 'Cloud & DevOps Lab', cat: 'cat-lab' },
            { sub: 'DBMS LAB', code: 'U23CS454', faculty: 'Ms.E.Saranya / Dr.K.Suresh kumar', venue: 'Cloud & DevOps Lab', cat: 'cat-lab' }
        ],
        'Friday': [
            { sub: 'DM', code: 'U23MA204', faculty: 'Dr.N.Murugavelli', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'LIB', code: 'LIB101', faculty: 'Librarian', venue: 'Library', cat: 'cat-theory' },
            { sub: 'JAVA', code: 'U23CS491', faculty: 'Mr.M.Karthickraja', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DAA LAB', code: 'U23CS453', faculty: 'Mr.R.Karthick / Ms.Rajeswari', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'DAA LAB', code: 'U23CS453', faculty: 'Mr.R.Karthick / Ms.Rajeswari', venue: 'Full Stack Lab', cat: 'cat-lab' },
            { sub: 'DM', code: 'U23MA204', faculty: 'Dr.N.Murugavelli', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'DBMS', code: 'U23CS404', faculty: 'Ms.E.Saranya', venue: 'SF 04', cat: 'cat-theory' }
        ],
        'Saturday': [
            { sub: 'DBMS', code: 'U23CS404', faculty: 'Ms.E.Saranya', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'JAVA PROJECT', code: 'U23CS491', faculty: 'Mr.M.Karthickraja', venue: 'Full Stack Lab', cat: 'cat-project' },
            { sub: 'JAVA PROJECT', code: 'U23CS491', faculty: 'Mr.M.Karthickraja', venue: 'Full Stack Lab', cat: 'cat-project' },
            { sub: 'DAA', code: 'U23CS403', faculty: 'Mr.R.Karthick', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'TWM', code: 'U23TWM01', faculty: 'Wellness Dept', venue: 'SF 04', cat: 'cat-theory' },
            { sub: 'AIML Project', code: 'U23AM495', faculty: 'Dr.N.Saranya', venue: 'Intel AI Lab', cat: 'cat-project' },
            { sub: 'AIML Project', code: 'U23AM495', faculty: 'Dr.N.Saranya', venue: 'Intel AI Lab', cat: 'cat-project' }
        ]
    }
};

// =========================
// PERSISTENT TIMETABLE EDITS
// =========================
const TIMETABLE_STORAGE_KEY = 'sece_timetable_edits_v1';

function loadSavedTimetable() {
    // Start from the built-in default schedule, then layer any saved edits on top.
    // Sections/days/periods that were never edited keep their original default data.
    const merged = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE_DATA));
    try {
        const saved = localStorage.getItem(TIMETABLE_STORAGE_KEY);
        if (!saved) return merged;
        const edits = JSON.parse(saved);
        Object.keys(edits).forEach(section => {
            if (!merged[section]) merged[section] = {};
            Object.keys(edits[section]).forEach(day => {
                if (!merged[section][day]) merged[section][day] = [];
                Object.keys(edits[section][day]).forEach(pIdx => {
                    merged[section][day][pIdx] = edits[section][day][pIdx];
                });
            });
        });
        return merged;
    } catch (error) {
        console.error('Unable to load saved timetable edits:', error);
        return merged;
    }
}

// Save only the single slot that changed, keyed by section/day/period,
// so each edit is stored independently and never overwrites unrelated slots.
function saveTimetableEdit(section, day, pIdx, slotData) {
    let edits = {};
    try {
        const saved = localStorage.getItem(TIMETABLE_STORAGE_KEY);
        if (saved) edits = JSON.parse(saved);
    } catch (error) {
        console.error('Unable to read existing timetable edits:', error);
    }
    if (!edits[section]) edits[section] = {};
    if (!edits[section][day]) edits[section][day] = {};
    edits[section][day][pIdx] = slotData;
    localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(edits));
    
    // API Integration: Persist override to MySQL backend
    fetch('/api/operations/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            section: section,
            day: day,
            periodIndex: pIdx,
            subject: slotData.subject || '',
            faculty: slotData.faculty || '',
            venue: slotData.venue || '',
            category: slotData.cat || ''
        })
    }).catch(err => console.error("API Sync failed", err));
}

// Course Incharge Reference List
const courseReferenceList = [
    { short: 'DM', code: 'U23MA204 Discrete Mathematics', faculty: 'Dr.N.Murugavelli, AP/Maths', venue: 'SF 04', cat: 'BS', credits: 4, hrs: '3+1*' },
    { short: 'DM-T', code: 'U23MA204 Discrete Mathematics (Tutorial)', faculty: 'Dr.M.P.Sindhu, AP/Maths', venue: 'SF 04', cat: 'BS', credits: '-', hrs: '1' },
    { short: 'DAA', code: 'U23CS403 Design and Analysis of Algorithms', faculty: 'Mr.R.Karthick, AP/CSE', venue: 'SF 04', cat: 'PC', credits: 3, hrs: '4' },
    { short: 'DBMS', code: 'U23CS404 Database Management Systems', faculty: 'Ms.E.Saranya, AP/CSE', venue: 'SF 04', cat: 'PC', credits: 3, hrs: '3' },
    { short: 'SE', code: 'U23IT481 Software Engineering', faculty: 'Dr.S.K.Harikarthick, ASP/CSE', venue: 'SF 04 / Intel AI Lab', cat: 'PC', credits: 3, hrs: '3+2' },
    { short: 'JAVA', code: 'U23CS491 Java Programming', faculty: 'Mr.M.Karthickraja, AP/CSE', venue: 'SF 04 / Full Stack Lab', cat: 'PC', credits: 4, hrs: '3+2' },
    { short: 'AIML', code: 'U23AM495 Artificial Intelligence & ML', faculty: 'Dr.N.Saranya, AP/CSE', venue: 'SF 04 / Intel AI Lab', cat: 'PC', credits: 4, hrs: '2+2+2' },
    { short: 'DAA LAB', code: 'U23CS453 DAA Laboratory', faculty: 'Mr.R.Karthick, AP/CSE & Ms.Rajeswari', venue: 'Full Stack Lab', cat: 'PC', credits: 2, hrs: '4' },
    { short: 'DBMS LAB', code: 'U23CS454 DBMS Laboratory', faculty: 'Ms.E.Saranya, AP/CSE & Dr.K.Suresh', venue: 'Cloud & DevOps Lab', cat: 'PC', credits: 1, hrs: '2' },
    { short: 'ALT', code: 'U23EM753 Advanced Logical Thinking', faculty: 'Placement Team', venue: 'SF 05', cat: 'EM', credits: 1, hrs: '2 (Wed 4,5)' }
];

// Sample Students Roster Data
let studentsRoster = loadSavedStudents();

// Active timetable data = default schedule + any saved edits from Admin/Faculty
let timetableData = loadSavedTimetable();

const SECTIONS_STORAGE_KEY = 'sece_sections_v2';
const RESOURCES_STORAGE_KEY = 'sece_admin_resources_v1';
const DEFAULT_SECTIONS = [
    { dept: 'CSE', name: 'II CSE C', classroom: 'SF 04', capacity: 61 },
    { dept: 'CSE', name: 'II CSE A', classroom: 'SF 02', capacity: 60 },
    { dept: 'CSE', name: 'II CSE B', classroom: 'SF 03', capacity: 60 },
    { dept: 'IT', name: 'II IT A', classroom: 'IT 101', capacity: 60 },
    { dept: 'AIDS', name: 'II AI&DS A', classroom: 'AI 201', capacity: 60 }
];
function loadSections() {
    try {
        const saved = JSON.parse(localStorage.getItem(SECTIONS_STORAGE_KEY));
        return Array.isArray(saved) ? saved : JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
    } catch (_) { return JSON.parse(JSON.stringify(DEFAULT_SECTIONS)); }
}
function saveSections() { localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(activeSections)); }
let activeSections = loadSections();

// Remove legacy Admin credentials from the old version.
localStorage.removeItem('sece_password_shiv');
localStorage.removeItem('sece_recovery_mobile_shiv');
localStorage.removeItem('sece_password_aashwk01');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderTimetableGrid();
    renderCourseRefTable();
    renderStudentsRoster();
    renderSectionsList();
    mergeCustomSubjectsIntoCourseList();
    populateEditSubjectSelect();
    populateEditVenueSelect();
    renderAdminResourcesUI();
    updateForgotPasswordHint();
    restoreLoginSession();
    updateRosterPermissionsUI();
    renderNotificationStatus();
    toggleSubstitutionUI();
    const facultyDetailsModalEl = document.getElementById('facultyDetailsModal');
    if (facultyDetailsModalEl) facultyDetailsModalEl.addEventListener('show.bs.modal', renderFacultyDetailsView);

    const substModalEl = document.getElementById('substitutionModal');
    if (substModalEl) {
        substModalEl.addEventListener('show.bs.modal', initSubstitutionModal);
    }
});

// =========================
// STAFF AVAILABILITY & PERIOD SUBSTITUTION
// =========================
const STAFF_STORAGE_KEY = 'sece_staff_directory_v1';
const SUBSTITUTION_STORAGE_KEY = 'sece_substitutions_v1';

const DEFAULT_STAFF_DIRECTORY = [
    { name: 'Dr.S.K.Harikarthick', dept: 'CSE', status: 'Available' },
    { name: 'Mr.M.Karthickraja', dept: 'CSE', status: 'Available' },
    { name: 'Dr.N.Saranya', dept: 'CSE', status: 'Available' },
    { name: 'Mr.R.Karthick', dept: 'CSE', status: 'Available' },
    { name: 'Ms.E.Saranya', dept: 'CSE', status: 'Available' },
    { name: 'Dr.N.Murugavelli', dept: 'CSE', status: 'Available' },
    { name: 'Dr.M.P.Sindhu', dept: 'CSE', status: 'Available' },
    { name: 'Mr.B.Saravanan', dept: 'CSE', status: 'Available' },
    { name: 'Mr.P.Arunprakash', dept: 'IT', status: 'Available' },
    { name: 'Ms.R.Rajeswari', dept: 'AI&DS', status: 'Available' },
    { name: 'Keerthika J', displayName: 'Ms.J.Keerthika', dept: 'CSE', status: 'Available', classAdvisorFor: 'II CSE C' }
];

const COVERAGE_REQUESTS_KEY = 'sece_coverage_requests_v1';
const LEAVE_STATE_KEY_PREFIX = 'sece_on_leave_';

// Returns the localStorage key tracking whether a given staff member is on leave today
function leaveStateKey(staffName) {
    return LEAVE_STATE_KEY_PREFIX + staffName.replace(/\s+/g, '_') + '_' + todayDateStr();
}

// Returns true if the given staff name is recorded as on leave today
function isStaffOnLeaveToday(staffName) {
    return localStorage.getItem(leaveStateKey(staffName)) === 'true';
}

// Staff availability directory + today's period substitutions + leave/coverage requests
// (initialized here, after their storage-key constants above, to avoid a
// temporal-dead-zone crash on page load)
let staffDirectory = loadStaffDirectory();
// Keep the known Class Advisor available even when an older localStorage staff list exists.
if (!staffDirectory.some(s => String(s.displayName || s.name).toLowerCase() === 'ms.j.keerthika' || buildGeneratedUsername('FACULTY', s.name) === 'fkeerj012345')) {
    staffDirectory.push({ name: 'Keerthika J', displayName: 'Ms.J.Keerthika', dept: 'CSE', status: 'Available', classAdvisorFor: 'II CSE C', personalEmail: '', collegeEmail: '' });
    saveStaffDirectory();
}
const CLASS_ADVISOR_ASSIGNMENTS = { 'adkeerj012345': 'II CSE C' };
let substitutions = loadSubstitutions();
let coverageRequests = loadCoverageRequests();

function loadStaffDirectory() {
    try {
        const saved = localStorage.getItem(STAFF_STORAGE_KEY);
        const data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_STAFF_DIRECTORY));
        return data.map(staff => ({ ...staff, personalEmail: staff.personalEmail || '', collegeEmail: staff.collegeEmail || '' }));
    } catch (error) {
        console.error('Unable to load staff directory:', error);
        return JSON.parse(JSON.stringify(DEFAULT_STAFF_DIRECTORY)).map(staff => ({ ...staff, personalEmail: '', collegeEmail: '' }));
    }
}

function saveStaffDirectory() {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffDirectory));
}

function loadSubstitutions() {
    try {
        const saved = localStorage.getItem(SUBSTITUTION_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Unable to load substitutions:', error);
        return {};
    }
}

function saveSubstitutions() {
    localStorage.setItem(SUBSTITUTION_STORAGE_KEY, JSON.stringify(substitutions));
}

function todayDateStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getTodayDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

function substitutionKey(dateStr, section, day, pIdx) {
    return `${dateStr}__${section}__${day}__${pIdx}`;
}

// Only returns a substitution if "day" is today's actual weekday AND the stored
// date is today's exact date — so it naturally stops applying tomorrow, and next
// week's occurrence of the same weekday is unaffected.
function getSubstitutionFor(section, day, pIdx) {
    if (day !== getTodayDayName()) return null;
    const key = substitutionKey(todayDateStr(), section, day, pIdx);
    return substitutions[key] || null;
}

function canManageSubstitutions() {
    return currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY';
}

function toggleSubstitutionUI() {
    const btn = document.getElementById('substitutionBtn');
    if (btn) btn.style.display = canManageSubstitutions() ? 'inline-flex' : 'none';
}

function renderStaffAvailability() {
    const tbody = document.getElementById('staffAvailabilityBody');
    if (!tbody) return;
    const canManage = canManageSubstitutions();
    const dateStr = todayDateStr();
    tbody.innerHTML = '';
    staffDirectory.forEach((staff, idx) => {
        const tr = document.createElement('tr');
        const dayKey = 'sece_staff_availability_' + dateStr;
        const daily = JSON.parse(localStorage.getItem(dayKey) || '{}');
        const isAvailable = daily[staff.name] !== false;
        const onLeave = isStaffOnLeaveToday(staff.name);

        // Status badge: green = available, red with ON LEAVE tag, grey = manually unavailable
        let statusBadge;
        if (isAvailable) {
            statusBadge = '<span class="badge bg-success">Available</span>';
        } else if (onLeave) {
            statusBadge = '<span class="badge bg-danger me-1">Unavailable</span><span class="badge bg-warning text-dark"><i class="fa-solid fa-house-medical me-1"></i>On Leave</span>';
        } else {
            statusBadge = '<span class="badge bg-secondary">Unavailable</span>';
        }

        tr.innerHTML = `
            <td>${staff.displayName || staff.name}</td>
            <td>${staff.dept}</td>
            <td>${statusBadge}</td>
            <td class="text-center">
                ${canManage ? `<button class="btn btn-sm ${isAvailable ? 'btn-outline-danger' : 'btn-outline-success'} py-0" onclick="toggleStaffAvailability(${idx})">
                    ${isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>` : '<span class="text-muted small">View only</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleStaffAvailability(idx) {
    if (!canManageSubstitutions()) {
        alert('Access denied. Only Faculty and Admin can update staff availability.');
        return;
    }
    const dayKey = 'sece_staff_availability_' + todayDateStr(); const daily = JSON.parse(localStorage.getItem(dayKey) || '{}'); daily[staffDirectory[idx].name] = !(daily[staffDirectory[idx].name] !== false); localStorage.setItem(dayKey, JSON.stringify(daily));
    renderStaffAvailability();
    populateSubstituteFacultyOptions();
}

// Fill the "Period to Cover" dropdown with today's periods for the currently viewed section
function populateSubPeriodOptions() {
    const select = document.getElementById('subPeriodSelect');
    if (!select) return;
    const todayName = getTodayDayName();
    document.getElementById('substTodayLabel').innerText = `${todayName}, ${todayDateStr()}`;
    document.getElementById('substSectionLabel').innerText = currentSection;

    select.innerHTML = '';
    const dayData = (timetableData[currentSection] || timetableData['CSE_C'])[todayName] || [];

    if (todayName === 'Sunday' || dayData.length === 0) {
        select.innerHTML = '<option value="">No periods scheduled today</option>';
        document.getElementById('subOriginalFaculty').value = '';
        return;
    }

    dayData.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.text = `Period ${idx + 1} — ${p.sub} (${p.faculty})`;
        select.appendChild(opt);
    });
    onSubPeriodChange();
}

function onSubPeriodChange() {
    const select = document.getElementById('subPeriodSelect');
    const pIdx = parseInt(select.value);
    if (isNaN(pIdx)) return;
    const todayName = getTodayDayName();
    const dayData = (timetableData[currentSection] || timetableData['CSE_C'])[todayName] || [];
    document.getElementById('subOriginalFaculty').value = dayData[pIdx] ? dayData[pIdx].faculty : '';
}

function populateSubstituteFacultyOptions() {
    const select = document.getElementById('subSubstituteFaculty');
    if (!select) return;
    const available = staffDirectory.filter(s => s.status === 'Available');
    select.innerHTML = available.length
        ? available.map(s => `<option value="${s.name}">${s.name} (${s.dept})</option>`).join('')
        : '<option value="">No staff currently marked Available</option>';
}

function handleArrangeSubstitution(e) {
    e.preventDefault();
    if (!canManageSubstitutions()) {
        alert('Access denied. Only Faculty and Admin can arrange substitutions.');
        return;
    }
    const todayName = getTodayDayName();
    if (todayName === 'Sunday') {
        alert('No classes scheduled on Sunday — nothing to substitute.');
        return;
    }
    const pIdx = parseInt(document.getElementById('subPeriodSelect').value);
    if (isNaN(pIdx)) {
        alert('Please select a valid period.');
        return;
    }
    const substituteFaculty = document.getElementById('subSubstituteFaculty').value;
    if (!substituteFaculty) {
        alert('Please select an available substitute staff member.');
        return;
    }
    const reason = document.getElementById('subReason').value;
    const originalFaculty = document.getElementById('subOriginalFaculty').value;

    const key = substitutionKey(todayDateStr(), currentSection, todayName, pIdx);
    substitutions[key] = {
        date: todayDateStr(),
        section: currentSection,
        day: todayName,
        pIdx: pIdx,
        originalFaculty: originalFaculty,
        substituteFaculty: substituteFaculty,
        reason: reason,
        assignedBy: localStorage.getItem('sece_logged_in_user') || currentUserRole,
        assignedAt: new Date().toISOString()
    };
    saveSubstitutions();

    renderTimetableGrid();
    renderTodaysSubstitutions();
    document.getElementById('arrangeSubForm').reset();
    populateSubPeriodOptions();
    populateSubstituteFacultyOptions();

    showToast('Substitute Assigned!', `${substituteFaculty} will cover Period ${pIdx + 1} today in place of ${originalFaculty}. Reverts automatically tomorrow.`);
}

function renderTodaysSubstitutions() {
    const list = document.getElementById('todaysSubstitutionsList');
    if (!list) return;
    const todayName = getTodayDayName();
    const dateStr = todayDateStr();
    const relevant = Object.entries(substitutions).filter(([key, s]) =>
        s.date === dateStr && s.section === currentSection && s.day === todayName
    );

    if (relevant.length === 0) {
        list.innerHTML = '<li class="list-group-item bg-dark text-muted small">No substitutions arranged for today in this section.</li>';
        return;
    }

    list.innerHTML = relevant.map(([key, s]) => `
        <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center small">
            <span>Period ${s.pIdx + 1}: <strong>${s.substituteFaculty}</strong> covering for ${s.originalFaculty}${s.reason ? ' — ' + s.reason : ''}</span>
            ${canManageSubstitutions() ? `<button class="btn btn-sm btn-outline-danger py-0" onclick="cancelSubstitution('${key}')">Cancel</button>` : ''}
        </li>
    `).join('');
}

function cancelSubstitution(key) {
    if (!canManageSubstitutions()) {
        alert('Access denied. Only Faculty and Admin can cancel substitutions.');
        return;
    }
    delete substitutions[key];
    saveSubstitutions();
    // If this substitution came from an accepted coverage request, reopen it
    if (coverageRequests[key] && coverageRequests[key].status === 'ACCEPTED') {
        coverageRequests[key].status = 'OPEN';
        coverageRequests[key].requestedBy = null;
        saveCoverageRequests();
        renderCoverageRequests();
    }
    renderTimetableGrid();
    renderTodaysSubstitutions();
    showToast('Substitution Cancelled', 'Reverted back to the original scheduled faculty for that period.');
}

// =========================
// STAFF LEAVE & REAL-TIME COVERAGE REQUESTS
// =========================
function loadCoverageRequests() {
    try {
        const saved = localStorage.getItem(COVERAGE_REQUESTS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Unable to load coverage requests:', error);
        return {};
    }
}

function saveCoverageRequests() {
    localStorage.setItem(COVERAGE_REQUESTS_KEY, JSON.stringify(coverageRequests));
}

// Scan every section's schedule for today and find every period this staff member teaches
function findTodaysPeriodsForStaff(staffName) {
    const todayName = getTodayDayName();
    const results = [];
    Object.keys(timetableData).forEach(section => {
        const dayData = timetableData[section] && timetableData[section][todayName];
        if (!dayData) return;
        dayData.forEach((p, pIdx) => {
            if (p && p.faculty === staffName) {
                results.push({ section, day: todayName, pIdx, subject: p.sub, venue: p.venue });
            }
        });
    });
    return results;
}

function getMyStaffIdentity() {
    const username = localStorage.getItem('sece_logged_in_user');
    if (!username) return null;
    return localStorage.getItem('sece_staff_identity_' + username.toLowerCase()) || null;
}

function setMyStaffIdentity(name) {
    const username = localStorage.getItem('sece_logged_in_user');
    if (!username) return;
    localStorage.setItem('sece_staff_identity_' + username.toLowerCase(), name);
}

function populateStaffIdentityDropdown() {
    const select = document.getElementById('myStaffIdentitySelect');
    if (!select) return;
    const saved = getMyStaffIdentity();
    select.innerHTML = '<option value="">-- Select your name --</option>' +
        staffDirectory.map(s => `<option value="${s.name}" ${s.name === saved ? 'selected' : ''}>${s.name} (${s.dept})</option>`).join('');
}

function onStaffIdentityChange() {
    const select = document.getElementById('myStaffIdentitySelect');
    if (select.value) setMyStaffIdentity(select.value);
    updateLeaveButtonState();
}

function markMyselfOnLeave() {
    if (!canManageSubstitutions()) {
        alert('Only Faculty and Admin can mark themselves on leave.');
        return;
    }
    const name = document.getElementById('myStaffIdentitySelect').value;
    if (!name) {
        alert('Please select which staff member you are first.');
        return;
    }
    setMyStaffIdentity(name);
    const reason = document.getElementById('leaveReasonInput').value || 'On Leave';

    // 1. Mark staff as Unavailable in the directory
    const staffIdx = staffDirectory.findIndex(s => s.name === name);
    if (staffIdx > -1) staffDirectory[staffIdx].status = 'Unavailable';
    saveStaffDirectory();

    // 2. Auto-mark Unavailable in the daily availability key (used by Staff Availability table)
    const dateStr = todayDateStr();
    const dayKey = 'sece_staff_availability_' + dateStr;
    const daily = JSON.parse(localStorage.getItem(dayKey) || '{}');
    daily[name] = false;
    localStorage.setItem(dayKey, JSON.stringify(daily));

    // 3. Save the per-staff leave state key so any tab / view can detect leave
    localStorage.setItem(leaveStateKey(name), 'true');

    // 4. Create coverage requests for every period this staff teaches today
    const periods = findTodaysPeriodsForStaff(name);
    const todayName = getTodayDayName();
    periods.forEach(p => {
        const key = substitutionKey(dateStr, p.section, p.day, p.pIdx);
        if (!coverageRequests[key] || coverageRequests[key].date !== dateStr) {
            coverageRequests[key] = {
                date: dateStr, section: p.section, day: p.day, pIdx: p.pIdx,
                subject: p.subject, venue: p.venue,
                absentStaff: name, reason: reason,
                status: 'OPEN', requestedBy: null,
                createdAt: new Date().toISOString()
            };
        }
    });
    saveCoverageRequests();

    // 5. Create Period Notification entries (source='leave') for each affected period
    //    so they appear in the Period Notifications modal for all roles
    const notifArr = purgeExpiredPeriodNotifications();
    // Remove any stale leave notifications for this staff today first
    const filtered = notifArr.filter(n => !(n.source === 'leave' && n.originalFaculty === name && n.date === dateStr));
    periods.forEach(p => {
        filtered.push({
            date: dateStr,
            day: p.day,
            period: p.pIdx + 1,
            section: p.section,
            originalFaculty: name,
            staff: '— (Coverage Needed)',
            reason: reason + ' — Period open for substitution.',
            source: 'leave'
        });
    });
    savePeriodNotifications(filtered);

    // 6. Re-render all affected panels
    renderStaffAvailability();
    populateSubstituteFacultyOptions();
    renderCoverageRequests();
    updateLeaveButtonState();
    document.getElementById('leaveReasonInput').value = '';

    showToast('Marked as On Leave',
        periods.length
            ? `${name} is on leave today. ${periods.length} period(s) flagged for coverage — other staff have been notified.`
            : `${name} is marked on leave today (no periods scheduled).`
    );
}

// Cancels an active leave for the currently selected staff member
function cancelMyLeave() {
    if (!canManageSubstitutions()) {
        alert('Only Faculty and Admin can cancel leave.');
        return;
    }
    const name = getMyStaffIdentity() || document.getElementById('myStaffIdentitySelect')?.value;
    if (!name) {
        alert('No staff identity found. Please select your name first.');
        return;
    }

    const dateStr = todayDateStr();

    // 1. Remove the leave state key
    localStorage.removeItem(leaveStateKey(name));

    // 2. Restore daily availability
    const dayKey = 'sece_staff_availability_' + dateStr;
    const daily = JSON.parse(localStorage.getItem(dayKey) || '{}');
    delete daily[name];
    localStorage.setItem(dayKey, JSON.stringify(daily));

    // 3. Restore staff directory status
    const staffIdx = staffDirectory.findIndex(s => s.name === name);
    if (staffIdx > -1) staffDirectory[staffIdx].status = 'Available';
    saveStaffDirectory();

    // 4. Remove OPEN coverage requests for this staff
    let removedCount = 0;
    Object.keys(coverageRequests).forEach(key => {
        const req = coverageRequests[key];
        if (req.absentStaff === name && req.date === dateStr && req.status === 'OPEN') {
            delete coverageRequests[key];
            removedCount++;
        }
    });
    saveCoverageRequests();

    // 5. Remove leave-sourced period notifications for this staff today
    const notifArr = purgeExpiredPeriodNotifications();
    const cleaned = notifArr.filter(n => !(n.source === 'leave' && n.originalFaculty === name && n.date === dateStr));
    savePeriodNotifications(cleaned);

    // 6. Re-render all panels
    renderStaffAvailability();
    populateSubstituteFacultyOptions();
    renderCoverageRequests();
    updateLeaveButtonState();

    showToast('Leave Cancelled',
        removedCount > 0
            ? `${name}'s leave has been cancelled. ${removedCount} open coverage request(s) removed.`
            : `${name}'s leave has been cancelled.`
    );
}

// Dynamically updates the leave action button group to show the correct button
// based on whether the currently-selected staff member is already on leave today
function updateLeaveButtonState() {
    const container = document.getElementById('leaveActionBtnGroup');
    if (!container) return;
    const name = getMyStaffIdentity() || document.getElementById('myStaffIdentitySelect')?.value;
    if (!name) {
        // No identity selected — show the default leave button
        container.innerHTML = `
            <button type="button" class="btn btn-sm btn-danger fw-bold"
                    onclick="markMyselfOnLeave()" id="markLeaveBtn">
                <i class="fa-solid fa-house-medical me-1"></i> I'm on Leave Today
            </button>`;
        return;
    }
    if (isStaffOnLeaveToday(name)) {
        // Staff is currently on leave — show Cancel Leave button
        container.innerHTML = `
            <span class="badge bg-danger me-2 align-self-center px-3 py-2">
                <i class="fa-solid fa-house-medical me-1"></i> On Leave Today
            </span>
            <button type="button" class="btn btn-sm btn-warning fw-bold"
                    onclick="cancelMyLeave()" id="cancelLeaveBtn">
                <i class="fa-solid fa-rotate-left me-1"></i> Cancel My Leave
            </button>`;
    } else {
        container.innerHTML = `
            <button type="button" class="btn btn-sm btn-danger fw-bold"
                    onclick="markMyselfOnLeave()" id="markLeaveBtn">
                <i class="fa-solid fa-house-medical me-1"></i> I'm on Leave Today
            </button>`;
    }
}

function requestToCover(key) {
    if (!canManageSubstitutions()) {
        alert('Only Faculty and Admin can request to cover a period.');
        return;
    }
    const myName = getMyStaffIdentity();
    if (!myName) {
        alert('Please select which staff member you are first, at the top of this tab.');
        return;
    }
    const req = coverageRequests[key];
    if (!req) return;
    if (req.absentStaff === myName) {
        alert('You cannot request to cover your own period.');
        return;
    }
    if (req.status !== 'OPEN') {
        alert('This period is no longer open for requests.');
        return;
    }
    req.status = 'REQUESTED';
    req.requestedBy = myName;
    req.requestedAt = new Date().toISOString();
    saveCoverageRequests();
    renderCoverageRequests();
    showToast('Request Sent', `Your request to cover ${req.subject} (Period ${req.pIdx + 1}, ${req.section}) was sent to ${req.absentStaff}. Waiting for their confirmation.`);
}

function respondToCoverageRequest(key, accept) {
    const req = coverageRequests[key];
    if (!req) return;
    const myName = getMyStaffIdentity();
    const isAdmin = currentUserRole === 'ADMIN';
    if (!isAdmin && myName !== req.absentStaff) {
        alert('Only the absent staff member (or Admin) can accept or decline this request.');
        return;
    }

    if (accept) {
        req.status = 'ACCEPTED';
        req.decidedAt = new Date().toISOString();

        const subKey = substitutionKey(req.date, req.section, req.day, req.pIdx);
        substitutions[subKey] = {
            date: req.date, section: req.section, day: req.day, pIdx: req.pIdx,
            originalFaculty: req.absentStaff, substituteFaculty: req.requestedBy,
            reason: req.reason,
            assignedBy: localStorage.getItem('sece_logged_in_user') || currentUserRole,
            assignedAt: new Date().toISOString()
        };
        saveSubstitutions();
        showToast('Coverage Accepted', `${req.requestedBy} will cover ${req.subject} (Period ${req.pIdx + 1}) today.`);
    } else {
        req.status = 'OPEN';
        req.requestedBy = null;
        req.declinedAt = new Date().toISOString();
        showToast('Coverage Declined', 'Request declined. The period is open for other staff to request again.');
    }
    saveCoverageRequests();
    renderCoverageRequests();
    renderTimetableGrid();
    renderTodaysSubstitutions();
}

function renderCoverageRequests() {
    const list = document.getElementById('coverageRequestsList');
    if (!list) return;
    const dateStr = todayDateStr();
    const myName = getMyStaffIdentity();
    const todays = Object.entries(coverageRequests).filter(([key, r]) => r.date === dateStr);

    if (todays.length === 0) {
        list.innerHTML = '<li class="list-group-item bg-dark text-muted small">No leave or coverage activity today.</li>';
        return;
    }

    list.innerHTML = todays.map(([key, r]) => {
        const isMyLeave = r.absentStaff === myName;
        const isAdmin = currentUserRole === 'ADMIN';
        let actions = '';
        if (r.status === 'OPEN' && !isMyLeave) {
            actions = `<button class="btn btn-sm btn-outline-success py-0" onclick="requestToCover('${key}')">Request to Cover</button>`;
        } else if (r.status === 'REQUESTED' && (isMyLeave || isAdmin)) {
            actions = `<button class="btn btn-sm btn-success py-0 me-1" onclick="respondToCoverageRequest('${key}', true)">Accept</button>
                       <button class="btn btn-sm btn-outline-danger py-0" onclick="respondToCoverageRequest('${key}', false)">Decline</button>`;
        }
        // If this is the absent staff's own leave entry and it's still OPEN, show Cancel Leave
        const cancelBtn = (isMyLeave && r.status === 'OPEN')
            ? `<button class="btn btn-sm btn-warning py-0 mt-1" onclick="cancelMyLeave()">
                   <i class="fa-solid fa-rotate-left me-1"></i>Cancel Leave
               </button>`
            : '';
        const statusBadge = {
            OPEN: '<span class="badge bg-warning text-dark">Open</span>',
            REQUESTED: `<span class="badge bg-info text-dark">Requested by ${r.requestedBy}</span>`,
            ACCEPTED: `<span class="badge bg-success">Covered by ${r.requestedBy}</span>`
        }[r.status] || '';
        // Highlight the row if it belongs to the currently-logged-in staff
        const rowHighlight = isMyLeave ? 'border-start border-3 border-warning' : '';
        return `<li class="list-group-item bg-dark text-white small ${rowHighlight}">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                    ${isMyLeave ? '<span class="badge bg-warning text-dark me-1">You</span>' : ''}
                    <strong>${r.absentStaff}</strong> is on leave — Period ${r.pIdx + 1} (${r.subject}), ${r.section}, ${r.venue}.
                    ${r.reason ? '<br><span class="text-muted">Reason: ' + r.reason + '</span>' : ''}
                </div>
                <div class="text-end">${statusBadge}<br>${actions}${cancelBtn}</div>
            </div>
        </li>`;
    }).join('');
}

// Real-time updates across browser tabs of the same origin: the 'storage' event
// fires automatically in every OTHER open tab whenever localStorage changes here.
window.addEventListener('storage', (e) => {
    if (!currentUserRole) return;

    if (e.key === COVERAGE_REQUESTS_KEY) {
        const oldData = coverageRequests;
        const newData = loadCoverageRequests();
        const myName = getMyStaffIdentity();

        Object.keys(newData).forEach(key => {
            const oldReq = oldData[key];
            const newReq = newData[key];
            if (!oldReq && newReq && newReq.status === 'OPEN') {
                showToast('Staff Leave Alert', `${newReq.absentStaff} is on leave today — Period ${newReq.pIdx + 1} (${newReq.subject}), ${newReq.section} needs coverage.`);
            } else if (oldReq && newReq && oldReq.status !== newReq.status) {
                if (newReq.status === 'REQUESTED' && newReq.absentStaff === myName) {
                    showToast('Coverage Request Received', `${newReq.requestedBy} wants to cover your Period ${newReq.pIdx + 1} (${newReq.subject}) today. Please accept or decline.`);
                } else if (newReq.status === 'ACCEPTED' && newReq.requestedBy === myName) {
                    showToast('Request Accepted!', `You're confirmed to cover Period ${newReq.pIdx + 1} (${newReq.subject}), ${newReq.section} today.`);
                } else if (newReq.status === 'OPEN' && oldReq.status === 'REQUESTED' && oldReq.requestedBy === myName) {
                    showToast('Request Declined', `Your request to cover Period ${newReq.pIdx + 1} was declined.`);
                }
            }
        });

        coverageRequests = newData;
        renderCoverageRequests();
    }

    if (e.key === STAFF_STORAGE_KEY) {
        staffDirectory = loadStaffDirectory();
        renderStaffAvailability();
        populateSubstituteFacultyOptions();
        populateStaffIdentityDropdown();
    }

    if (e.key === SUBSTITUTION_STORAGE_KEY) {
        substitutions = loadSubstitutions();
        renderTimetableGrid();
        renderTodaysSubstitutions();
    }
});

function initSubstitutionModal() {
    renderStaffAvailability();
    populateSubstituteFacultyOptions();
    populateSubPeriodOptions();
    renderTodaysSubstitutions();
    populateStaffIdentityDropdown();
    renderCoverageRequests();
    updateLeaveButtonState();
}

function renderTimetableGrid() {
    const tbody = document.getElementById('ttGridBody');
    tbody.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = timetableData[currentSection] || timetableData['CSE_C'];

    days.forEach(day => {
        const tr = document.createElement('tr');
        
        // Day header cell
        const dayTd = document.createElement('td');
        dayTd.className = 'fw-bold bg-dark text-info text-center align-middle';
        dayTd.style.fontSize = '0.8rem';
        dayTd.innerHTML = `${day}`;
        tr.appendChild(dayTd);

        const periods = data[day] || Array(7).fill({ sub: 'FREE', code: '-', faculty: '-', venue: '-', cat: 'cat-theory' });

        // Period 1
        tr.appendChild(createCell(day, 0, periods[0]));
        // Period 2
        tr.appendChild(createCell(day, 1, periods[1]));
        // Period 3
        tr.appendChild(createCell(day, 2, periods[2]));

        // Tea Break Cell
        if (day === 'Monday') {
            const teaTd = document.createElement('td');
            teaTd.className = 'tt-break-cell align-middle';
            teaTd.rowSpan = 6;
            teaTd.innerText = 'TEA BREAK (11.15 - 11.35 AM)';
            tr.appendChild(teaTd);
        }

        // Period 4
        tr.appendChild(createCell(day, 3, periods[3]));
        // Period 5
        tr.appendChild(createCell(day, 4, periods[4]));

        // Lunch Break Cell
        if (day === 'Monday') {
            const lunchTd = document.createElement('td');
            lunchTd.className = 'tt-break-cell align-middle';
            lunchTd.rowSpan = 6;
            lunchTd.innerText = 'LUNCH BREAK (01.15 - 02.00 PM)';
            tr.appendChild(lunchTd);
        }

        // Activity Hour Cell
        const actTd = document.createElement('td');
        actTd.className = 'align-middle text-center bg-dark text-muted font-mono';
        actTd.style.fontSize = '0.65rem';
        actTd.innerText = 'Activity';
        tr.appendChild(actTd);

        // Period 6
        tr.appendChild(createCell(day, 5, periods[5]));
        // Period 7
        tr.appendChild(createCell(day, 6, periods[6]));

        tbody.appendChild(tr);
    });
}

// Helper to Create Period Cell
function createCell(day, pIdx, pData) {
    const td = document.createElement('td');
    const isEditable = (currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY');
    const sub = getSubstitutionFor(currentSection, day, pIdx);

    td.className = `${pData.cat || 'cat-theory'} ${isEditable ? 'editable-cell' : ''} ${sub ? 'substituted-cell' : ''}`;

    if (sub && currentUserRole !== 'STUDENT') {
        td.innerHTML = `
            <span class="slot-badge">${pData.sub}</span>
            <span class="slot-subtext">${sub.substituteFaculty}</span>
            <span class="slot-venue">${pData.venue}</span>
            <span class="substituted-badge">Substitute — Today Only</span>
        `;
    } else {
        td.innerHTML = `
            <span class="slot-badge">${pData.sub}</span>
            <span class="slot-subtext">${pData.faculty}</span>
            <span class="slot-venue">${pData.venue}</span>
        `;
    }

    if (isEditable) {
        // Editing still targets the original recurring slot, not today's one-off substitute
        td.onclick = () => openEditPeriodModal(day, pIdx, pData);
    }

    return td;
}

// Admin-only: clear all saved timetable edits and go back to the original default schedule
function resetTimetableEdits() {
    if (currentUserRole !== 'ADMIN') {
        alert('Only Admin can reset the timetable to defaults.');
        return;
    }
    if (!confirm('This will permanently discard all saved period edits (for every section) and restore the original default schedule. Continue?')) return;
    localStorage.removeItem(TIMETABLE_STORAGE_KEY);
    timetableData = loadSavedTimetable();
    renderTimetableGrid();
    showToast('Timetable Reset', 'All saved edits cleared. Showing the original default schedule.');
}

// Render Course Reference Table
function renderCourseRefTable() {
    const tbody = document.getElementById('courseRefBody');
    tbody.innerHTML = '';

    courseReferenceList.forEach(item => {
        const tr = document.createElement('tr');
        if (item.short === 'ALT') tr.className = 'table-warning text-dark font-semibold';

        tr.innerHTML = `
            <td><strong class="text-info">${item.short}</strong></td>
            <td>${item.code}</td>
            <td>${item.faculty}</td>
            <td><span class="badge bg-secondary">${item.venue}</span></td>
            <td>${item.cat}</td>
            <td>${item.credits}</td>
            <td>${item.hrs}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Role Switcher Handler
function switchRole(role, silent = false) {
    if (!currentUserRole && !silent) return;
    // Role switching from the header is disabled as an authentication bypass.
    if (!silent && role !== currentUserRole) {
        showToast('Access Denied', 'Please log out and sign in with the required account type.');
        return;
    }
    currentUserRole = role;
    document.body.classList.toggle('student-view', role === 'STUDENT');
    document.getElementById('currentRoleLabel').innerText = `Role: ${role}`;
    
    const bannerText = document.getElementById('roleBannerText');
    const rosterBtn = document.getElementById('manageRosterBtn');
    // Update UI based on Role for Student Details option
    const detailsBtn = document.getElementById('studentDetailsOnlyBtn');
    if (detailsBtn) {
        // Show only in Admin (or Class Advisor view will handle it separately)
        detailsBtn.classList.toggle('d-none', role !== 'ADMIN');
    }

    // Removed from visible Admin/Faculty UI; Class Advisor View is the replacement.
    if (rosterBtn) rosterBtn.style.display = 'none';

    if (role === 'ADMIN') {
        bannerText.innerHTML = `Logged in as <strong>ADMIN</strong>. Full permission enabled: Edit periods and manage subjects/classes/venues.`;
        rosterBtn.style.display = 'none';
    } else if (role === 'FACULTY') {
        bannerText.innerHTML = `Logged in as <strong>FACULTY</strong>. You have period editing privileges and Class Advisor access where assigned.`;
        rosterBtn.style.display = 'none';
    } else {
        bannerText.innerHTML = `Logged in as <strong>STUDENT</strong>. View mode active. Your email and full contact numbers are hidden from student view.`;
        rosterBtn.style.display = 'none';
    }

    renderTimetableGrid();
    renderStudentsRoster();
    updateRosterPermissionsUI();
    renderNotificationStatus();
    toggleSubstitutionUI();
    const resetBtn = document.getElementById('resetTimetableBtn');
    if (resetBtn) resetBtn.classList.toggle('d-none', role !== 'ADMIN');
    const resourceBtn = document.getElementById('manageResourcesBtn'); if (resourceBtn) resourceBtn.style.display = role === 'ADMIN' ? 'inline-flex' : 'none';
    const studentNotifBtn = document.getElementById('studentDayNotificationBtn'); if (studentNotifBtn) studentNotifBtn.style.display = role === 'STUDENT' ? 'inline-flex' : 'none';
    const notifAdminForm = document.getElementById('periodNotificationAdminForm'); if (notifAdminForm) notifAdminForm.classList.toggle('d-none', !(role === 'ADMIN' || role === 'FACULTY'));
    const subBtn = document.getElementById('substitutionBtn'); if (subBtn) subBtn.style.display = role === 'STUDENT' ? 'none' : 'inline-flex';
    const resourcesBtn = document.getElementById('manageResourcesBtn');
    if (resourcesBtn) resourcesBtn.style.display = role === 'ADMIN' ? 'inline-flex' : 'none';
    const profileBtn = document.getElementById('studentProfileBtn');
    if (profileBtn) profileBtn.style.display = role === 'STUDENT' ? 'inline-flex' : 'none';
    const facultyDetailsBtn = document.getElementById('facultyDetailsBtn');
    if (facultyDetailsBtn) {
        facultyDetailsBtn.classList.toggle('d-none', role !== 'FACULTY' && role !== 'ADMIN');
        facultyDetailsBtn.classList.toggle('d-flex', role === 'FACULTY' || role === 'ADMIN');
    }
    const studentDetailsBtn = document.getElementById('studentDetailsBtn');
    if (studentDetailsBtn) {
        studentDetailsBtn.classList.toggle('d-none', role !== 'STUDENT');
        studentDetailsBtn.classList.toggle('d-flex', role === 'STUDENT');
    }

    // STUDENT VIEW: hide all management controls without changing their functionality for Admin/Faculty.
    const adminResourceBtn = document.getElementById('manageResourcesBtn');
    const rosterManageBtn = document.getElementById('manageRosterBtn');
    const resourcesModal = document.getElementById('adminResourcesModal');
    const rosterModal = document.getElementById('manageRosterModal');
    if (adminResourceBtn) adminResourceBtn.classList.toggle('d-none', role !== 'ADMIN');
    // The old generic student-detail/roster option is intentionally removed from Admin and Faculty views.
    if (rosterManageBtn) { rosterManageBtn.classList.add('d-none'); rosterManageBtn.style.display = 'none'; }
    if (resourcesModal) resourcesModal.setAttribute('aria-hidden', role !== 'ADMIN' ? 'true' : 'false');
    if (rosterModal) rosterModal.setAttribute('aria-hidden', 'true');
    const advisorBtn = document.getElementById('classAdvisorBtn');
    if (advisorBtn) advisorBtn.classList.toggle('d-none', role !== 'FACULTY');

    // Keep the student notification button visible only for Students.
    const studentNotificationBtn = document.getElementById('studentDayNotificationBtn');
    if (studentNotificationBtn) studentNotificationBtn.classList.toggle('d-none', role !== 'STUDENT');

    // Staff substitution/coverage is never exposed in Student view.
    const staffSubstitutionBtn = document.getElementById('substitutionBtn');
    if (staffSubstitutionBtn) staffSubstitutionBtn.classList.toggle('d-none', role === 'STUDENT');
    renderAdminResourcesUI();
    if (!silent) showToast(`Role switched to ${role}`, `Permissions updated for ${role} access.`);
}

// Open Edit Period Modal
function openEditPeriodModal(day, pIdx, pData) {
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'FACULTY') {
        alert('Student view is read-only.');
        return;
    }
    document.getElementById('editDay').value = day;
    document.getElementById('editPeriod').value = pIdx;
    document.getElementById('editSlotLabel').value = `${day} - Period ${pIdx + 1}`;
    
    document.getElementById('editSubjectSelect').value = pData.sub || 'SE';
    document.getElementById('editFaculty').value = pData.faculty || 'Dr.S.K.Harikarthick, ASP/CSE';
    document.getElementById('editVenue').value = pData.venue || 'SF 04';
    document.getElementById('editCategory').value = pData.cat || 'cat-theory';

    const modal = new bootstrap.Modal(document.getElementById('editPeriodModal'));
    modal.show();
}

// Subject Select Auto-fill helper
function onSubjectSelectChange() {
    const sub = document.getElementById('editSubjectSelect').value;
    const ref = courseReferenceList.find(c => c.short === sub);
    if (ref) {
        document.getElementById('editFaculty').value = ref.faculty;
        document.getElementById('editVenue').value = ref.venue || '';
        if (sub === 'ALT') {
            document.getElementById('editCategory').value = 'cat-alt';
        } else if (sub.includes('LAB')) {
            document.getElementById('editCategory').value = 'cat-lab';
        }
    }
}

// Set Quick Wednesday ALT
function setAsWednesdayALT() {
    document.getElementById('editSubjectSelect').value = 'ALT';
    document.getElementById('editFaculty').value = 'Placement Team';
    document.getElementById('editVenue').value = 'SF 05';
    document.getElementById('editCategory').value = 'cat-alt';
}

// Save Period Changes
function savePeriodChanges() {
    const day = document.getElementById('editDay').value;
    const pIdx = parseInt(document.getElementById('editPeriod').value);
    
    const sub = document.getElementById('editSubjectSelect').value;
    const faculty = document.getElementById('editFaculty').value;
    const venue = document.getElementById('editVenue').value;
    const cat = document.getElementById('editCategory').value;

    if (!timetableData[currentSection]) {
        // Deep-clone so a new section doesn't share (and later corrupt) CSE_C's data
        timetableData[currentSection] = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE_DATA['CSE_C']));
    }
    const originalSlot = timetableData[currentSection][day] && timetableData[currentSection][day][pIdx]
        ? JSON.parse(JSON.stringify(timetableData[currentSection][day][pIdx])) : null;
    const updatedSlot = { sub, faculty, venue, cat, code: 'MODIFIED' };
    timetableData[currentSection][day][pIdx] = updatedSlot;

    // Persist just this slot — every other saved edit stays untouched
    saveTimetableEdit(currentSection, day, pIdx, updatedSlot);
    // Notify students only when the faculty assignment actually changes.
    createFacultyChangeNotification(day, pIdx, originalSlot, updatedSlot, currentSection);

    renderTimetableGrid();
    
    const modalEl = document.getElementById('editPeriodModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    showToast('Period Updated & Saved!', `Updated ${day} Period ${pIdx + 1} to ${sub} (${faculty}, ${venue}). Saved — will still show this when you relogin. SMS notification sent to ${studentsRoster.length} students.`);
}

// Quick Wednesday ALT Preset
function quickAssignWednesdayALT() {
    if (!timetableData['CSE_C']) return;
    // Wednesday Period 4 (index 3) and Period 5 (index 4)
    const altSlot = { sub: 'ALT', code: 'U23EM753', faculty: 'Placement Team', venue: 'SF 05', cat: 'cat-alt' };
    timetableData['CSE_C']['Wednesday'][3] = altSlot;
    timetableData['CSE_C']['Wednesday'][4] = altSlot;
    saveTimetableEdit('CSE_C', 'Wednesday', 3, altSlot);
    saveTimetableEdit('CSE_C', 'Wednesday', 4, altSlot);
    
    renderTimetableGrid();
    showToast('Placement ALT Assigned!', 'Wednesday 4th & 5th Periods successfully set to Advanced Logical Thinking (Placement Team - SF 05).');
}

// Filter Change Handler
function onFilterChange() {
    currentDept = document.getElementById('deptSelect').value;
    currentSection = document.getElementById('sectionSelect').value;
    
    document.getElementById('ttTitleHeader').innerText = `Class Timetable - Academic Schedule (${currentDept} - ${currentSection})`;
    renderTimetableGrid();
}

// Manage Students & Sections Roster Handlers
function currentStudentRecord() {
    const username = localStorage.getItem('sece_logged_in_user');
    if (!username) return null;
    return studentsRoster.find(s => (s.username || buildGeneratedUsername('STUDENT', s.name)) === username) || null;
}

function maskStudentPhone(phone) {
    const digits = safetyNormalizePhone(phone);
    return digits ? digits.slice(-4) : '-';
}

function renderStudentsRoster() {
    const tbody = document.getElementById('studentRosterBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const canManage = canManageStudents();
    const isStudent = currentUserRole === 'STUDENT';

    const visibleStudents = isStudent ? (currentStudentRecord() ? [currentStudentRecord()] : []) : studentsRoster;
    const rosterCountEl = document.getElementById('rosterCount');
    if (rosterCountEl) rosterCountEl.innerText = isStudent ? visibleStudents.length : studentsRoster.length;
    const strengthBadge = document.getElementById('classStrengthBadge');
    if (strengthBadge && !isStudent) strengthBadge.innerText = `${studentsRoster.length} Students`;

    const table = tbody.closest('table');
    const thead = table ? table.querySelector('thead tr') : null;
    if (thead) {
        thead.innerHTML = isStudent
            ? '<th>Roll No</th><th>Name</th><th>Department & Sec</th><th>Mobile</th><th>Parent Mobile 1</th><th>Parent Mobile 2</th>'
            : currentUserRole === 'ADMIN' ? '<th>Roll No</th><th>Name</th><th>Department & Sec</th><th>Username</th><th>Password</th><th>Personal Email</th><th>College Mail ID</th><th>Phone</th><th>Parent 1</th><th>Parent 2</th><th class="text-center">Action</th>' : '<th>Roll No</th><th>Name</th><th>Department & Sec</th><th>Username</th><th>Personal Email</th><th>College Mail ID</th><th>Phone</th><th>Parent 1</th><th>Parent 2</th><th class="text-center">Action</th>';
    }

    if (visibleStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${isStudent ? 6 : (currentUserRole === 'ADMIN' ? 11 : 10)}" class="text-center text-muted py-3">${
            isStudent ? 'Your enrolled student profile was not found.' : 'No students saved yet. Use "Add New Student" above to enroll one.'
        }</td></tr>`;
    }

    visibleStudents.forEach((s, idx) => {
        const username = s.username || buildGeneratedUsername('STUDENT', s.name);
        const tr = document.createElement('tr');
        if (isStudent) {
            tr.innerHTML = `
                <td><strong class="text-info">${s.roll || '-'}</strong></td>
                <td>${s.name || '-'}</td>
                <td>${s.sec || '-'}</td>
                <td>${maskStudentPhone(s.phone)}</td>
                <td>${maskStudentPhone(s.parentPhone1)}</td>
                <td>${maskStudentPhone(s.parentPhone2)}</td>`;
        } else {
            const actualIdx = studentsRoster.indexOf(s);
            tr.innerHTML = `
                <td><strong class="text-info">${s.roll || '-'}</strong></td>
                <td>${s.name || '-'}</td>
                <td>${s.sec || '-'}</td>
                <td>${username}</td>
                ${currentUserRole === 'ADMIN' ? `<td><code class="text-warning">${getStoredPassword(username) || buildGeneratedPassword('STUDENT', username)}</code></td>` : ''}
                <td>${s.email || '-'}</td>
                <td>${s.collegeEmail || '-'}</td>
                <td>${s.phone || '-'}</td>
                <td>${s.parentPhone1 || '-'}</td>
                <td>${s.parentPhone2 || '-'}</td>
                <td>${canManage ? `<button class="btn btn-sm btn-outline-danger" onclick="removeStudent(${actualIdx})"><i class="fa-solid fa-trash"></i></button>` : '<span class="badge bg-secondary">View Only</span>'}</td>`;
        }
        tbody.appendChild(tr);
    });


    const addBtn = document.getElementById('addStudentBtn');
    if (addBtn) addBtn.classList.toggle('d-none', !canManage);
    const managementNote = document.getElementById('studentManagementNote');
    if (managementNote) {
        managementNote.innerText = isStudent
            ? 'Student view: only your own profile is shown. Personal/college email and full mobile numbers are hidden.'
            : 'Faculty/Admin view: complete enrolled-student contact details are visible.';
    }
}

function saveFacultyEmail(index) {
    if (!(currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY')) {
        alert('Only Faculty and Admin can manage faculty email details.');
        return;
    }
    const staff = staffDirectory[index];
    if (!staff) return;
    const fu = buildGeneratedUsername('FACULTY', staff.name);
    const myUsername = String(localStorage.getItem('sece_logged_in_user') || '').toLowerCase();
    if (currentUserRole !== 'ADMIN' && fu !== myUsername) {
        alert('Faculty can update only their own email details.');
        return;
    }
    const personalEl = document.querySelector(`.faculty-personal-email[data-index=\"${index}\"]`);
    const collegeEl = document.querySelector(`.faculty-college-email[data-index=\"${index}\"]`);
    const personalEmail = personalEl ? personalEl.value.trim().toLowerCase() : '';
    const collegeEmail = collegeEl ? collegeEl.value.trim().toLowerCase() : '';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(personalEmail) || !emailRe.test(collegeEmail)) {
        alert('Both Personal Email and College Mail ID are compulsory and must be valid email addresses.');
        return;
    }
    staff.personalEmail = personalEmail;
    staff.collegeEmail = collegeEmail;
    saveStaffDirectory();
    renderStudentsRoster();
    showToast('Faculty Email Saved', `${staff.name} email details were saved successfully.`);
}

function toggleAddStudentForm() {
    const card = document.getElementById('addStudentCard');
    card.classList.toggle('d-none');
}

function handleAddStudent(e) {
    e.preventDefault();
    if (!ensureStudentManagementAccess()) return;

    const roll = document.getElementById('stdRoll').value.trim();
    const name = document.getElementById('stdName').value.trim();
    const sec = document.getElementById('stdSection').value;
    const email = document.getElementById('stdEmail').value.trim().toLowerCase();
    const collegeEmail = document.getElementById('stdCollegeEmail').value.trim().toLowerCase();
    const phone = safetyNormalizePhone(document.getElementById('stdPhone').value);
    const parentPhone1 = safetyNormalizePhone(document.getElementById('stdParentPhone1').value);
    const parentPhone2 = safetyNormalizePhone(document.getElementById('stdParentPhone2').value);

    if (!collegeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
        alert('College Mail ID is compulsory and must be a valid email address.');
        return;
    }
    if (!/^\d{10}$/.test(phone) || !/^\d{10}$/.test(parentPhone1)) {
        alert('Student mobile and Parent Mobile 1 must each contain exactly 10 digits.');
        return;
    }
    if (parentPhone2 && !/^\d{10}$/.test(parentPhone2)) {
        alert('Parent Mobile 2 must contain exactly 10 digits when provided.');
        return;
    }
    if (studentsRoster.some(s => String(s.roll).toLowerCase() === roll.toLowerCase())) {
        alert('That roll number is already enrolled.');
        return;
    }
    
    // Capacity Check
    const targetSection = activeSections.find(s => s.name === sec);
    const capacity = targetSection && targetSection.capacity ? parseInt(targetSection.capacity) : 80;
    const currentCount = studentsRoster.filter(s => s.sec === sec).length;
    if (currentCount >= capacity || currentCount >= 80) {
        alert(`Cannot add student. Section "${sec}" has reached its maximum capacity of ${Math.min(capacity, 80)}.`);
        return;
    }

    const username = buildGeneratedUsername('STUDENT', name);
    if (!username) {
        alert('Student name must contain a first name with at least 4 letters and a last-name initial.');
        return;
    }
    if (studentsRoster.some(s => (s.username || buildGeneratedUsername('STUDENT', s.name)) === username)) {
        alert(`Generated username "${username}" already exists. Use a different full name.`);
        return;
    }

    studentsRoster.push({ roll, name, sec, email, collegeEmail, phone, parentPhone1, parentPhone2, username });
    saveStudents();
    renderStudentsRoster();
    renderSectionsList();
    document.getElementById('addStudentForm').reset();
    toggleAddStudentForm();
    showToast('Student Enrolled & Saved!', `Added ${name}. Username: ${username}. Initial password: ${buildGeneratedPassword('STUDENT', username)}.`);
}

function removeStudent(idx) {
    if (!ensureStudentManagementAccess()) return;

    const removed = studentsRoster.splice(idx, 1)[0];
    saveStudents();
    renderStudentsRoster();
    showToast('Student Removed', `Removed ${removed.name} from section roster.`);
}

// Add / Remove Section
function populateSectionSelects() {
    const selects = [document.getElementById('sectionSelect'), document.getElementById('stdSection')];
    selects.forEach(select => {
        if (!select) return;
        const current = select.value;
        select.innerHTML = activeSections.map(s =>
            `<option value="${s.name.replace(/"/g, '&quot;')}">${s.name} [${s.classroom}]</option>`
        ).join('');
        if (activeSections.some(s => s.name === current)) select.value = current;
    });
}

function renderSectionsList() {
    const ul = document.getElementById('sectionsList');
    if (!ul) return;
    ul.innerHTML = '';
    activeSections.forEach((s, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center py-2';
        li.innerHTML = `
            <div><strong class="text-info">${s.name}</strong> <small class="text-muted">(${s.dept})</small>
            <br><small class="text-muted">Classroom: ${s.classroom}</small></div>
            <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeSection(${idx})"><i class="fa-solid fa-xmark"></i></button>`;
        ul.appendChild(li);
    });
    populateSectionSelects();
    renderAdminResourcesUI();
}

function handleAddSection(e) {
    e.preventDefault();
    if (!ensureSectionManagementAccess()) return;
    const dept = document.getElementById('secDept').value.trim();
    const name = document.getElementById('secName').value.trim();
    const classroom = document.getElementById('secClassroom').value.trim();
    const capacityInput = document.getElementById('secCapacity');
    const capacity = capacityInput ? parseInt(capacityInput.value) : 60;
    
    if (activeSections.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('That class/section already exists.');
        return;
    }
    activeSections.push({ dept, name, classroom, capacity });
    saveSections();
    renderSectionsList();
    document.getElementById('addSectionForm').reset();
    showToast('Section Created!', `Created ${name} in ${classroom}.`);
}

function removeSection(idx) {
    if (!ensureSectionManagementAccess()) return;
    const removed = activeSections.splice(idx, 1)[0];
    saveSections();
    renderSectionsList();
    showToast('Section Removed', `Section ${removed.name} removed.`);
}

function handleClassAdvisorLogin(e) {
    e.preventDefault();
    if (currentUserRole !== 'FACULTY') {
        alert('Class Advisor View is available only inside the Faculty view.');
        return;
    }
    const username = String(document.getElementById('advisorLoginUsername').value || '').trim().toLowerCase();
    const password = String(document.getElementById('advisorLoginPassword').value || '');
    const faculty = staffDirectory.find(s => buildClassAdvisorUsername(s.name) === username && s.classAdvisorFor);
    if (!faculty) {
        alert('Invalid Class Advisor username or this faculty member is not assigned as a Class Advisor.');
        return;
    }
    const assignedSection = String(faculty.classAdvisorFor || '').trim();
    if (!assignedSection || buildClassAdvisorPassword(username) !== password) {
        alert('Invalid Class Advisor username/password or advisor assignment.');
        return;
    }
    document.getElementById('classAdvisorLoginForm').reset();
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('classAdvisorLoginModal'));
    if (loginModal) loginModal.hide();
    renderClassAdvisorStudents(assignedSection, faculty);
    const viewModal = new bootstrap.Modal(document.getElementById('classAdvisorViewModal'));
    viewModal.show();
}

function renderClassAdvisorStudents(section, faculty) {
    const body = document.getElementById('classAdvisorStudentsBody');
    const subtitle = document.getElementById('classAdvisorViewSubtitle');
    if (!body || !subtitle) return;
    const students = studentsRoster.filter(s => String(s.sec || '').toLowerCase() === String(section || '').toLowerCase());
    subtitle.innerText = `${faculty.displayName || faculty.name} — Class Advisor for ${section}`;
    if (!students.length) {
        body.innerHTML = '<div class="alert alert-warning">No students are currently enrolled in this class.</div>';
        return;
    }
    body.innerHTML = `
        <div class="alert alert-info py-2 small">Only this Class Advisor's assigned class is shown. Full contact details are visible here; student passwords are never displayed.</div>
        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover align-middle small">
                <thead><tr><th>Roll No</th><th>Name</th><th>Class / Section</th><th>Personal Email</th><th>College Mail ID</th><th>Mobile</th><th>Parent Mobile 1</th><th>Parent Mobile 2</th><th>Username</th></tr></thead>
                <tbody>${students.map(s => {
                    const username = s.username || buildGeneratedUsername('STUDENT', s.name);
                    return `<tr><td>${s.roll || '-'}</td><td>${s.name || '-'}</td><td>${s.sec || '-'}</td><td>${s.email || '-'}</td><td>${s.collegeEmail || '-'}</td><td>${s.phone || '-'}</td><td>${s.parentPhone1 || '-'}</td><td>${s.parentPhone2 || '-'}</td><td><code>${username || '-'}</code></td></tr>`;
                }).join('')}</tbody>
            </table>
        </div>`;
}

function openStudentDetailsModal() {
    const body = document.getElementById('studentDetailsOnlyBody');
    if (!body) return;
    
    // Only Admin or Advisor should see this (in reality, Advisor triggers this from elsewhere or we allow it here if logic permits)
    if (currentUserRole !== 'ADMIN') {
        alert('Access denied. Only Admin can view full student details here.');
        return;
    }
    
    body.innerHTML = studentsRoster.map((s, i) => {
        const username = s.username || buildGeneratedUsername('STUDENT', s.name);
        const password = getStoredPassword(username) || 'Not Set';
        return `<tr>
            <td>${s.roll || '-'}</td>
            <td>${s.name || '-'}</td>
            <td>${s.sec || '-'}</td>
            <td>${s.email || '-'}</td>
            <td>${s.collegeEmail || '-'}</td>
            <td>${s.phone || '-'}</td>
            <td>${s.parentPhone1 || '-'}</td>
            <td>${s.parentPhone2 || '-'}</td>
            <td><code>${username || '-'}</code></td>
            <td><code>${password}</code></td>
            <td><button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeStudentDetails(${i})"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`;
    }).join('');
    
    const viewModal = new bootstrap.Modal(document.getElementById('studentDetailsOnlyModal'));
    viewModal.show();
}

function openAddStudentFromDetails() {
    // Hide the details modal and open the add student modal
    const viewModalEl = document.getElementById('studentDetailsOnlyModal');
    const viewModal = bootstrap.Modal.getInstance(viewModalEl);
    if (viewModal) viewModal.hide();
    
    // Open the manage roster modal and switch to the add student tab
    const rosterModal = new bootstrap.Modal(document.getElementById('manageRosterModal'));
    rosterModal.show();
    
    // Switch to Add Student tab automatically
    setTimeout(() => {
        const addStudentTab = document.querySelector('button[data-bs-target="#tabAddStudent"]');
        if (addStudentTab) {
            new bootstrap.Tab(addStudentTab).show();
        }
    }, 200);
}

function removeStudentDetails(idx) {
    if (!confirm('Are you sure you want to permanently delete this student?')) return;
    const removed = studentsRoster.splice(idx, 1)[0];
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentsRoster));
    showToast('Student Removed', `Student ${removed.name} has been deleted.`);
    openStudentDetailsModal(); // Refresh the list
    if (document.getElementById('manageRosterModal').classList.contains('show')) {
        renderStudentsRoster(); // Refresh roster if open
    }
}

function renderFacultyDetailsView() {
    if (currentUserRole !== 'FACULTY' && currentUserRole !== 'ADMIN') return;
    
    const body = document.getElementById('facultyDetailsBody');
    if (body) {
        const myUsername = String(localStorage.getItem('sece_logged_in_user') || '').toLowerCase();
        body.innerHTML = staffDirectory.map((staff, i) => {
            const fu = buildGeneratedUsername('FACULTY', staff.name);
            const canEdit = fu === myUsername;
            return `<tr>
                <td>${staff.displayName || staff.name || '-'}</td><td>${staff.dept || '-'}</td><td><code>${fu || '-'}</code></td>
                <td><input type="email" class="form-control form-control-sm bg-dark text-white border-secondary faculty-detail-personal" data-index="${i}" value="${staff.personalEmail || ''}" placeholder="personal@gmail.com" ${canEdit ? '' : 'disabled'}></td>
                <td><input type="email" class="form-control form-control-sm bg-dark text-white border-secondary faculty-detail-college" data-index="${i}" value="${staff.collegeEmail || ''}" placeholder="name@sece.ac.in" ${canEdit ? '' : 'disabled'}></td>
                <td>${canEdit ? `<button class="btn btn-sm btn-success" onclick="saveFacultyDetailsView(${i})">Save</button>` : '<span class="badge bg-secondary">View Only</span>'}</td>
            </tr>`;
        }).join('');
    }

    const credentialsPanel = document.getElementById('adminCredentialsPanel');
    if (credentialsPanel) credentialsPanel.classList.toggle('d-none', currentUserRole !== 'ADMIN');
    const facultyCredBody = document.getElementById('facultyCredentialsBody');
    if (facultyCredBody) {
        facultyCredBody.innerHTML = currentUserRole === 'ADMIN' ? staffDirectory.map(staff => {
            const fu = buildGeneratedUsername('FACULTY', staff.name);
            return `<tr><td>${staff.name}</td><td>${staff.dept || '-'}</td><td><code>${fu || '-'}</code></td><td><code class="text-warning">${fu ? (getStoredPassword(fu) || buildGeneratedPassword('FACULTY', fu)) : '-'}</code></td></tr>`;
        }).join('') : '';
    }

    const facultyEmailPanel = document.getElementById('facultyEmailDirectoryPanel');
    const facultyEmailBody = document.getElementById('facultyEmailDirectoryBody');
    if (facultyEmailPanel) facultyEmailPanel.classList.toggle('d-none', !(currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY'));
    if (facultyEmailBody && (currentUserRole === 'ADMIN' || currentUserRole === 'FACULTY')) {
        const myUsername = String(localStorage.getItem('sece_logged_in_user') || '').toLowerCase();
        facultyEmailBody.innerHTML = staffDirectory.map((staff, i) => {
            const fu = buildGeneratedUsername('FACULTY', staff.name);
            const canEdit = currentUserRole === 'ADMIN' || fu === myUsername;
            return `<tr>
                <td>${staff.name || '-'}</td><td>${staff.dept || '-'}</td><td><code>${fu || '-'}</code></td>
                <td><input type="email" class="form-control form-control-sm bg-dark text-white border-secondary faculty-personal-email" data-index="${i}" value="${staff.personalEmail || ''}" placeholder="personal@gmail.com" ${canEdit ? '' : 'disabled'}></td>
                <td><input type="email" class="form-control form-control-sm bg-dark text-white border-secondary faculty-college-email" data-index="${i}" value="${staff.collegeEmail || ''}" placeholder="name@sece.ac.in" ${canEdit ? '' : 'disabled'}></td>
                <td>${canEdit ? `<button class="btn btn-sm btn-success" onclick="saveFacultyEmail(${i})">Save</button>` : '<span class="badge bg-secondary">View Only</span>'}</td>
            </tr>`;
        }).join('');
    }
}

function saveFacultyDetailsView(index) {
    if (currentUserRole !== 'FACULTY') {
        alert('Faculty Details are available only in Faculty view.');
        return;
    }
    const staff = staffDirectory[index];
    if (!staff) return;
    const myUsername = String(localStorage.getItem('sece_logged_in_user') || '').toLowerCase();
    if (buildGeneratedUsername('FACULTY', staff.name) !== myUsername) {
        alert('You can update only your own faculty email details.');
        return;
    }
    const personalEl = document.querySelector(`.faculty-detail-personal[data-index="${index}"]`);
    const collegeEl = document.querySelector(`.faculty-detail-college[data-index="${index}"]`);
    const personalEmail = personalEl ? personalEl.value.trim().toLowerCase() : '';
    const collegeEmail = collegeEl ? collegeEl.value.trim().toLowerCase() : '';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(personalEmail) || !emailRe.test(collegeEmail)) {
        alert('Both Personal Email and College Mail ID are compulsory and must be valid email addresses.');
        return;
    }
    staff.personalEmail = personalEmail;
    staff.collegeEmail = collegeEmail;
    saveStaffDirectory();
    renderFacultyDetailsView();
    showToast('Faculty Details Saved', 'Your personal and college email details were saved successfully.');
}

function openStudentProfileModal() {
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'FACULTY' && currentUserRole !== 'STUDENT') { return; }
    
    if (currentUserRole !== 'STUDENT') { alert('This profile is available only to Student accounts.'); return; }
    const s = currentStudentRecord();
    const body = document.getElementById('studentProfileBody');
    if (!body) return;
    if (!s) {
        body.innerHTML = '<div class="alert alert-warning">Your enrolled student record could not be found.</div>';
    } else {
        body.innerHTML = `
            <div class="row g-2 small">
                <div class="col-6"><strong>Roll No:</strong><br>${s.roll || '-'}</div>
                <div class="col-6"><strong>Name:</strong><br>${s.name || '-'}</div>
                <div class="col-12"><strong>Section:</strong><br>${s.sec || '-'}</div>
                <div class="col-6"><strong>My Mobile:</strong><br>${maskStudentPhone(s.phone)}</div>
                <div class="col-6"><strong>Parent Mobile 1:</strong><br>${maskStudentPhone(s.parentPhone1)}</div>
                <div class="col-6"><strong>Parent Mobile 2:</strong><br>${maskStudentPhone(s.parentPhone2)}</div>
                <div class="col-12 text-muted mt-2">Email is hidden from Student view and is available only to Faculty/Admin.</div>
            </div>`;
    }
    new bootstrap.Modal(document.getElementById('studentProfileModal')).show();
}

// =========================
// ADMIN SUBJECT / CLASS / VENUE RESOURCES
// =========================
function adminOnly() {
    if (currentUserRole !== 'ADMIN') {
        alert('Access denied. Only Admin can manage subjects, classes and venues.');
        return false;
    }
    return true;
}

function loadAdminResources() {
    try {
        const saved = JSON.parse(localStorage.getItem(RESOURCES_STORAGE_KEY) || 'null');
        return saved && typeof saved === 'object' ? saved : { subjects: [], venues: [] };
    } catch (_) { return { subjects: [], venues: [] }; }
}
let adminResources = loadAdminResources();
function saveAdminResources() { localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(adminResources)); }

function mergeCustomSubjectsIntoCourseList() {
    adminResources.subjects.forEach(s => {
        if (!courseReferenceList.some(c => c.short === s.short)) {
            courseReferenceList.push({
                short: s.short, code: `${s.code} ${s.title}`, faculty: s.faculty,
                venue: s.venue || 'Not Assigned', cat: s.category || 'PC', credits: '-', hrs: '-'
            });
        }
    });
}

function renderAdminResourcesUI() {
    mergeCustomSubjectsIntoCourseList();
    const subList = document.getElementById('adminSubjectsList');
    const venueList = document.getElementById('adminVenuesList');
    const classList = document.getElementById('adminClassesList');
    if (subList) {
        subList.innerHTML = adminResources.subjects.length ? adminResources.subjects.map((s,i) =>
            `<tr><td>${s.short}</td><td>${s.code}</td><td>${s.title}</td><td>${s.faculty}</td><td><button class="btn btn-sm btn-outline-danger" onclick="removeAdminSubject(${i})">Remove</button></td></tr>`
        ).join('') : '<tr><td colspan="5" class="text-muted text-center">No custom subjects.</td></tr>';
    }
    if (venueList) {
        venueList.innerHTML = adminResources.venues.length ? adminResources.venues.map((v,i) =>
            `<div class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center"><span><strong>${v.name || v}</strong> <small class="text-muted">${v.type || ''} ${v.block ? '— Block ' + v.block : ''}${v.capacity ? ' — Capacity ' + v.capacity : ''}</small></span><button class="btn btn-sm btn-outline-danger" onclick="removeAdminVenue(${i})">Remove</button></div>`
        ).join('') : '<div class="list-group-item bg-dark text-muted border-secondary">No custom venues.</div>';
    }
    if (classList) {
        classList.innerHTML = activeSections.length ? activeSections.map((s,i) =>
            `<div class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                <span><strong>${s.name}</strong> <small class="text-muted">(${s.dept}) — ${s.classroom}${s.block ? ' — Block ' + s.block : ''}</small></span>
                <button class="btn btn-sm btn-outline-danger" onclick="removeSection(${i})">Remove</button>
            </div>`
        ).join('') : '<div class="list-group-item bg-dark text-muted border-secondary">No classes.</div>';
    }
    const resourceBtn = document.getElementById('manageResourcesBtn');
    if (resourceBtn) resourceBtn.style.display = currentUserRole === 'ADMIN' ? 'inline-flex' : 'none';
}

function handleAddSubject(e) {
    e.preventDefault();
    if (!adminOnly()) return;
    const short = document.getElementById('newSubjectShort').value.trim().toUpperCase();
    const code = document.getElementById('newSubjectCode').value.trim().toUpperCase();
    const title = document.getElementById('newSubjectTitle').value.trim();
    const faculty = document.getElementById('newSubjectFaculty').value.trim();
    const category = document.getElementById('newSubjectCategory').value;
    if (adminResources.subjects.some(s => s.short === short) || courseReferenceList.some(s => s.short === short)) {
        alert('That subject short name already exists.');
        return;
    }
    adminResources.subjects.push({ short, code, title, faculty, category, venue: '' });
    saveAdminResources();
    mergeCustomSubjectsIntoCourseList();
    renderAdminResourcesUI();
    renderCourseRefTable();
    populateEditSubjectSelect();
    document.getElementById('addSubjectForm').reset();
    showToast('Subject Added', `${short} - ${title} is now available in Edit Period.`);
}

function removeAdminSubject(idx) {
    if (!adminOnly()) return;
    const removed = adminResources.subjects.splice(idx, 1)[0];
    saveAdminResources();
    const ci = courseReferenceList.findIndex(c => c.short === removed.short);
    if (ci >= 0) courseReferenceList.splice(ci, 1);
    renderAdminResourcesUI();
    renderCourseRefTable();
    populateEditSubjectSelect();
    showToast('Subject Removed', `${removed.short} was removed from custom resources.`);
}

function handleAdminAddClass(e) {
    e.preventDefault();
    if (!adminOnly()) return;
    const dept = document.getElementById('adminClassDept').value.trim();
    const name = document.getElementById('adminClassName').value.trim();
    const classroom = document.getElementById('adminClassRoom').value.trim();
    const capacityInput = document.getElementById('adminClassCapacity');
    const capacity = capacityInput ? parseInt(capacityInput.value) : 60;
    
    if (activeSections.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('That class/section already exists.');
        return;
    }
    activeSections.push({ dept, name, classroom, capacity });
    saveSections();
    renderSectionsList();
    document.getElementById('adminClassForm').reset();
    showToast('Class Added', `${name} was saved.`);
}

function handleAddVenue(e) {
    e.preventDefault();
    if (!adminOnly()) return;
    const venue = document.getElementById('newVenueName').value.trim();
    if (!venue) return;
    if (adminResources.venues.some(v => v.toLowerCase() === venue.toLowerCase())) {
        alert('That venue already exists.');
        return;
    }
    adminResources.venues.push(venue);
    saveAdminResources();
    renderAdminResourcesUI();
    populateEditVenueSelect();
    document.getElementById('adminVenueForm').reset();
    showToast('Venue Added', `${venue} is now available in Edit Period.`);
}

function removeAdminVenue(idx) {
    if (!adminOnly()) return;
    const removed = adminResources.venues.splice(idx, 1)[0];
    saveAdminResources();
    renderAdminResourcesUI();
    populateEditVenueSelect();
    showToast('Venue Removed', `${removed} was removed.`);
}

function populateEditSubjectSelect() {
    const select = document.getElementById('editSubjectSelect');
    if (!select) return;
    const current = select.value;
    const defaults = [
        ['ALT','U23EM753 Advanced Logical Thinking (Placement Team)'],
        ['SE','U23IT481 Software Engineering'],
        ['JAVA','U23CS491 Java Programming'],
        ['AIML','U23AM495 Artificial Intelligence & ML'],
        ['DM','U23MA204 Discrete Mathematics'],
        ['DAA','U23CS403 Design & Analysis of Algorithms'],
        ['DBMS','U23CS404 Database Management Systems'],
        ['JAVA LAB','Full Stack Lab'],
        ['SE LAB','Intel AI Lab'],
        ['DAA LAB','Full Stack Lab'],
        ['DBMS LAB','Cloud & DevOps Lab'],
        ['COE','Center of Excellence'],
        ['UHV','Universal Human Values'],
        ['SS','Soft Skills'],
        ['LIB','Library'],
        ['TWM','Total Wellness Management'],
        ['AIML Project','Project Lab'],
        ['JAVA PROJECT','Full Stack Lab']
    ];
    const entries = [...defaults];
    adminResources.subjects.forEach(s => {
        if (!entries.some(e => e[0] === s.short)) entries.push([s.short, `${s.code} ${s.title}`]);
    });
    select.innerHTML = entries.map(([value,label]) =>
        `<option value="${value.replace(/"/g,'&quot;')}">${value} - ${label}</option>`
    ).join('');
    if ([...select.options].some(o => o.value === current)) select.value = current;
}

function populateEditVenueSelect() {
    const input = document.getElementById('editVenue');
    if (!input || input.tagName === 'SELECT') return;
    // Keep the existing editable text field while showing a datalist of saved venues.
    let dl = document.getElementById('savedVenueOptions');
    if (!dl) {
        dl = document.createElement('datalist');
        dl.id = 'savedVenueOptions';
        document.body.appendChild(dl);
        input.setAttribute('list', 'savedVenueOptions');
    }
    dl.innerHTML = adminResources.venues.map(v => `<option value="${v}"></option>`).join('');
}

// =========================
// PERSISTENT NOTIFICATION REGISTRATION (per logged-in user)
// =========================
function currentNotifKey() {
    const username = localStorage.getItem('sece_logged_in_user');
    return username ? 'sece_notif_' + username.toLowerCase() : null;
}

function loadNotificationRecord() {
    const key = currentNotifKey();
    if (!key) return null;
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Unable to load notification record:', error);
        return null;
    }
}

function saveNotificationRecord(record) {
    const key = currentNotifKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(record));
}

// Open modal, pre-filling with any previously saved registration
function openNotificationModal() {
    const record = loadNotificationRecord();
    if (record) {
        document.getElementById('notifName').value = record.name || '';
        document.getElementById('notifEmail').value = record.email || '';
        document.getElementById('notifPhone').value = record.phone || '';
        document.getElementById('prefClassAlert').checked = record.prefs?.classAlert !== false;
        document.getElementById('prefChangeAlert').checked = record.prefs?.changeAlert !== false;
        document.getElementById('prefWednesdayALT').checked = record.prefs?.wednesdayALT !== false;
    } else {
        document.getElementById('notifRegisterForm').reset();
    }
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
}

// Handle Notification Registration Submit
function handleNotificationRegister(e) {
    e.preventDefault();
    const name = document.getElementById('notifName').value;
    const email = document.getElementById('notifEmail').value;
    const phone = document.getElementById('notifPhone').value;
    const prefs = {
        classAlert: document.getElementById('prefClassAlert').checked,
        changeAlert: document.getElementById('prefChangeAlert').checked,
        wednesdayALT: document.getElementById('prefWednesdayALT').checked
    };

    saveNotificationRecord({ name, email, phone, prefs, registeredAt: new Date().toISOString() });
    renderNotificationStatus();

    const modalEl = document.getElementById('notificationModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    showToast('Registration Saved!', `${name} will get alerts at ${email} & ${phone}. Saved — visible next time you log in.`);
}

// Render the "My Notifications" status panel + bell button label
function renderNotificationStatus() {
    const panel = document.getElementById('notifStatusPanel');
    const bellLabel = document.getElementById('notifBellLabel');
    if (!panel) return;

    if (!currentUserRole) {
        panel.classList.add('d-none');
        return;
    }
    panel.classList.remove('d-none');

    const record = loadNotificationRecord();
    if (record) {
        if (bellLabel) bellLabel.innerText = 'Notifications Active';
        const activePrefs = [];
        if (record.prefs?.classAlert) activePrefs.push('15-min class reminder');
        if (record.prefs?.changeAlert) activePrefs.push('period-change alerts');
        if (record.prefs?.wednesdayALT) activePrefs.push('Wednesday ALT reminder');
        panel.className = 'alert alert-success py-2 px-3 border-0 rounded-3 mb-3 shadow-sm small';
        panel.innerHTML = `<i class="fa-solid fa-bell-on me-2"></i>
            <strong>Notifications ON</strong> for ${record.name} — ${record.email} / ${record.phone}.
            ${activePrefs.length ? 'Subscribed: ' + activePrefs.join(', ') + '.' : ''}
            <a href="#" class="ms-2" onclick="event.preventDefault(); openNotificationModal();">Update</a>`;
    } else {
        if (bellLabel) bellLabel.innerText = 'Register SMS / Email Alerts';
        panel.className = 'alert alert-secondary py-2 px-3 border-0 rounded-3 mb-3 shadow-sm small';
        panel.innerHTML = `<i class="fa-solid fa-bell-slash me-2"></i>
            You're not registered for SMS/Email alerts yet.
            <a href="#" class="ms-1" onclick="event.preventDefault(); openNotificationModal();">Register now</a>`;
    }
}

// Handle Forgot Password Submit
function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    const userType = document.getElementById('fpUserType').value;
    const identifier = document.getElementById('fpIdentifier').value.trim().toLowerCase();
    const mobile = document.getElementById('fpMobile').value.replace(/\D/g, '');
    const newPassword = document.getElementById('fpNewPassword').value;
    const confirmPassword = document.getElementById('fpConfirmPassword').value;

    if (!isValidUsername(userType, identifier)) {
        alert(`Invalid username for ${userType}.`);
        return;
    }
    if (userType !== 'ADMIN' && !/^\d{10}$/.test(mobile)) {
        alert('Enter a valid 10-digit registered mobile number.');
        return;
    }
    if (!isLowercaseAlnum(newPassword) || !isLowercaseAlnum(confirmPassword) || newPassword.length < 4) {
        alert('Password must contain at least 4 lowercase letters/numbers and no spaces or symbols.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // For Admin, the fixed username is sufficient for the local demo.
    // For Student/Faculty, recovery requires the registered mobile number.
    if (userType === 'ADMIN') {
        if (identifier !== ADMIN_USERNAME) {
            alert('Invalid Admin username.');
            return;
        }
    } else {
        let record = null;
        if (userType === 'STUDENT') {
            record = studentsRoster.find(s => (s.username || buildGeneratedUsername('STUDENT', s.name)) === identifier);
            if (!record || String(record.phone || '').replace(/\D/g, '') !== mobile) {
                alert('The mobile number does not match the enrolled student account.');
                return;
            }
        } else {
            record = staffDirectory.find(s => buildGeneratedUsername('FACULTY', s.name) === identifier);
            if (!record || (safetyNormalizePhone(record.phone) !== mobile && record.mobile !== mobile)) {
                // Staff records in this original file do not contain phone numbers.
                // If a faculty mobile is not registered, recovery is denied rather than guessed.
                alert('Faculty mobile number is not registered for this account. Ask Admin to register it first.');
                return;
            }
        }
    }

    localStorage.setItem('sece_password_' + identifier, newPassword);

    const modalEl = document.getElementById('forgotPasswordModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    document.getElementById('forgotPasswordForm').reset();
    updateForgotPasswordHint();
    showToast('Password Reset Successfully!', `Password updated for ${userType} account ${identifier}.`);
}

function safetyNormalizePhone(value) {
    return String(value || '').replace(/\D/g, '');
}

// Download Timetable as High-Resolution PNG Image
function downloadTimetablePNG() {
    showToast('Generating Timetable PNG...', 'Capturing high-resolution image of Sri Eshwar Timetable.');
    const element = document.getElementById('timetableCaptureArea');

    html2canvas(element, {
        backgroundColor: '#0b0f17',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `SRI_ESHWAR_TIMETABLE_${currentSection}_2026.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('PNG Downloaded!', `Saved SRI_ESHWAR_TIMETABLE_${currentSection}_2026.png to your device.`);
    }).catch(err => {
        console.error(err);
        showToast('Download Error', 'Could not generate PNG image.');
    });
}

// Export Timetable as CSV
function exportTimetableCSV() {
    let csv = 'Day,Period 1,Period 2,Period 3,Period 4,Period 5,Period 6,Period 7\n';
    const data = timetableData[currentSection] || timetableData['CSE_C'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    days.forEach(day => {
        const periods = data[day] || [];
        const row = [day, ...periods.map(p => `"${p.sub} (${p.faculty} - ${p.venue})"`)];
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `SECE_Timetable_${currentSection}.csv`);
    a.click();
    showToast('CSV Downloaded!', `Saved SECE_Timetable_${currentSection}.csv spreadsheet.`);
}

const PERIOD_NOTIFICATIONS_KEY = 'sece_period_notifications_v2';
function loadPeriodNotifications(){
    try {
        const a = JSON.parse(localStorage.getItem(PERIOD_NOTIFICATIONS_KEY) || '[]');
        return Array.isArray(a) ? a : [];
    } catch(_) { return []; }
}
function savePeriodNotifications(a){ localStorage.setItem(PERIOD_NOTIFICATIONS_KEY, JSON.stringify(a)); }
function getDateForDayName(dayName){
    const today = new Date();
    const names = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const target = names.indexOf(dayName);
    if(target < 0) return todayDateStr();
    const diff = (target - today.getDay() + 7) % 7;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function purgeExpiredPeriodNotifications(){
    const today = todayDateStr();
    const cleaned = loadPeriodNotifications().filter(n => n.date === today);
    if(cleaned.length !== loadPeriodNotifications().length) savePeriodNotifications(cleaned);
    return cleaned;
}
function renderPeriodNotifications(){
    const el=document.getElementById('periodNotificationsList'); if(!el)return;
    const today=getTodayDayName(), todayDate=todayDateStr();
    const arr=purgeExpiredPeriodNotifications().filter(n=>n.date===todayDate && n.day===today);
    el.innerHTML=arr.length ? arr.map((n,i)=>{
        const isLeave = n.source === 'leave';
        const alertClass = isLeave ? 'alert-danger' : 'alert-info';
        const leaveBadge = isLeave
            ? `<span class="badge bg-danger me-2"><i class="fa-solid fa-house-medical me-1"></i>On Leave</span>`
            : '';
        const staffLine = isLeave
            ? `<strong>${n.originalFaculty}</strong> is <span class="text-danger fw-bold">on leave today</span> — period open for substitution.`
            : `Faculty change: <strong>${n.originalFaculty || 'Original Faculty'}</strong> is substituted by <strong>${n.staff}</strong>.`;
        const canRemove = !isLeave && (currentUserRole==='ADMIN'||currentUserRole==='FACULTY');
        return `
        <div class="alert ${alertClass} py-2">
            ${leaveBadge}<strong>${n.day} — Period ${n.period} — ${n.section || currentSection}</strong><br>
            ${staffLine}<br>
            <small>${n.reason ? 'Reason: '+n.reason : 'Period changed by Faculty/Admin for today.'}</small>
            ${canRemove?`<button class="btn btn-sm btn-outline-danger float-end" onclick="removePeriodNotification(${i})">Remove</button>`:''}
        </div>`;
    }).join('') : '<div class="text-muted">No period notifications for today.</div>';
}
function handlePeriodNotification(e){
    e.preventDefault(); if(!(currentUserRole==='ADMIN'||currentUserRole==='FACULTY'))return;
    const day=document.getElementById('pnDay').value;
    const a=purgeExpiredPeriodNotifications();
    a.push({date:getDateForDayName(day),day,period:Number(document.getElementById('pnPeriod').value),section:currentSection,staff:document.getElementById('pnStaff').value.trim(),reason:document.getElementById('pnReason').value.trim(),source:'manual'});
    savePeriodNotifications(a); e.target.reset(); renderPeriodNotifications(); showToast('Notification Saved','The period handling notification is saved only for the selected date.');
}
function removePeriodNotification(displayIdx){
    if(!(currentUserRole==='ADMIN'||currentUserRole==='FACULTY'))return;
    const today=todayDateStr(); const a=purgeExpiredPeriodNotifications();
    const matches=a.map((n,i)=>({n,i})).filter(x=>x.date===today && x.day===getTodayDayName());
    if(matches[displayIdx]) a.splice(matches[displayIdx].i,1);
    savePeriodNotifications(a); renderPeriodNotifications();
}
document.addEventListener('shown.bs.modal',e=>{if(e.target.id==='studentDayNotificationModal')renderPeriodNotifications();});

// Automatically create a student-only notification when Faculty/Admin changes
// the faculty assigned to a particular period. It is valid for that date only.
function createFacultyChangeNotification(day, pIdx, originalSlot, updatedSlot, section){
    if(!(currentUserRole==='ADMIN'||currentUserRole==='FACULTY')) return;
    const originalFaculty=(originalSlot && originalSlot.faculty || '').trim();
    const newFaculty=(updatedSlot && updatedSlot.faculty || '').trim();
    if(!originalFaculty || !newFaculty || originalFaculty===newFaculty) return;
    const date=getDateForDayName(day), a=purgeExpiredPeriodNotifications();
    const filtered=a.filter(n=>!(n.date===date && n.section===section && Number(n.period)===pIdx+1 && n.source==='auto'));
    filtered.push({date,day,period:pIdx+1,section,originalFaculty,staff:newFaculty,reason:'Faculty/Admin changed the period assignment.',source:'auto'});
    savePeriodNotifications(filtered);
}
// Toast Notification System
function showToast(title, message) {
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastBody').innerText = message;
    document.getElementById('toastTime').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const toastEl = document.getElementById('seceToast');
    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    toast.show();
}
