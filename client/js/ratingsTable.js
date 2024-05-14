const dataTableBodyId = document.getElementById("dataTableRatingsId")

    async function fetchMovies(){
        const res = await fetch("/api/ratings/get-ratings")
        const data = await res.json()
        return data
    }
    async function ratingsData(){
    const data = await fetchMovies()
    dataTableBodyId.textContent=""
    data.forEach((item, index)=>{
        if (index >100)
            return;
        const row = document.createElement("tr")
        const userId = document.createElement("td")
        const movieId = document.createElement("td")
        const rating = document.createElement("td")
        const timestamp = document.createElement("td")
        userId.textContent=item.userId
        movieId.textContent=item.movieId
        rating.textContent=item.rating 
        timestamp.textContent=item.timestamp
        row.appendChild(userId)
        row.appendChild(movieId)
        row.appendChild(rating)
        row.appendChild(timestamp)
        dataTableBodyId.appendChild(row)
        console.log(2)
    })
    }
    
    window.addEventListener('DOMContentLoaded', async event => {
        // Simple-DataTables
        // https://github.com/fiduswriter/Simple-DataTables/wiki
        await ratingsData()
        const datatablesSimple = document.getElementById('datatablesSimple');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    });
    

    