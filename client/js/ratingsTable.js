const dataTableBodyId = document.getElementById("dataTableRatingsId")
let table;
const loadMoreBtn = document.getElementById("ratings-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await ratingsData()
})


async function fetchRatings() {
    const res = await fetch("/api/ratings/get-ratings")
    const data = await res.json()
    return data
}

async function ratingsData() {
    const data = await fetchRatings();
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
    await ratingsData()
});
