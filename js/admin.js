/* === ADMIN DASHBOARD FUNCTIONS === */

/**
 * Handle admin login
 */
function handleLogin() {
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value;
    const errorMsg = document.getElementById('error');

    // Simple authentication (username: admin, password: 1234)
    if (user === "admin" && pass === "1234") {
        const loginModal = document.getElementById('loginModal');
        const landingPage = document.getElementById('landing-page');
        const adminDashboard = document.getElementById('admin-dashboard');

        loginModal.style.display = 'none';
        landingPage.style.display = 'none';
        adminDashboard.style.display = 'flex';
        document.body.style.background = "#f8fafc";

        // Clear inputs
        document.getElementById('user').value = "";
        document.getElementById('pass').value = "";
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    } else {
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
    }
}

/**
 * Handle admin logout
 */
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        const adminDashboard = document.getElementById('admin-dashboard');
        const landingPage = document.getElementById('landing-page');
        const errorMsg = document.getElementById('error');

        adminDashboard.style.display = 'none';
        landingPage.style.display = 'block';
        document.body.style.background = "white";

        // Clear inputs
        document.getElementById('user').value = "";
        document.getElementById('pass').value = "";
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }

        alert("Logged out successfully");
    }
}

/**
 * Initialize on page load: Handle Enter key and modal backdrop click
 */
document.addEventListener('DOMContentLoaded', function() {
    const passInput = document.getElementById('pass');
    if (passInput) {
        passInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // Close modal when clicking outside
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        window.onclick = function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        }
    }
});
