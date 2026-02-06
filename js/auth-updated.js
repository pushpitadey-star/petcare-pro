// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Store token in localStorage
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return { success: response.ok, ...data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============ USER LOGIN & LOGOUT ============

function openUserLogin() {
    document.getElementById('userLoginModal').style.display = 'flex';
}

function closeUserLogin() {
    document.getElementById('userLoginModal').style.display = 'none';
    document.getElementById('userLoginForm').reset();
}

async function handleUserLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const loginBtn = event.target.querySelector('button[type="submit"]');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        const result = await apiCall('/auth/user-login', 'POST', { email, password });

        if (result.success) {
            setAuthToken(result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
            
            // Hide login modal, show user dashboard
            closeUserLogin();
            document.getElementById('landing').style.display = 'none';
            document.getElementById('user-dashboard').style.display = 'flex';
            
            // Load user data
            loadUserDashboard();
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        alert('Error during login: ' + error.message);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        localStorage.removeItem('userData');
        
        document.getElementById('user-dashboard').style.display = 'none';
        document.getElementById('landing').style.display = 'block';
        document.getElementById('userLoginForm').reset();
    }
}

// ============ USER REGISTRATION ============

function openUserRegister() {
    const m = document.getElementById('userRegisterModal');
    if (m) m.style.display = 'flex';
}

function closeUserRegister() {
    const m = document.getElementById('userRegisterModal');
    if (m) m.style.display = 'none';
    const f = document.getElementById('userRegisterForm');
    if (f) f.reset();
}

// Email suggestion checker with real-time availability
async function checkEmailSuggestions() {
    const emailInput = document.getElementById('registerEmail');
    const email = emailInput.value.trim();
    const suggestionsDiv = document.getElementById('emailSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');
    
    console.log('checkEmailSuggestions called with email:', email);
    console.log('Elements found - emailInput:', !!emailInput, 'suggestionsDiv:', !!suggestionsDiv, 'suggestionsList:', !!suggestionsList);
    
    if (!email || email.length < 3) {
        console.log('Email too short, hiding dropdown');
        suggestionsDiv.style.display = 'none';
        return;
    }

    try {
        const url = `/auth/check-username/${encodeURIComponent(email)}`;
        console.log('Calling API:', url);
        const result = await apiCall(url, 'GET');
        console.log('API Response:', result);
        
        if (!result.success) {
            console.error('API returned success:false', result.message);
            suggestionsDiv.style.display = 'none';
            return;
        }

        suggestionsList.innerHTML = '';
        
        // Show availability of entered email
        const enteredItem = document.createElement('li');
        enteredItem.style.padding = '8px';
        enteredItem.style.backgroundColor = result.available ? '#d4edda' : '#f8d7da';
        enteredItem.style.color = result.available ? '#155724' : '#721c24';
        enteredItem.style.fontWeight = 'bold';
        enteredItem.style.borderRadius = '4px';
        enteredItem.style.marginBottom = '5px';
        enteredItem.textContent = `${email} - ${result.available ? '✓ Available' : '✗ Taken'}`;
        suggestionsList.appendChild(enteredItem);
        console.log('Added main email item');
        
        // Show other suggestions if any
        if (result.suggestions && result.suggestions.length > 0) {
            console.log('Found', result.suggestions.length, 'suggestions');
            const divider = document.createElement('li');
            divider.style.borderTop = '1px solid #ddd';
            divider.style.padding = '8px 0 5px 0';
            divider.textContent = 'Similar emails:';
            divider.style.fontWeight = 'bold';
            divider.style.fontSize = '12px';
            divider.style.color = '#666';
            suggestionsList.appendChild(divider);

            result.suggestions.forEach(sugg => {
                const item = document.createElement('li');
                item.style.padding = '8px';
                item.style.backgroundColor = '#f8d7da';
                item.style.color = '#721c24';
                item.style.cursor = 'pointer';
                item.style.marginBottom = '5px';
                item.style.borderRadius = '4px';
                item.textContent = `${sugg.email} (Taken)`;
                item.onmouseover = () => item.style.opacity = '0.8';
                item.onmouseout = () => item.style.opacity = '1';
                item.onclick = () => {
                    emailInput.value = sugg.email;
                    checkEmailSuggestions();
                };
                suggestionsList.appendChild(item);
            });
        }
        
        console.log('Showing dropdown');
        suggestionsDiv.style.display = 'block';
    } catch (error) {
        console.error('Error checking email:', error);
        suggestionsDiv.style.display = 'none';
    }
}

async function handleUserRegister(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerPasswordConfirm').value;
    const first_name = document.getElementById('registerFirstName').value.trim() || '';
    const last_name = document.getElementById('registerLastName').value.trim() || '';

    if (!email || !password) {
        document.getElementById('registerError').textContent = 'Email and password required.';
        return;
    }
    if (password !== confirm) {
        document.getElementById('registerError').textContent = 'Passwords do not match.';
        return;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creating...';

    const result = await apiCall('/auth/user-register', 'POST', { email, password, first_name, last_name });
    if (result.success) {
        setAuthToken(result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
        closeUserRegister();
        document.getElementById('landing').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'flex';
        loadUserDashboard();
    } else {
        document.getElementById('registerError').textContent = result.message || 'Registration failed.';
    }

    btn.disabled = false;
    btn.textContent = 'Register';
}

// ============ ADMIN LOGIN & LOGOUT ============

function openAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'flex';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

async function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    const loginBtn = event.target.querySelector('button[type="submit"]');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        const result = await apiCall('/auth/admin-login', 'POST', { username, password });

        if (result.success) {
            setAuthToken(result.token);
            localStorage.setItem('adminData', JSON.stringify(result.admin));
            
            // Hide login modal, show admin dashboard
            closeAdminLogin();
            document.getElementById('landing').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'flex';
            
            // Load admin data
            loadAdminDashboard();
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        alert('Error during login: ' + error.message);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        localStorage.removeItem('adminData');
        
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('landing').style.display = 'block';
        document.getElementById('adminLoginForm').reset();
    }
}

// ============ LOAD DASHBOARD DATA ============

async function loadUserDashboard() {
    // Load user pets
    const petsResult = await apiCall('/pets', 'GET');
    if (petsResult.success) {
        displayUserPets(petsResult.pets || []);
    }
    
    // Load appointments
    const appointResult = await apiCall('/appointments', 'GET');
    if (appointResult.success) {
        displayAppointments(appointResult.appointments || []);
    }
    
    // Load vaccinations
    const vaccResult = await apiCall('/vaccinations', 'GET');
    if (vaccResult.success) {
        displayVaccinations(vaccResult.vaccinations || []);
    }
}

async function loadAdminDashboard() {
    // Load dashboard stats
    const statsResult = await apiCall('/admin/dashboard/stats', 'GET');
    if (statsResult.success) {
        displayAdminStats(statsResult.stats, statsResult.recent_pets || []);
    }
}

// ============ DISPLAY FUNCTIONS ============

function displayUserPets(pets) {
    const tableBody = document.getElementById('petsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (pets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No pets added yet</td></tr>';
        return;
    }

    pets.forEach(pet => {
        const row = `
            <tr>
                <td>${pet.pet_name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed || 'N/A'}</td>
                <td>${pet.age ? pet.age + ' years' : 'N/A'}</td>
                <td>
                    <button class="btn-small" onclick="viewPet(${pet.pet_id})">View</button>
                    <button class="btn-small" onclick="editPet(${pet.pet_id})">Edit</button>
                    <button class="btn-small btn-danger" onclick="deletePet(${pet.pet_id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function displayAppointments(appointments) {
    // Create appointments table if it doesn't exist
    const appointTable = document.getElementById('appointmentsTable');
    if (!appointTable) {
        console.log('Appointments table not found - feature not visible in current view');
        return;
    }
    
    const tableBody = appointTable.querySelector('tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (appointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No appointments booked yet</td></tr>';
        return;
    }

    appointments.forEach(appt => {
        const apptDate = new Date(appt.appointment_date);
        const row = `
            <tr>
                <td>${appt.pet_name}</td>
                <td>${apptDate.toLocaleDateString()}</td>
                <td>${appt.appointment_type || 'Checkup'}</td>
                <td>${appt.veterinarian || 'N/A'}</td>
                <td>${appt.status}</td>
                <td>
                    <button class="btn-small" onclick="cancelAppointment(${appt.appointment_id})">Cancel</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function cancelAppointment(appointmentId) {
    if (confirm('Cancel this appointment?')) {
        const result = await apiCall(`/appointments/${appointmentId}`, 'DELETE');
        if (result.success) {
            alert('Appointment cancelled');
            loadUserDashboard();
        } else {
            alert(result.message || 'Failed to cancel appointment');
        }
    }
}

function displayVaccinations(vaccinations) {
    // Create vaccinations table if it doesn't exist
    const vaccTable = document.getElementById('vaccinationsTable');
    if (!vaccTable) {
        console.log('Vaccinations table not found - feature not visible in current view');
        return;
    }
    
    const tableBody = vaccTable.querySelector('tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (vaccinations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No vaccinations recorded yet</td></tr>';
        return;
    }

    vaccinations.forEach(vacc => {
        const vaccDate = new Date(vacc.vaccination_date);
        const nextDueDate = vacc.next_due_date ? new Date(vacc.next_due_date) : null;
        const row = `
            <tr>
                <td>${vacc.pet_name}</td>
                <td>${vacc.vaccine_name}</td>
                <td>${vaccDate.toLocaleDateString()}</td>
                <td>${nextDueDate ? nextDueDate.toLocaleDateString() : 'N/A'}</td>
                <td>${vacc.veterinarian || 'N/A'}</td>
                <td>${vacc.status || 'Completed'}</td>
                <td>
                    <button class="btn-small" onclick="editVaccination(${vacc.vaccination_id})">Edit</button>
                    <button class="btn-small btn-danger" onclick="deleteVaccination(${vacc.vaccination_id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

async function editVaccination(vaccinationId) {
    const result = await apiCall(`/vaccinations/${vaccinationId}`, 'GET');
    if (result.success && result.vaccination) {
        const vacc = result.vaccination;
        const newVaccName = prompt('Vaccine name:', vacc.vaccine_name);
        const newVetName = prompt('Veterinarian:', vacc.veterinarian || '');
        
        if (newVaccName !== null && newVetName !== null) {
            const updateResult = await apiCall(`/vaccinations/${vaccinationId}`, 'PUT', {
                vaccine_name: newVaccName,
                veterinarian: newVetName,
                status: 'Completed'
            });
            if (updateResult.success) {
                alert('Vaccination updated');
                loadUserDashboard();
            } else {
                alert(updateResult.message || 'Failed to update vaccination');
            }
        }
    }
}

async function deleteVaccination(vaccinationId) {
    if (confirm('Delete this vaccination record?')) {
        const result = await apiCall(`/vaccinations/${vaccinationId}`, 'DELETE');
        if (result.success) {
            alert('Vaccination deleted');
            loadUserDashboard();
        } else {
            alert(result.message || 'Failed to delete vaccination');
        }
    }
}

function displayAdminStats(stats, recentPets) {
    // Update stats cards
    if (document.getElementById('totalPets')) {
        document.getElementById('totalPets').textContent = stats.total_pets;
    }
    if (document.getElementById('totalUsers')) {
        document.getElementById('totalUsers').textContent = stats.total_users;
    }
    if (document.getElementById('pendingCheckups')) {
        document.getElementById('pendingCheckups').textContent = stats.pending_checkups;
    }

    // Display recent pets
    const tableBody = document.getElementById('recentPetsTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        recentPets.forEach(pet => {
            const row = `
                <tr>
                    <td>${pet.pet_name}</td>
                    <td>${pet.species}</td>
                    <td>${pet.first_name} ${pet.last_name}</td>
                    <td>${new Date(pet.created_date).toLocaleDateString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
}

// ============ PET OPERATIONS ============

async function viewPet(petId) {
    const result = await apiCall(`/pets/${petId}`, 'GET');
    if (result.success) {
        const pet = result.pet;
        alert(`
Pet Details:
Name: ${pet.pet_name}
Species: ${pet.species}
Breed: ${pet.breed || 'N/A'}
Age: ${pet.age ? pet.age + ' years' : 'N/A'}
Gender: ${pet.gender || 'N/A'}
Color: ${pet.color || 'N/A'}
Weight: ${pet.weight ? pet.weight + ' lbs' : 'N/A'}
        `);
    } else {
        alert('Failed to load pet details');
    }
}

async function editPet(petId) {
    const result = await apiCall(`/pets/${petId}`, 'GET');
    if (result.success) {
        const pet = result.pet;
        const newName = prompt('Pet Name:', pet.pet_name);
        if (!newName) return;
        const newBreed = prompt('Breed:', pet.breed || '');
        const newAge = prompt('Age (years):', pet.age || '');
        
        const updateResult = await apiCall(`/pets/${petId}`, 'PUT', {
            pet_name: newName,
            species: pet.species,
            breed: newBreed,
            age: newAge ? parseInt(newAge) : null
        });
        
        if (updateResult.success) {
            alert('Pet updated successfully');
            loadUserDashboard();
        } else {
            alert(updateResult.message || 'Failed to update pet');
        }
    } else {
        alert('Failed to load pet for editing');
    }
}

async function deletePet(petId) {
    if (confirm('Are you sure you want to delete this pet?')) {
        const result = await apiCall(`/pets/${petId}`, 'DELETE');
        if (result.success) {
            alert('Pet deleted successfully');
            loadUserDashboard();
        } else {
            alert(result.message || 'Failed to delete pet');
        }
    }
}

// ============ ADD / APPOINTMENT / VACCINATION HELPERS ============

function openAddPetModal() {
    const m = document.getElementById('addPetModal');
    if (m) m.style.display = 'flex';
}

function closeAddPetModal() {
    const m = document.getElementById('addPetModal');
    if (m) m.style.display = 'none';
    const f = document.getElementById('addPetForm');
    if (f) f.reset();
}

async function handleAddPetSubmit(event) {
    event.preventDefault();
    const pet_name = document.getElementById('petName').value.trim();
    const species = document.getElementById('petSpecies').value.trim();
    const breed = document.getElementById('petBreed').value.trim();
    const age = document.getElementById('petAge').value || null;
    const gender = document.getElementById('petGender').value || null;

    const result = await apiCall('/pets', 'POST', { pet_name, species, breed, age, gender });
    if (result.success) {
        alert('Pet added');
        closeAddPetModal();
        loadUserDashboard();
    } else {
        alert(result.message || 'Failed to add pet');
    }
}

function openAddAppointmentModal() {
    const m = document.getElementById('addAppointmentModal');
    if (m) m.style.display = 'flex';
    // Load user's pets into dropdown
    populatePetDropdown('appointPetSelect');
}

function closeAddAppointmentModal() {
    const m = document.getElementById('addAppointmentModal');
    if (m) m.style.display = 'none';
    const f = document.getElementById('addAppointmentForm');
    if (f) f.reset();
}

async function handleAddAppointmentSubmit(event) {
    event.preventDefault();
    const pet_id = parseInt(document.getElementById('appointPetSelect').value, 10);
    const appointment_date = document.getElementById('appointDate').value;
    const appointment_type = document.getElementById('appointType').value || 'Checkup';
    const veterinarian = document.getElementById('appointVet').value || null;

    if (!pet_id) {
        alert('Please select a pet');
        return;
    }

    const result = await apiCall('/appointments', 'POST', { pet_id, appointment_date, appointment_type, veterinarian, status: 'Scheduled' });
    if (result.success) {
        alert('Appointment booked successfully!');
        closeAddAppointmentModal();
        loadUserDashboard();
    } else {
        alert(result.message || 'Failed to book appointment');
    }
}

function openAddVaccinationModal() {
    const m = document.getElementById('addVaccinationModal');
    if (m) m.style.display = 'flex';
    // Load user's pets into dropdown
    populatePetDropdown('vacPetSelect');
}

function closeAddVaccinationModal() {
    const m = document.getElementById('addVaccinationModal');
    if (m) m.style.display = 'none';
    const f = document.getElementById('addVaccinationForm');
    if (f) f.reset();
}

async function handleAddVaccinationSubmit(event) {
    event.preventDefault();
    const pet_id = parseInt(document.getElementById('vacPetSelect').value, 10);
    const vaccine_name = document.getElementById('vaccineName').value.trim();
    const vaccination_date = document.getElementById('vacDate').value;
    const next_due_date = document.getElementById('vacNextDue').value || null;

    if (!pet_id) {
        alert('Please select a pet');
        return;
    }

    const result = await apiCall('/vaccinations', 'POST', { pet_id, vaccine_name, vaccination_date, next_due_date, status: 'Completed' });
    if (result.success) {
        alert('Vaccination record added successfully!');
        closeAddVaccinationModal();
        loadUserDashboard();
    } else {
        alert(result.message || 'Failed to add vaccination');
    }
}

// Helper function to populate pet dropdowns
async function populatePetDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const petsResult = await apiCall('/pets', 'GET');
    if (petsResult.success && petsResult.pets) {
        select.innerHTML = '<option value="">-- Select a pet --</option>';
        petsResult.pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.pet_id;
            option.textContent = pet.pet_name;
            select.appendChild(option);
        });
    }
}

// ============ MODAL EVENT HANDLERS ============

document.addEventListener('DOMContentLoaded', function() {
    // User Login Modal
    const userLoginForm = document.getElementById('userLoginForm');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', handleUserLogin);
    }

    // Admin Login Modal
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Modal backdrop click handlers
    window.onclick = function(event) {
        const userModal = document.getElementById('userLoginModal');
        const adminModal = document.getElementById('adminLoginModal');
        const addPetModal = document.getElementById('addPetModal');
        const addAppointmentModal = document.getElementById('addAppointmentModal');
        const addVaccinationModal = document.getElementById('addVaccinationModal');

        if (event.target === userModal) {
            closeUserLogin();
        }
        if (event.target === adminModal) {
            closeAdminLogin();
        }
        if (event.target === addPetModal) {
            closeAddPetModal();
        }
        if (event.target === addAppointmentModal) {
            closeAddAppointmentModal();
        }
        if (event.target === addVaccinationModal) {
            closeAddVaccinationModal();
        }
    };

    // Enter/Escape key support for modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeUserLogin();
            closeAdminLogin();
            closeAddPetModal();
            closeAddAppointmentModal();
            closeAddVaccinationModal();
        }
    });

    // Add form handlers for create operations
    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', handleAddPetSubmit);
    }
    const addAppointmentForm = document.getElementById('addAppointmentForm');
    if (addAppointmentForm) {
        addAppointmentForm.addEventListener('submit', handleAddAppointmentSubmit);
    }
    const addVaccinationForm = document.getElementById('addVaccinationForm');
    if (addVaccinationForm) {
        addVaccinationForm.addEventListener('submit', handleAddVaccinationSubmit);
    }
    // Register form handler
    const userRegisterForm = document.getElementById('userRegisterForm');
    if (userRegisterForm) {
        userRegisterForm.addEventListener('submit', handleUserRegister);
    }

    // Check if user is already logged in
    if (getAuthToken()) {
        const userData = localStorage.getItem('userData');
        const adminData = localStorage.getItem('adminData');

        if (userData) {
            document.getElementById('landing').style.display = 'none';
            document.getElementById('user-dashboard').style.display = 'flex';
            loadUserDashboard();
        } else if (adminData) {
            document.getElementById('landing').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'flex';
            loadAdminDashboard();
        }
    }
});
