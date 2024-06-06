const dataTableBodyId = document.getElementById("dataTableLinksId")
let table;
const loadMoreBtn = document.getElementById("links-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await linksData()
})

async function fetchLinks() {
    const res = await fetch("/api/links/get-links")
    const data = await res.json()
    return data
}

async function linksData() {
    const data = await fetchLinks();
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
    await linksData()
});
