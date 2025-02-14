// Constants
const API_URL = 'https://game-zone-62w0.onrender.com/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const SESSION_DURATION = 1000 * 60 * 60; // 1 hour
const PUBLIC_PATHS = ['/index.html', '/login.html', '/register.html', '/']; // Pages accessible without auth

// Input styling functions
function setInputSuccess(inputElement) {
    const formGroup = inputElement.parentElement;
    formGroup.className = 'form-group success';
    inputElement.style.borderColor = '#2ecc71';
    inputElement.style.boxShadow = '0 0 5px rgba(46, 204, 113, 0.5)';
}

function setInputError(inputElement, message) {
    const formGroup = inputElement.parentElement;
    formGroup.className = 'form-group error';
    inputElement.style.borderColor = '#e74c3c';
    inputElement.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
    
    let errorDisplay = formGroup.querySelector('.error-message');
    if (!errorDisplay) {
        errorDisplay = document.createElement('small');
        errorDisplay.className = 'error-message';
        formGroup.appendChild(errorDisplay);
    }
    errorDisplay.textContent = message;
}

function clearInputState(inputElement) {
    const formGroup = inputElement.parentElement;
    formGroup.className = 'form-group';
    inputElement.style.borderColor = '';
    inputElement.style.boxShadow = '';
    
    const errorDisplay = formGroup.querySelector('.error-message');
    if (errorDisplay) {
        errorDisplay.remove();
    }
}

// Validation functions
function validateUsername(username) {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return null;
}

function validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < 4) return 'Password must be at least 4 characters';
    return null;
}

function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    return null;
}

// Authentication functions
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store auth data with encryption
        const encryptedToken = btoa(data.token); // Basic encryption for demo
        sessionStorage.setItem(AUTH_TOKEN_KEY, encryptedToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        sessionStorage.setItem('session_expiry', Date.now() + SESSION_DURATION);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function logout() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('session_expiry');
    window.location.href = 'index.html';
}

function isAuthenticated() {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const expiry = sessionStorage.getItem('session_expiry');
    
    if (!token || !expiry) return false;
    
    if (Date.now() > parseInt(expiry)) {
        logout();
        return false;
    }
    
    return true;
}

// Route protection with proper case sensitivity
function checkAuth() {
    const currentPath = window.location.pathname.toLowerCase();
    const isPublicPath = PUBLIC_PATHS.some(path => currentPath.endsWith(path.toLowerCase()));
    
    if (!isAuthenticated() && !isPublicPath) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (isAuthenticated() && isPublicPath) {
        window.location.href = 'Home.html'; // Fixed capitalization
        return false;
    }
    
    return true;
}

// Periodic auth check
function startAuthCheck() {
    setInterval(() => {
        if (!checkAuth()) {
            logout();
        }
    }, 30000); // Check every 30 seconds
}

// Form handling
function initializeAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSignupBtn = document.getElementById('switch-to-signup');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const logoutBtn = document.getElementById('logout-btn');

    // Add input event listeners for real-time validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearInputState(input);
        });
        
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            
            // Validate fields
            const usernameError = validateUsername(username.value);
            const passwordError = validatePassword(password.value);
            
            if (usernameError) setInputError(username, usernameError);
            if (passwordError) setInputError(password, passwordError);
            
            if (!usernameError && !passwordError) {
                const result = await login(username.value, password.value);
                
                if (result.success) {
                    setInputSuccess(username);
                    setInputSuccess(password);
                    window.location.href = 'Home.html'; // Fixed capitalization
                } else {
                    setInputError(username, result.error);
                    setInputError(password, result.error);
                }
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('signup-username');
            const email = document.getElementById('signup-email');
            const password = document.getElementById('signup-password');
            const confirmPassword = document.getElementById('confirm-password');
            
            // Validate fields
            const usernameError = validateUsername(username.value);
            const emailError = validateEmail(email.value);
            const passwordError = validatePassword(password.value);
            const confirmError = password.value !== confirmPassword.value ? 
                'Passwords do not match' : null;
            
            if (usernameError) setInputError(username, usernameError);
            if (emailError) setInputError(email, emailError);
            if (passwordError) setInputError(password, passwordError);
            if (confirmError) setInputError(confirmPassword, confirmError);
            
            if (!usernameError && !emailError && !passwordError && !confirmError) {
                const result = await register(username.value, email.value, password.value);
                
                if (result.success) {
                    setInputSuccess(username);
                    setInputSuccess(email);
                    setInputSuccess(password);
                    setInputSuccess(confirmPassword);
                    
                    alert('Registration successful! Please log in.');
                    showLoginForm();
                } else {
                    setInputError(username, result.error);
                }
            }
        });
    }

    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignupForm();
        });
    }

    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function validateField(input) {
    const id = input.id;
    let error = null;
    
    switch(id) {
        case 'username':
        case 'signup-username':
            error = validateUsername(input.value);
            break;
        case 'signup-email':
            error = validateEmail(input.value);
            break;
        case 'password':
        case 'signup-password':
            error = validatePassword(input.value);
            break;
        case 'confirm-password':
            const password = document.getElementById('signup-password');
            error = input.value !== password.value ? 'Passwords do not match' : null;
            break;
    }
    
    if (error) {
        setInputError(input, error);
    } else {
        setInputSuccess(input);
    }
}

// Helper functions for form display
function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm && signupForm) {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        clearAllInputStates();
    }
}

function showSignupForm() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm && signupForm) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        clearAllInputStates();
    }
}

function clearAllInputStates() {
    document.querySelectorAll('input').forEach(input => {
        clearInputState(input);
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();
    
    // Start periodic auth checking
    startAuthCheck();
    
    // Initialize forms if they exist
    initializeAuthForms();
});