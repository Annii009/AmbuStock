// register.js
const API_URL = 'http://localhost:5021';

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('registerError');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombreResponsable = document.getElementById('registerNombre').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        // Validación básica
        if (!validateEmail(email)) {
            showError('Por favor, introduce un email válido');
            return;
        }
        
        
        // Llamada a la API
        await registerUser(nombreResponsable, email, password);
    });

    async function registerUser(nombreResponsable, email, password) {
        const submitButton = registerForm.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');
        hideError();

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombreResponsable: nombreResponsable,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar token si es necesario
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                
                window.location.href = 'login.html';
            } else {
                showError(data.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Error de conexión con el servidor');
        } finally {
            submitButton.classList.remove('loading');
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
    }

    // Social login buttons
    document.querySelector('.google-btn').addEventListener('click', () => {
        console.log('Google login clicked');
        // Implementar OAuth Google
    });

    document.querySelector('.apple-btn').addEventListener('click', () => {
        console.log('Apple login clicked');
        // Implementar OAuth Apple
    });

    document.querySelector('.facebook-btn').addEventListener('click', () => {
        console.log('Facebook login clicked');
        // Implementar OAuth Facebook
    });
});
