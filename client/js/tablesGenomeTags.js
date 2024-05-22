const dataTableBodyId = document.getElementById("dataTableGenomeTagsId")
let table;
const loadMoreBtn = document.getElementById("genome-tags-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await genomeTagsData()
})


async function fetchGenomeTags() {
    const res = await fetch("/api/genome-tags/get-genome-tags")
    const data = await res.json()
    return data
}

async function genomeTagsData() {
    const data = await fetchGenomeTags();
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
    await genomeTagsData()
});
    

    