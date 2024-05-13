const dataTableBodyId = document.getElementById("dataTableLinksId")

    async function fetchMovies(){
        const res = await fetch("/api/links/get-links")
        // const data = await res.json()
        const data = await res.text()
        console.log(data);
        return data
    }
    async function linksData(){
    const data = await fetchMovies()
    dataTableBodyId.innerHTML= data;

    // dataTableBodyId.textContent=""
    // data.forEach((item, index)=>{
    //     if (index >100)
    //         return;
    //     const row = document.createElement("tr")
    //     const movieId = document.createElement("td")
    //     const imbld = document.createElement("td")
    //     const tmdbld = document.createElement("td")
    //     movieId.textContent=item.movieId
    //     imbld.textContent=item.imdbId
    //     tmdbld.textContent=item.tmdbId
    //     row.appendChild(movieId)
    //     row.appendChild(imbld)
    //     row.appendChild(tmdbld)
    //     dataTableBodyId.appendChild(row)
    //     console.log(2)
    // })
    }
    
    window.addEventListener('DOMContentLoaded', async event => {
        // Simple-DataTables
        // https://github.com/fiduswriter/Simple-DataTables/wiki
        await linksData()
        const datatablesSimple = document.getElementById('datatablesSimple');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    });
    

    