let data
let films
const app = document.querySelector('.application')
const click = document.querySelector('.click')
const input = document.querySelector('.searchFilm')
const clear = document.querySelector('.times')
const modalWrapper = document.querySelector('.wrapper')
modalWrapper.addEventListener('click', (e) => {
    console.log(1);
    if (e.target.className == 'wrapper') {
        modalWrapper.style.display = 'none'
        document.body.style.overflowY='auto'
    }
})
clear.onclick = () => {
    input.value = ''
}

click.addEventListener('click', () => {
    app.innerHTML = ''
    getData(input.value)
        .then(res => {
            data = (JSON.parse(res)).Search
            films = data.map(item => new Films(item.Poster, item.Title, item.Type, item.Year, item.imdbID))
            films.forEach(film => film.renderIn(app))
        })
})
function getData(filmName) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest
        xhr.open('GET', `http://www.omdbapi.com/?s=${filmName}&page=2&apikey=eeb56d4b`)
        xhr.send()

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(xhr.response)
            }
        }
    })
}

function getOneFilm(id) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest
        xhr.open('GET', `http://www.omdbapi.com/?i=${id}&apikey=eeb56d4b`)
        xhr.send()

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(xhr.response)
            }
        }
    })
}



class Films {
    constructor(poster, title, type, year, id) {
        this.poster = poster
        this.title = title
        this.type = type
        this.year = year
        this.id = id
    }

    renderIn(elem) {
        console.log(this.id)
        elem.innerHTML +=
            `<div class="card position-relative  mr-2 mb-2" style="width: 16rem;height:34rem">
                    <img class="card-img-top" height='350px' src="${this.poster}" alt="Card image cap">
                    <div class="">
                        <h5 class="card-title text-center p-2">${this.title}</h5>
                        <p class="card-text text-center">${this.type}</p>
                        <p class="card-text text-center">${this.year}</p>
                        <button data-id='${this.id}' class="btn position-absolute hre btn-success col-12">more details</button>
                    </div>
                </div>`
    }

}

const getS = el => document.querySelector(el)

const posterImage = getS('.posterImage')
const Title = getS('.Title')
const Info1 = getS('.Info1')
const Content = getS('.Content')
const autors = getS('.autors')
const directed = getS('.directed')
const starring = getS('.starring')
const money = getS('.money')
const awards = getS('.awards')
const raitings = getS('.raitings')

window.addEventListener('click', (e) => {
    if (e.target.className.includes('hre')) {
        getOneFilm(e.target.dataset.id)
            .then(res => {
                let data = JSON.parse(res)
                Title.childNodes[0].nodeValue=data.Title
                Info1.childNodes[0].nodeValue=data.Rated +' '+data.Year +' '+data.Genre
                Content.childNodes[0].nodeValue=data.Plot
                autors.childNodes[1].nodeValue=data.Writer
                directed.childNodes[1].nodeValue=data.Director
                starring.childNodes[1].nodeValue=data.Actors
                money.childNodes[1].nodeValue=data.BoxOffice
                awards.childNodes[1].nodeValue=data.Awards
                posterImage.src=data.Poster
                raitings.innerHTML=''
                data.Ratings.forEach(el=>{
                    const p=document.createElement('p')
                    p.innerHTML=el.Source +' '+el.Value
                    raitings.appendChild(p)
                })
                modalWrapper.style.display='flex'
                document.body.style.overflowY='hidden'
            })



    }
})
window.addEventListener('scroll',(e)=>{
    modalWrapper.style.top=window.scrollY+'px'
})