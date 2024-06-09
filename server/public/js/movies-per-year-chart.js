let chart;

        async function fetchMoviesCountPerYear(startYear, endYear) {
            const response = await fetch(`/api/movie/get-movies-count-per-year?startYear=${startYear}&endYear=${endYear}`);
            const data = await response.json();
            console.log("Fetched data:", data);
            return data;
        }

        function drawMoviesPerYearChart(moviesCount) {
            const labels = moviesCount.map(item => item._id);
            const values = moviesCount.map(item => item.count);

            if (chart) {
                chart.destroy();
            }

            const ctx = document.getElementById('movies-per-year-chart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Movies Released',
                        data: values,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        async function createChart() {
            const startYear = parseInt(document.getElementById('startYear').value);
            const endYear = parseInt(document.getElementById('endYear').value);
            const data = await fetchMoviesCountPerYear(startYear, endYear);
            drawMoviesPerYearChart(data);
        }

        async function updateChart() {
            const startYear = parseInt(document.getElementById('startYear').value);
            const endYear = parseInt(document.getElementById('endYear').value);
            const data = await fetchMoviesCountPerYear(startYear, endYear);
            drawMoviesPerYearChart(data);
        }

        createChart();