
let result = []
let keyWords = ''
let checkLastCall = ''
async function fetchRepo() {

    let searchStr = keyWords.trim()
    if (searchStr) {
        if(searchStr === checkLastCall){
           
            return
        }
        showLoader()
        let url = `https://api.github.com/search/repositories?q=${searchStr}+in:name`
        let response = await fetch(url)
        let responseData = await response.json()
        result = responseData.items
        listResult(result, searchResult)
        checkLastCall = searchStr
    } else {
        result = []
        listResult([], searchResult)
    }
    hideLoader()
    console.log(result)
    console.log(checkLastCall)
}


const debounce = (fn, debounceTime) => {
    let timer;
    return function(...args){
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      },debounceTime)
    }
}

const debouncedFetch = debounce(fetchRepo, 600)

const searchLine = document.querySelector('#inputSearch')


searchLine.addEventListener('input', function(){
    keyWords = this.value
    
    debouncedFetch()
})

let searchResult = document.querySelector('#inputList')
function listResult(data, elem){
    if(data){
        elem.innerHTML = ''
        let innerElem = ''
        data.forEach(item => {
            innerElem += `
            <li>${item.name}</li>`
        });

        elem.innerHTML = innerElem
        if (data.length > 0) {
            elem.classList.add('active')
        } else {
            elem.classList.remove('active')
        }
        inputListLi = document.querySelectorAll('#inputList li')
        addToSelectedRepositories()
    }
}

let repoMenu = document.querySelector('#selectedRepositories')
let loader = document.querySelector('.loader')
function showLoader(){
    loader.style.display = 'block'
}
function hideLoader(){
    loader.style.display = 'none'
}


function addToSelectedRepositories(){
    
    inputListLi.forEach((item,index) => {
        let targetRepo = result[index]
      item.addEventListener('click', function () {
        repoMenu.innerHTML += `<li><p>Name: ${targetRepo.name} </p>
        <p>Owner:${targetRepo.owner.login} </p>
        <p>Stars:${targetRepo.stargazers_count} </p>
        <button class="delete-button"></button>
        </li>`
      })
    })
    repoMenu.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            let listItem = event.target.closest('li')
            if(listItem){
                listItem.remove()
            }
        }
    });
  }












