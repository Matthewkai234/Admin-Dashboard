const dataTableBodyId = document.getElementById("dataTableLinksId")
let datatableSearch;
let table;
let inputText = '';

async function fetchLinks(start, length) {
    const res = await fetch(`/api/links/get-links?start=${start}&length=${length}`);
    const data = await res.json();
    return data;
}

const searchButton = document.getElementById("search-btn")
searchButton.addEventListener('click', async ()=>{
    table.data = {
        headings: [

        ],
        data:[],
    }
    table.refresh();
    const res = await fetch(`/api/links/get-link?query=${inputText}`)
    const data = await res.json();

    const queryData = {};
    queryData.headings = Object.keys(data[0]);
    queryData.headings.shift();


    const values = [];
    for (const v of data) {
        const obj = {
            movieID: v.movieId,
            imdbId: v.imdbId,
            tmdbId: v.tmdbId,
        };
        values.push(Object.values(obj));
    }

    queryData.data = values;
    
    table.insert({
        headings: queryData.headings,
        data: queryData.data,
    });

     inputText='';
     table.refresh();
})

async function linksData(start, length) {
    const data = await fetchLinks(start, length);
    if (table) {
        const queryData = {};
        queryData.headings = Object.keys(data[0]);
        queryData.headings.shift();


        const values = [];
        for (const v of data) {
            const obj = {
                movieID: v.movieId,
                imdbId: v.imdbId,
                tmdbId: v.tmdbId,
            };
            values.push(Object.values(obj));
        }

        queryData.data = values;

        table.insert({
            headings: queryData.headings,
            data: queryData.data,
        });
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    // Simple-DataTables
    table = new simpleDatatables.DataTable("#datatablesSimple");
    table.on('datatable.search', function(query, matched) {
        inputText = query;
    });
    await linksData(0, 10); 
});

const loadMoreBtn = document.getElementById("links-load-more");
let start = 10; 
loadMoreBtn.addEventListener("click", async () => {
    await linksData(start, 10);
    start += 10; 
});