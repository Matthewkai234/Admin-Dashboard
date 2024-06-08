async function fetchMoviesGenre() {
    const response = await fetch('/api/movie/get-movies');
    const data = await response.json();
    return data;
}

function transformDataForChartGenre(data) {
    const movies = data.data.map(item => ({
        movieId: item[0],
        title: item[1],
        genres: item[2]
    }));

    // Count the number of movies per genre
    const genreCount = movies.reduce((acc, movie) => {
        const genres = movie.genres.split('|');
        genres.forEach(genre => {
            if (!acc[genre]) {
                acc[genre] = 0;
            }
            acc[genre]++;
        });
        return acc;
    }, {});

    const labels = Object.keys(genreCount);
    const values = labels.map(genre => genreCount[genre]);

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

async function createGenreChart() {
    const data = await fetchMoviesGenre();
    const chartData = transformDataForChartGenre(data);

    const ctx = document.getElementById('dash-movie-genre').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // or 'line', 'pie', etc.
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

createGenreChart();