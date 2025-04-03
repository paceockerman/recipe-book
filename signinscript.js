const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcnR0dnVmeGxqamF2bHVpZWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDkwMjcsImV4cCI6MjA1ODI4NTAyN30.zNPqfseOF4uv90V2s6Wt5VfobBWV0hQX7kOnEBDa388';
const supabaseURL = 'https://uqrttvufxljjavluieic.supabase.co';
const _supabase = supabase.createClient(supabaseURL, apiKey);


_supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        // User is not signed in, redirect to sign-in page
        window.location.href = './index.html';
    }
});

const authForm = document.getElementById('auth-form');
let isSignIn = true; // Start with sign-in form

function renderForm() {
    authForm.innerHTML = `
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Password" required>
                <button id="auth-button">${isSignIn ? 'Sign In' : 'Sign Up'}</button>
                <div id="error-message" class="error"></div>
                <p id="toggle-auth">Or <span style="color:#007bff;">${isSignIn ? 'Sign Up' : 'Sign In'}</span> instead.</p>
            `;

    const authButton = document.getElementById('auth-button');
    const errorMessage = document.getElementById('error-message');
    const toggleAuth = document.getElementById('toggle-auth');

    authButton.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            let result;
            if (isSignIn) {
                result = await _supabase.auth.signInWithPassword({ email, password });
            } else {
                result = await _supabase.auth.signUp({ email, password });
            }

            if (result.error) {
                errorMessage.textContent = result.error.message;
            } else {
                //errorMessage.textContent = isSignIn ? 'Sign in successful!' : 'Sign up successful!';
                window.location.href = './index.html'; // Replace with your redirect.
            }
        } catch (e) {
            errorMessage.textContent = 'An unexpected error occurred.';
            console.error(e);
        }
    });

    toggleAuth.addEventListener('click', () => {
        isSignIn = !isSignIn;
        renderForm();
    });
}

renderForm(); // Initial render