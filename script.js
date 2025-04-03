// Connect to supabase
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcnR0dnVmeGxqamF2bHVpZWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDkwMjcsImV4cCI6MjA1ODI4NTAyN30.zNPqfseOF4uv90V2s6Wt5VfobBWV0hQX7kOnEBDa388';
const supabaseURL = 'https://uqrttvufxljjavluieic.supabase.co';
const _supabase = supabase.createClient(supabaseURL, apiKey);

_supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
        // User is not signed in, redirect to sign-in page
        window.location.href = './signin.html';
    } else {

        let cachedSearchResults = [];


        // Keep track of which content is shown below search bar
        let activeTab = '';
        document.getElementById('recipe').style.display = 'none';
        document.getElementById('search-results').style.display = 'none';
        searchWithKeywords()

        // Deal with signout
        const userEmailSpan = document.getElementById('user-email');
        const signoutButton = document.getElementById('signout-button');

        userEmailSpan.textContent = `Hello, ${session.user.email}!`;
        signoutButton.style.display = 'inline-block'; // Show signout button

        signoutButton.addEventListener('click', async () => {
            try {
                await _supabase.auth.signOut();
                window.location.href = './signin.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });



        function changeActiveTab(newTab) {
            if (activeTab !== '')
                document.getElementById(activeTab).style.display = 'none'
            document.getElementById(newTab).style.display = 'block'
            activeTab = newTab
        }


        // Switch to a recipe view
        function displayRecipe(recipe) {
            changeActiveTab('recipe')

            const recipeDiv = document.getElementById("recipe");
            let html = `<h1>${recipe.title}</h1>`;

            html += "<h2>Ingredients</h2><ul>";
            recipe.ingredients.forEach(ingredient => {
                html += `<li>${ingredient}</li>`;
            });
            html += "</ul>";

            html += "<h2>Steps</h2><ol>";
            recipe.steps.forEach(step => {
                html += `<li>${step}</li>`;
            });
            html += "</ol>";

            recipeDiv.innerHTML = html;
        }

        // SEARCH BAR TRIGGER ON ENTER
        document.getElementById('search-input').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const searchValue = this.value.toLowerCase().trim(); // Trim whitespace
                const keywords = searchValue ? searchValue.split(' ') : []; // Handle empty search
                searchWithKeywords(keywords);
                event.target.value = '';
            }
        });

        // CALL SUPABASE WITH 'OR' ON ALL KEYWORDS IN THE SEARCH BAR
        async function searchWithKeywords(keywords) {
            let data, error; // Declare data and error outside the if/else blocks

            if (!keywords || keywords.length === 0) {
                ({ data, error } = await _supabase.from('recipes').select());
            } else {
                const searchString = keywords.map(keyword => `'${keyword}'`).join(' | ');
                ({ data, error } = await _supabase.from('recipes').select().textSearch('title', searchString));
            }

            if (error) {
                console.error("Supabase search error:", error);
                return [];
            }

            cachedSearchResults = data;
            displaySearchResults(data);
            return data;
        }

        function displaySearchResults(results) {
            changeActiveTab('search-results')

            const resultsDiv = document.getElementById("search-results");
            let html = "";
            if (results && results.length > 0) {
                results.forEach(result => {
                    html += `<div class="search-result-item" data-recipe-id="${result.id}"><h3>${result.title}</h3></div>`;
                });
            } else {
                html = "<p>No search results found.</p>";
            }
            resultsDiv.innerHTML = html;

            resultsDiv.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const recipeId = parseInt(item.dataset.recipeId);
                    const recipe = cachedSearchResults.find(r => r.id === recipeId); // Get recipe from cached results
                    displayRecipe(recipe);
                });
            });
        }


        // END OF AUTH CHECK
    }
});