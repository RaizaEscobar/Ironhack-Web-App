window.addEventListener("scroll", function() {
    update()			
})

function update() {
    // toggle className based on the scrollTop property of document
    var nav = document.querySelector(".nav-bar")

    if (window.scrollY > 15)
        nav.classList.remove("top-nav-bar")
    else
        nav.classList.add("top-nav-bar") 
}