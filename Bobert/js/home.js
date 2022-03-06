const title = document.querySelector('#title h1')
const titley = document.querySelector('#title h1').offsetTop
const titlex = document.querySelector('#title h1').offsetLeft


let y = titley

let scrolly = 0

document.body.onscroll = function() {
    scrolly = window.scrollY

    if (window.innerWidth >= 669) {
        if (scrolly > titley) {
            title.style.top = `.6rem`
            title.style.left = `4rem`
            title.style.fontSize = '2rem'
        } else {
            title.style.top = titley - scrolly + 'px'
            title.style.left = titlex + 'px'
            title.style.fontSize = 'Min(6vw, 7rem)'
        }
    }
}