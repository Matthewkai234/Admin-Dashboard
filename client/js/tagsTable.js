const dataTableBodyId = document.getElementById("dataTableTagsId")

    async function fetchMovies(){
        const res = await fetch("/api/tags/get-tags")
        const data = await res.json()
        return data
    }
    async function tagsData(){
    const data = await fetchMovies()
    dataTableBodyId.textContent=""
    data.forEach((item, index)=>{
        if (index >100)
            return;
        const row = document.createElement("tr")
        const userId = document.createElement("td")
        const movieId = document.createElement("td")
        const tag = document.createElement("td")
        const timestamp = document.createElement("td")
        userId.textContent=item.userId
        movieId.textContent=item.movieId
        tag.textContent=item.tag 
        timestamp.textContent=item.timestamp
        row.appendChild(userId)
        row.appendChild(movieId)
        row.appendChild(tag)
        row.appendChild(timestamp)
        dataTableBodyId.appendChild(row)
        console.log(2)
    })
    }
    
    window.addEventListener('DOMContentLoaded', async event => {
        // Simple-DataTables
        // https://github.com/fiduswriter/Simple-DataTables/wiki
        await tagsData()
        const datatablesSimple = document.getElementById('datatablesSimple');
        if (datatablesSimple) {
            new simpleDatatables.DataTable(datatablesSimple);
        }
    });
    

    