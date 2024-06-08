// const dataTableBodyId = document.getElementById("dataTableBodyId")
// let table;
// const loadMoreBtn = document.getElementById("movies-load-more")
// loadMoreBtn.addEventListener("click", async () => {
//     await movieData()
// })

// async function fetchMovies() {
//     const res = await fetch("/api/movie/get-movies")
//     const data = await res.json()
//     return data
// }

// async function movieData() {
//     const data = await fetchMovies();
//     if (table != undefined) {
//         table.insert({
//             headings: data.headers,
//             data: data.data,
//         });
//     }
// }

// window.addEventListener('DOMContentLoaded', async event => {
//     // Simple-DataTables
//     // https://github.com/fiduswriter/Simple-DataTables/wiki
//     table = new simpleDatatables.DataTable("#datatablesSimple");
//     await movieData()
// });

const dataTableBodyId = document.getElementById("dataTableBodyId")
let datatableSearch;
let table;

async function fetchMovies(start, length) {
    const res = await fetch(`/api/movie/get-movies?start=${start}&length=${length}`);
    const data = await res.json();
    return data;
}

async function movieData(start, length) {
    const data = await fetchMovies(start, length);
    if (table) {
        const queryData = {};
        queryData.headings = Object.keys(data[0]);
        queryData.headings.shift();


        const values = [];
        for (const v of data) {
            const obj = {
                movieID: v.movieId,
                title: v.title,
                genres: v.genres,
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
function throttle(callback, delay = 1000) {
    let shouldWait = false;
    let watingArgs;
    const timeoutFn = () => {
      if (watingArgs === null) {
        shouldWait = false;
      } else {
        callback(...watingArgs);
        watingArgs = null;
        setTimeout(timeoutFn, delay);
      }
    };
  
    return (...args) => {
      if (shouldWait) {
        watingArgs = args;
        return;
      }
  
      callback(...args);
      shouldWait = true;
      setTimeout(timeoutFn, delay);
    };
  }
window.addEventListener('DOMContentLoaded', async event => {
    // Simple-DataTables
    table = new simpleDatatables.DataTable("#datatablesSimple");
    datatableSearch = document.getElementsByClassName("datatable-input")[0];
    const updateThrottleText = throttle((text) => {
        datatableSearch.textContent = text;
        
        fetch(`/api/movie/get-movie?query=${text}`)
            .then((res) => res.json())
            .then((res) => {
                const queryData = {};
                queryData.headings = Object.keys(res[0]);
                queryData.headings.shift();

                const values = [];
                for (const v of res) {
                    const obj = {
                        movieID: v.movieId,
                        title: v.title,
                        genres: v.genres,
                    };
                    values.push(Object.values(obj));
                }

                queryData.data = values;
                matched = queryData;
                table.insert({
                    headings: matched.headings,
                    data: matched.data,
                });
            })
    }, 250);

    datatableSearch.addEventListener("input", (e) => {
        updateThrottleText(e.target.value);
    });
    // table.on("datatable.search", function (query, matched) {

    //     if (query === "") {
    //         return movieData(0, 10).then(res => res)
    //     }

    //     fetch(`/api/movie/get-movie?query=${query}`)
    //         .then((res) => res.json())
    //         .then((res) => {
    //             const queryData = {};
    //             queryData.headings = Object.keys(res[0]);
    //             queryData.headings.shift();

    //             const values = [];
    //             for (const v of res) {
    //                 const obj = {
    //                     movieID: v.movieId,
    //                     title: v.title,
    //                     genres: v.genres,
    //                 };
    //                 values.push(Object.values(obj));
    //             }

    //             queryData.data = values;
    //             matched = queryData;
    //             table.insert({
    //                 headings: matched.headings,
    //                 data: matched.data,
    //             });
    //         })


    // });
    await movieData(0, 10); // Load initial data
});

const loadMoreBtn = document.getElementById("movies-load-more");
let start = 10; // Initial start index for loading more
loadMoreBtn.addEventListener("click", async () => {
    await movieData(start, 10);
    start += 10; // Increment start index for next load
});
