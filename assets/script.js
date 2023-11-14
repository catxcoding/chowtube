document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    var resultsSection = document.getElementById('recipe-results');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get the user input from the form fields
        var ingredient = document.getElementById('ingredient').value;
        var excludeIngredient = document.getElementById('exclude-ingredient').value;
        var calories = document.getElementById('calories').value;
        var protein = document.getElementById('protein').value;
        var fat = document.getElementById('fat').value;
        var carbs = document.getElementById('carbs').value;
        var diet = document.getElementById('diet').value;
        var cuisine = document.getElementById('cuisine').value;

        // Start building the query URL
        var baseUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=96cb3032d9484e309c1606c98cb9a722';
        var queryParams = [];

        // Add parameters only if fields are filled
        if (ingredient) queryParams.push('includeIngredients=' + encodeURIComponent(ingredient));
        if (excludeIngredient) queryParams.push('excludeIngredients=' + encodeURIComponent(excludeIngredient));
        if (calories) queryParams.push('maxCalories=' + encodeURIComponent(calories));
        if (protein) queryParams.push('minProtein=' + encodeURIComponent(protein));
        if (fat) queryParams.push('minFat=' + encodeURIComponent(fat));
        if (carbs) queryParams.push('minCarbs=' + encodeURIComponent(carbs));
        if (diet && diet !== 'none') queryParams.push('diet=' + encodeURIComponent(diet));
        if (cuisine && cuisine !== 'none') queryParams.push('cuisine=' + encodeURIComponent(cuisine));

        // Combine the base URL with the query parameters
        var queryUrl = baseUrl + (queryParams.length ? '&' + queryParams.join('&') : '');

        // Make the API request
        fetch(queryUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Clear previous results
                resultsSection.innerHTML = '';

                // Handle no results found
                if (!data.results || data.results.length === 0) {
                    resultsSection.innerHTML = '<p>No recipes found. Please try different search criteria.</p>';
                    return;
                }

                // Display the recipes with images and links
                var recipes = data.results;
                recipes.forEach(function (recipe) {
                    var recipeElement = document.createElement('div');
                    recipeElement.className = 'recipe';

                    var title = document.createElement('h4');
                    title.textContent = recipe.title;
                    recipeElement.appendChild(title);

                    if (recipe.image) {
                        var image = document.createElement('img');
                        image.src = recipe.image;
                        image.alt = recipe.title + ' image';
                        recipeElement.appendChild(image);
                    }

                    // Adding link to the recipe here
                    if (recipe.id) {
                        var recipeUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=96cb3032d9484e309c1606c98cb9a722`;
                        // Fetch the detailed recipe information to get the sourceUrl
                        fetch(recipeUrl)
                            .then(detailResponse => detailResponse.json())
                            .then(detailData => {
                                if (detailData.sourceUrl) {
                                    var link = document.createElement('a');
                                    link.href = detailData.sourceUrl;
                                    link.textContent = 'View Recipe';
                                    link.target = '_blank'; // to open in a new tab
                                    recipeElement.appendChild(link);
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching recipe details:', error);
                            });
                    }

                    resultsSection.appendChild(recipeElement);
                });
            })
            .catch(error => {
                // Handle errors
                resultsSection.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            });
    });
});
