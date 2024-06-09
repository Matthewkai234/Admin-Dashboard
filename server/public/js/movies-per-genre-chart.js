let chart;

const predefinedGenres = [
    "Action", "Adventure", "Animation", "Children", "Comedy", "Crime", "Documentary", "Drama", "Fantasy",
    "Film-Noir", "Horror", "IMAX", "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
].sort();

function populateGenreOptions() {
    const genresContainer = document.getElementById('genresContainer');
    genresContainer.innerHTML = ''; // Clear any existing options
    predefinedGenres.forEach(genre => {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.id = `genre-${genre}`;
        radioButton.value = genre;
        radioButton.name = 'genre';
        radioButton.className = 'mr-2';

        const label = document.createElement('label');
        label.htmlFor = `genre-${genre}`;
        label.appendChild(document.createTextNode(genre));

        const div = document.createElement('div');
        div.className = 'form-check form-check-inline';
        div.appendChild(radioButton);
        div.appendChild(label);

        genresContainer.appendChild(div);
    });
}

async function fetchMovies() {
    try {
        const response = await fetch('/api/movie/get-movies');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched movies data:', data); // Log data for debugging
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return null;  // Return null if there's an error
    }
}

function getSelectedGenre() {
    const radioButton = document.querySelector('#genresContainer input[type="radio"]:checked');
    return radioButton ? radioButton.value : '';
}

async function fetchMoviesCountPerGenre(selectedGenre) {
    try {
        const genreQuery = selectedGenre ? `?genre=${selectedGenre}` : '';
        const response = await fetch(`/api/movie/get-movies-count-per-genre${genreQuery}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched movies count per genre:', data); // Log data for debugging
        return data;
    } catch (error) {
        console.error('Error fetching movies count per genre:', error);
        return null;  // Return null if there's an error
    }
}

function transformDataForChart(data, selectedGenre) {
    if (!data) {
        return { labels: [], datasets: [] };  // Return empty data if there's an error
    }

    let labels = [];
    let values = [];

    if (selectedGenre) {
        const selectedData = data.find(item => item._id.toLowerCase() === selectedGenre.toLowerCase());
        if (selectedData) {
            labels = [selectedData._id];
            values = [selectedData.count];
        }
    } else {
        labels = data.map(item => item._id);
        values = data.map(item => item.count);
    }

    return {
        labels,
        datasets: [{
            label: 'Movies per Genre',
            data: values,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };
}

async function createChart() {
    try {
        populateGenreOptions();

        const selectedGenre = getSelectedGenre();
        const data = await fetchMoviesCountPerGenre(selectedGenre);
        const chartData = transformDataForChart(data, selectedGenre);

        const ctx = document.getElementById('movies-per-genre-chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

async function updateChart() {
    try {
        const selectedGenre = getSelectedGenre();
        const data = await fetchMoviesCountPerGenre(selectedGenre);
        const chartData = transformDataForChart(data, selectedGenre);

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('movies-per-genre-chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

function clearFilters() {
    const radioButtons = document.querySelectorAll('#genresContainer input[type="radio"]');
    radioButtons.forEach(radioButton => radioButton.checked = false);
    updateChart();
}

document.addEventListener('DOMContentLoaded', createChart);