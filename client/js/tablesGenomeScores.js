const dataTableBodyId = document.getElementById("dataTableGenomeScoresId")
let table;
const loadMoreBtn = document.getElementById("genome-scores-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await genomeScoresData()
})

async function fetchGenomeScores() {
    const res = await fetch("/api/genome-scores/get-genome-scores")
    const data = await res.json()
    return data
}

async function genomeScoresData() {
    const data = await fetchGenomeScores();
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
    await genomeScoresData()
});
    

    