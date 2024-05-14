const dataTableBodyId = document.getElementById("dataTableGenomeTagsId")

    async function fetchMovies(){
        const res = await fetch("/api/genome-tags/get-genome-tags")
        const data = await res.json()
        return data
    }
    async function linksData(){
    const data = await fetchMovies()
    dataTableBodyId.textContent=""
    data.forEach((item, index)=>{

        const row = document.createElement("tr")
        const tagId = document.createElement("td")
        const tag = document.createElement("td")
        tagId.textContent=item.tagId
        tag.textContent=item.tag
        row.appendChild(tagId)
        row.appendChild(tag)
        dataTableBodyId.appendChild(row)
        console.log(2)
    })
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
    

    