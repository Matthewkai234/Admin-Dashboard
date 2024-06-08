const dataTableBodyId = document.getElementById("dataTableRatingsId")
let datatableSearch;
let table;
let inputText = '';

async function fetchRatings(start, length) {
    const res = await fetch(`/api/ratings/get-ratings?start=${start}&length=${length}`);
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
    const res = await fetch(`/api/ratings/get-rating?query=${inputText}`)
    const data = await res.json();

    const queryData = {};
    queryData.headings = Object.keys(data[0]);
    queryData.headings.shift();


    const values = [];
    for (const v of data) {
        const obj = {
            userId: v.userId,
            movieID: v.movieId,
            rating: v.rating,
            timestamp: v.timestamp,
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

async function ratingData(start, length) {
    const data = await fetchRatings(start, length);
    if (table) {
        const queryData = {};
        queryData.headings = Object.keys(data[0]);
        queryData.headings.shift();


        const values = [];
        for (const v of data) {
            const obj = {
                userId: v.userId,
                movieID: v.movieId,
                rating: v.rating,
                timestamp: v.timestamp,
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
    await ratingData(0, 10); // Load initial data
});

const loadMoreBtn = document.getElementById("ratings-load-more");
let start = 10; // Initial start index for loading more
loadMoreBtn.addEventListener("click", async () => {
    await ratingData(start, 10);
    start += 10; // Increment start index for next load
});
