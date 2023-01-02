// apikey=858c410f
const form = document.forms.form;
const resDiv = document.querySelector('.resDiv');
const pigDiv = document.querySelector('.pigDiv'); 
const detDiv = document.querySelector('.detDiv');
const showTitle = document.querySelector('.showTitle');
const searchBtn = form.elements.search;
const filmTitle = form.elements.title;
const filmType = form.elements.type;


window.addEventListener('keydown', (e)=>{
    if (e.key == 'Enter'){e.preventDefault();}
})

function getApi (param){
    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open('GET', `https://www.omdbapi.com/?apikey=858c410f&${param}`);
    request.onload = ()=>{
        if (request.status >= 200 && request.status < 300 && !(/plot=/).test(param)){
            getFilm(request.response);
        } else if(request.status >= 200 && request.status < 300 && (/plot=/).test(param)){
            showDetails(request.response);
        }
         else{
            alert('Sorry, but something went wrong.');
        }
    }
    request.send();
}

searchBtn.addEventListener('click', ()=>{
    resDiv.innerHTML = '';
    pigDiv.innerHTML = '';
    detDiv.innerHTML = '';
    showTitle.innerHTML = '';
    getApi(`s=${filmTitle.value}&type=${filmType.value}`);
})

function getFilm(data){
    if (data.Response == 'False'){
        alert (data.Error);
    } else{
        resView(data);
        if (data.totalResults>10){
            const count = Math.ceil(data.totalResults/10);
            for (let i = 1; i<=count; i++){
                const div = document.createElement('button');
                div.classList.add('pugBtn');
                div.innerHTML = i;
                pigDiv.append(div);
                div.addEventListener('click', ()=>{
                    resDiv.innerHTML = '';
                    detDiv.innerHTML = '';
                    showTitle.innerHTML = '';
                    let divs = document.querySelectorAll('.pugBtn');
                    divs.forEach((div)=>{div.disabled = false;});
                    getApi(`s=${filmTitle.value}&type=${filmType.value}&page=${div.innerHTML}`);
                    div.disabled = true;
                })  
            }
        }
    }
}

function resView(response){
    for(let item of response.Search){
        let div = document.createElement("div");
        div.classList.add('resultDivs');
        resDiv.append(div);
        div.innerHTML+=`<img src=${item.Poster}>`;
        let div1 = document.createElement("div");
        div1.classList.add('resultText');
        div1.innerHTML+=`<p>${item.Type}</p>`;
        div1.innerHTML+=`<p>${item.Year}</p>`;
        div1.innerHTML+=`<p>${item.Title}</p>`;
        div1.innerHTML+=`<input type="button" id="details" value="Details">`;
        div.append(div1);
        div1.addEventListener('click', (e)=>{
            let target = e.target;
            if(target.tagName == 'INPUT'){
                showTitle.innerHTML = '';
                detDiv.innerHTML = '';
                getApi(`i=${item.imdbID}&plot=full`);
            }
        })

    }
}

function showDetails(item){
    showTitle.innerHTML = 'Film info:';
    const div = document.createElement("div");
    div.classList.add('posterDiv');
    div.innerHTML = `<img src=${item.Poster}>`;
    detDiv.append(div);
    const table = document.createElement("table");
    table.classList.add('posterTable');
    for (let [key, value] of Object.entries(item)){
        if (typeof value !=='object' && key !== 'Poster' && key !=='Response' && value !== 'N/A'){
            const row = document.createElement("tr");
            if (key == 'imdbID'){
                row.innerHTML = `<td><b>IMDb:</b></td><td><a target="blank" href="https://www.imdb.com/title/${value}/">Click to look on IMDb</a></td>`;
            } else {
                row.innerHTML = `<td><b>${key}:</b></td><td>${value}</td>`;
            }
            table.append(row);
        }
    }
    detDiv.append(table);
}