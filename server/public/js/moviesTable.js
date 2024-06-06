const dataTableBodyId = document.getElementById("dataTableBodyId")
let table;
const loadMoreBtn = document.getElementById("movies-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await movieData()
})

async function fetchMovies() {
    const res = await fetch("/api/movie/get-movies")
    const data = await res.json()
    return data
}

async function movieData() {
    const data = await fetchMovies();
    if (table != undefined) {
        table.insert({
            headings: data.headers,
            data: data.data,
        });
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki
    table = new simpleDatatables.DataTable("#datatablesSimple");
    await movieData()
});
