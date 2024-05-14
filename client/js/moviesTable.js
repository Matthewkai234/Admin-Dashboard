const dataTableBodyId = document.getElementById("dataTableBodyId")

    async function fetchMovies(){
        const res = await fetch("/api/movie/get-movies")
        // const data = await res.json()
        const data = await res.text()
        console.log(data);
        return data
    }
    async function movieData(){
    const data = await fetchMovies()
    dataTableBodyId.innerHTML= data;
    // dataTableBodyId.textContent=""
    // data.forEach((item, index)=>{
    //     if (index >100)
    //         return;
    //     const row = document.createElement("tr")
    //     const movieId = document.createElement("td")
    //     const movieTitle = document.createElement("td")
    //     const genre = document.createElement("td")
    //     movieId.textContent=item.movieId
    //     movieTitle.textContent=item.title 
    //     genre.textContent=item.genres
    //     row.appendChild(movieId)
    //     row.appendChild(movieTitle)
    //     row.appendChild(genre)
    //     dataTableBodyId.appendChild(row)
    //     console.log(2)
    // })
    }
    
    window.addEventListener('DOMContentLoaded', async event => {
        // Simple-DataTables
        // https://github.com/fiduswriter/Simple-DataTables/wiki
        await movieData()
        const datatablesSimple = document.getElementById('datatablesSimple');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    });
    

    