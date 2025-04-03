const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcnR0dnVmeGxqamF2bHVpZWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDkwMjcsImV4cCI6MjA1ODI4NTAyN30.zNPqfseOF4uv90V2s6Wt5VfobBWV0hQX7kOnEBDa388';
const supabaseURL = 'https://uqrttvufxljjavluieic.supabase.co';
const _supabase = supabase.createClient(supabaseURL, apiKey);

document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = './index.html';
});

document.getElementById('submit-recipe').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const ingredients = document.getElementById('ingredients').value.split('\n').map(item => item.trim()).filter(item => item !== '');
    const steps = document.getElementById('steps').value.split('\n').map(item => item.trim()).filter(item => item !== '');
    const messageDiv = document.getElementById('message');

    try {
        const { data: { session } } = await _supabase.auth.getSession();

        if (!session) {
            window.location.href = './signin.html';
            return;
        }

        const userId = session.user.id; // Get the user ID

        const { error } = await _supabase
            .from('recipes')
            .insert([{ title, ingredients, steps, user_id: userId }]); // Include user_id

        if (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.classList.add('error');
        } else {
            messageDiv.textContent = 'Recipe added successfully!';
            messageDiv.classList.add('success');
            document.getElementById('title').value = '';
            document.getElementById('ingredients').value = '';
            document.getElementById('steps').value = '';
        }
    } catch (e) {
        messageDiv.textContent = 'An unexpected error occurred.';
        messageDiv.classList.add('error');
        console.error(e);
    }
});