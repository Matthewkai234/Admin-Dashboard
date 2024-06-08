// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

async function fetchMovies_Year() {
    const response = await fetch('/api/movie/get-movies');
    const data = await response.json();
    return data;
}

function transformDataForChart_Year(data) {
    const movies = data.data.map(item => ({
        movieId: item[0],
        title: item[1],
        genres: item[2]
    }));

    const movieCountByYear = movies.reduce((acc, movie) => {
        const year = parseInt(movie.title.match(/\((\d{4})\)/)?.[1], 10);
        if (year) {
            if (!acc[year]) {
                acc[year] = 0;
            }
            acc[year]++;
        }
        return acc;
    }, {});

    const labels = Object.keys(movieCountByYear).sort();
    const values = labels.map(year => movieCountByYear[year]);

    return {
        labels,
        datasets: [{
            label: 'Movies per Year',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
}

async function createChart_Year() {
    const data = await fetchMovies_Year();
    const chartData = transformDataForChart_Year(data);

    const ctx = document.getElementById("dash-movies-year").getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

createChart_Year();
