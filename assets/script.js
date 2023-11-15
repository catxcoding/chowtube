document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    var resultsSection = document.getElementById('recipe-results');

    // Load and display recently viewed recipes
    displayRecentlyViewedRecipes();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get user input from form fields
        var ingredient = document.getElementById('ingredient').value;
        var excludeIngredient = document.getElementById('exclude-ingredient').value;
        var calories = document.getElementById('calories').value;
        var protein = document.getElementById('protein').value;
        var fat = document.getElementById('fat').value;
        var carbs = document.getElementById('carbs').value;
        var diet = document.getElementById('diet').value;
        var cuisine = document.getElementById('cuisine').value;

        // Build the query URL
        var baseUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=96cb3032d9484e309c1606c98cb9a722&number=2';
        var queryParams = [];

        if (ingredient) queryParams.push('includeIngredients=' + encodeURIComponent(ingredient));
        if (excludeIngredient) queryParams.push('excludeIngredients=' + encodeURIComponent(excludeIngredient));
        if (calories) queryParams.push('maxCalories=' + encodeURIComponent(calories));
        if (protein) queryParams.push('minProtein=' + encodeURIComponent(protein));
        if (fat) queryParams.push('minFat=' + encodeURIComponent(fat));
        if (carbs) queryParams.push('minCarbs=' + encodeURIComponent(carbs));
        if (diet && diet !== 'none') queryParams.push('diet=' + encodeURIComponent(diet));
        if (cuisine && cuisine !== 'none') queryParams.push('cuisine=' + encodeURIComponent(cuisine));

        var queryUrl = baseUrl + (queryParams.length ? '&' + queryParams.join('&') : '');

        // API request
        fetch(queryUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                resultsSection.innerHTML = '';

                if (!data.results || data.results.length === 0) {
                    resultsSection.innerHTML = '<p>No recipes found. Please try different search criteria.</p>';
                    return;
                }

                data.results.slice(0, 2).forEach(function (recipe) {
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

                    if (recipe.id) {
                        var link = document.createElement('a');
                        link.href = `https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`;
                        link.textContent = 'View Recipe';
                        link.target = '_blank';
                        link.onclick = function() {
                            saveRecipeToRecentlyViewed({ title: recipe.title, url: link.href });
                        };
                        recipeElement.appendChild(link);
                    }

                    resultsSection.appendChild(recipeElement);
                });
            })
            .catch(error => {
                resultsSection.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            });
    });

    // Recently viewed recipes functions
    function saveRecipeToRecentlyViewed(recipe) {
        var recipes = JSON.parse(localStorage.getItem('recentlyViewedRecipes')) || [];
        recipes = recipes.filter(r => r.url !== recipe.url);
        recipes.unshift(recipe);
        recipes = recipes.slice(0, 3);
        localStorage.setItem('recentlyViewedRecipes', JSON.stringify(recipes));
        displayRecentlyViewedRecipes();
    }

    function displayRecentlyViewedRecipes() {
        var recipes = JSON.parse(localStorage.getItem('recentlyViewedRecipes')) || [];
        var list = document.getElementById('recently-viewed-list');
        list.innerHTML = '';
        recipes.forEach(function(recipe) {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = recipe.url;
            link.textContent = recipe.title;
            link.target = '_blank';
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
    }

    // YouTube Iframe API integration
    window.onYouTubeIframeAPIReady = function() {
        var initialVideoId = 'M7lc1UVf-VE'; // Replace with default or dynamic video ID
        var player = new YT.Player('video-player', {
            height: '360',
            width: '640',
            videoId: initialVideoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        // Player is ready
    }

    function onPlayerStateChange(event) {
        // Handle player state changes
    }

    function searchAndLoadVideo(recipeTitle) {
            var searchQuery = recipeTitle + ' recipe';
            var apiKey = 'AIzaSyBcbRLEkWwZsAN8iaZReHMuQTsRktIpSgA';
            var apiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=1&key=${apiKey}';

            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items.length > 0) {
                    var videoId = data.items[0].id.videoId;
                    loadVideoById(videoId);
                } else {
                    console.log('No videos found for: ', searchQuery);
                }
            })
            .catch(error => console.error('error fetching video: ', error));
        }
        function loadVideoById(videoId) {
            if (player && player.loadVideoById) {
                player.loadVideoById(videoId);
        } else {
            console.error('YouTube player not initialized.')
        }
    }
});
