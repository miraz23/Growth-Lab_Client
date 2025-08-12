// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/user/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        
        if (!response.ok) {
            throw new Error('Login failed');
        }
        
        const data = await response.json();
        
        // Store tokens in localStorage
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', username);
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Register function
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/user/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                first_name: '',  // Adding required fields
                last_name: ''    // Adding required fields
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Logout function
async function logout() {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
            const response = await fetch(`${API_URL}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    refresh_token
                })
            });
            
            if (!response.ok) {
                console.error('Logout error:', await response.json());
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear localStorage regardless of API call success
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_staff');
        
        window.location.href = 'index.html';
    }
}

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        // Show auth buttons, hide user menu
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        
        // Mobile menu
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserMenu = document.getElementById('mobile-user-menu');
        
        if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
        
        return null;
    }
    
    try {
        // Verify token by making a request to user profile endpoint
        const response = await fetch(`${API_URL}/user/profile/1/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // Token is invalid, clear localStorage and show auth buttons
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            
            const authButtons = document.getElementById('auth-buttons');
            const userMenu = document.getElementById('user-menu');
            
            if (authButtons) authButtons.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            
            // Mobile menu
            const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
            const mobileUserMenu = document.getElementById('mobile-user-menu');
            
            if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
            if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
            
            return null;
        }
        
        const userData = await response.json();
        
        // Store user data
        localStorage.setItem('user_id', userData.id);
        localStorage.setItem('is_staff', userData.is_staff);
        
        // Update UI
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const usernameElement = document.getElementById('username');
        
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (usernameElement) usernameElement.textContent = username;
        
        // Mobile menu
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserMenu = document.getElementById('mobile-user-menu');
        
        if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
        
        // Show/hide instructor dashboard link based on staff status
        const instructorLink = document.getElementById('instructor-link');
        const mobileInstructorLink = document.getElementById('mobile-instructor-link');
        
        if (instructorLink) {
            if (userData.is_staff || userData.is_superuser) {
                instructorLink.classList.remove('hidden');
            } else {
                instructorLink.classList.add('hidden');
            }
        }
        
        if (mobileInstructorLink) {
            if (userData.is_staff || userData.is_superuser) {
                mobileInstructorLink.classList.remove('hidden');
            } else {
                mobileInstructorLink.classList.add('hidden');
            }
        }
        
        // Setup logout buttons
        const logoutButton = document.getElementById('logout-button');
        const mobileLogoutButton = document.getElementById('mobile-logout-button');
        
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        if (mobileLogoutButton) {
            mobileLogoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        return userData;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return null;
    }
}