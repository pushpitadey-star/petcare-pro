/* === AUTHENTICATION FUNCTIONS FOR BOTH USER AND ADMIN === */

/**
 * Open user login modal
 */
function openUserLogin() {
    const userLoginModal = document.getElementById('userLoginModal');
    if (userLoginModal) {
        userLoginModal.style.display = 'flex';
    }
}

/**
 * Open admin login modal
 */
function openAdminLogin() {
    const adminLoginModal = document.getElementById('adminLoginModal');
    if (adminLoginModal) {
        adminLoginModal.style.display = 'flex';
    }
}

/**
 * Handle user login (email: user@example.com, password: user123)
 */
function handleUserLogin() {
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const errorMsg = document.getElementById('userError');

    if (email === "user@example.com" && password === "user123") {
        const userLoginModal = document.getElementById('userLoginModal');
        const landingPage = document.getElementById('landing-page');
        const userDashboard = document.getElementById('user-dashboard');

        userLoginModal.style.display = 'none';
        landingPage.style.display = 'none';
        userDashboard.style.display = 'flex';
        document.body.style.background = "#f8fafc";

        // Clear inputs
        document.getElementById('userEmail').value = "";
        document.getElementById('userPassword').value = "";
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }

        alert("Welcome! Login Successful");
    } else {
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
    }
}

/**
 * Handle admin login (username: admin, password: admin123)
 */
function handleAdminLogin() {
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('adminError');

    if (username === "admin" && password === "admin123") {
        const adminLoginModal = document.getElementById('adminLoginModal');
        const landingPage = document.getElementById('landing-page');
        const adminDashboard = document.getElementById('admin-dashboard');

        adminLoginModal.style.display = 'none';
        landingPage.style.display = 'none';
        adminDashboard.style.display = 'flex';
        document.body.style.background = "#f8fafc";

        // Clear inputs
        document.getElementById('adminUser').value = "";
        document.getElementById('adminPassword').value = "";
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }

        alert("Welcome Admin! Login Successful");
    } else {
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
    }
}

/**
 * Logout user
 */
function logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
        const userDashboard = document.getElementById('user-dashboard');
        const landingPage = document.getElementById('landing-page');

        userDashboard.style.display = 'none';
        landingPage.style.display = 'block';
        document.body.style.background = "white";

        // Clear inputs
        document.getElementById('userEmail').value = "";
        document.getElementById('userPassword').value = "";
        const userError = document.getElementById('userError');
        if (userError) {
            userError.style.display = 'none';
        }

        alert("You have been logged out");
    }
}

/**
 * Logout admin
 */
function logoutAdmin() {
    if (confirm("Are you sure you want to logout?")) {
        const adminDashboard = document.getElementById('admin-dashboard');
        const landingPage = document.getElementById('landing-page');

        adminDashboard.style.display = 'none';
        landingPage.style.display = 'block';
        document.body.style.background = "white";

        // Clear inputs
        document.getElementById('adminUser').value = "";
        document.getElementById('adminPassword').value = "";
        const adminError = document.getElementById('adminError');
        if (adminError) {
            adminError.style.display = 'none';
        }

        alert("Admin logged out successfully");
    }
}

/**
 * Close modal when clicking outside
 */
document.addEventListener('DOMContentLoaded', function() {
    const userLoginModal = document.getElementById('userLoginModal');
    const adminLoginModal = document.getElementById('adminLoginModal');

    // Close user login modal on backdrop click
    if (userLoginModal) {
        window.addEventListener('click', function(event) {
            if (event.target === userLoginModal) {
                userLoginModal.style.display = 'none';
            }
        });

        // Enter key for user login
        const userPassword = document.getElementById('userPassword');
        if (userPassword) {
            userPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleUserLogin();
                }
            });
        }
    }

    // Close admin login modal on backdrop click
    if (adminLoginModal) {
        window.addEventListener('click', function(event) {
            if (event.target === adminLoginModal) {
                adminLoginModal.style.display = 'none';
            }
        });

        // Enter key for admin login
        const adminPassword = document.getElementById('adminPassword');
        if (adminPassword) {
            adminPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleAdminLogin();
                }
            });
        }
    }
});
