const API_URL = 'http://localhost:5021';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('loginError');

    if (!loginForm) {
        console.error('Formulario de login no encontrado');
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validación básica
        if (!validateEmail(email)) {
            showError('Por favor, introduce un email válido');
            return;
        }
        
        if (!password) {
            showError('Por favor, introduce tu contraseña');
            return;
        }
        
        // Llamada a la API
        await loginUser(email, password);
    });

    async function loginUser(email, password) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        hideError();

        try {
            console.log('Intentando login...', email);
            
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.token) {
                // Guardar token (ambas versiones para compatibilidad)
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('token', data.token);
                
                // Guardar usuario completo como objeto
                const usuario = {
                    email: data.email,
                    usuarioId: data.usuarioId,
                    nombreResponsable: data.nombreUsuario || data.nombreResponsable,
                    nombre: data.nombreUsuario,
                    rol: data.rol
                };
                localStorage.setItem('usuario', JSON.stringify(usuario));
                
                // También guardar por separado para compatibilidad
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userId', data.usuarioId);
                localStorage.setItem('userName', data.nombreUsuario);
                localStorage.setItem('userRole', data.rol);
                
                console.log('Login exitoso');
                
                window.location.href = 'principal.html';
            } else {
                showError(data.message || 'Email o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error completo:', error);
            showError('Error de conexión con el servidor. Verifica que el backend esté corriendo en ' + API_URL);
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }
    }

    function hideError() {
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.classList.remove('show');
        }
    }

    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const appleBtn = document.querySelector('.apple-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            console.log('Google login clicked');
            alert('Google login no implementado aún');
        });
    }

    if (appleBtn) {
        appleBtn.addEventListener('click', () => {
            console.log('Apple login clicked');
            alert('Apple login no implementado aún');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            console.log('Facebook login clicked');
            alert('Facebook login no implementado aún');
        });
    }
});
