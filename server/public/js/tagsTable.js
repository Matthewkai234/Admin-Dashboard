const dataTableBodyId = document.getElementById("dataTableTagsId")
let table;
const loadMoreBtn = document.getElementById("tags-load-more")
loadMoreBtn.addEventListener("click", async () => {
    await tagsData()
})


async function fetchTags() {
    const res = await fetch("/api/tags/get-tags")
    const data = await res.json()
    return data
}

async function tagsData() {
    const data = await fetchTags();
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
    await tagsData()
});

    