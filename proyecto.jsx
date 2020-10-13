window.addEventListener("scroll", function() {
    scrollNav()			
})

function scrollNav() {
    
    var nav = document.querySelector(".nav-bar")

    if (window.scrollY > 15)
        nav.classList.remove("top-nav-bar")
    else
        nav.classList.add("top-nav-bar") 
}

//Cover Section

// function search
document.querySelector('.coverSection-div-button button').addEventListener('click', ()=>{
    search();
})

let slider = document.getElementById("filterRange");
let output = document.getElementById("rangeValue");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

async function search (){
    let filterType= document.getElementById("filterType")
    let filterRange= document.getElementById ("filterRange")
    let filterPrice= document.getElementById ("filterPrice")
    let restaurantList=await getRestaurantList(filterType.value, filterRange.value, filterPrice.value);
    let randomIndex= Math.floor(Math.random()*restaurantList.length);
    let randomRestaurant =restaurantList[randomIndex];
    
    let name = document.getElementById("name");
    name.innerHTML= randomRestaurant.name;

    let type = document.getElementById("type");
    type.innerHTML= randomRestaurant.servesCuisine;
    let ranking = document.getElementById("ranking");
    ranking.innerHTML= randomRestaurant.aggregateRatings.thefork.ratingValue;
    //let distance = document.getElementById("distance");
    //distance.innerHTML= randomRestaurant.name;
    let middlePrice = document.getElementById("middlePrice");
    middlePrice.innerHTML= randomRestaurant.priceRange;
    let picture = document.getElementById("picture");
    picture.setAttribute("src",randomRestaurant.mainPhotoSrc);
    //src="https://maps.google.com/maps?q=41.3886367,2.1599243&hl=es&z=14&output=embed"
    let map= document.getElementById("maps");
    map.setAttribute ("src",`https://maps.google.com/maps?q=${randomRestaurant.geo.latitude},${randomRestaurant.geo.longitude}&hl=es&z=14&output=embed`)
}

async function callAPI(tagId, rating,pageNumber, price){
    const responseRestaurantList=await fetch (`https://thefork.p.rapidapi.com/restaurants/list?filterRestaurantTagIdList=${tagId}&pageNumber=${pageNumber}&pageSize=10&filterRateStart=${rating}&queryPlaceValueCityId=41710&filterPriceEnd=${price}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "thefork.p.rapidapi.com",
            "x-rapidapi-key": "aca3225584msha8950f36b0c8910p18946fjsnc4bd7d77b5f1"
        }
    })
    const restaurantList=await responseRestaurantList.json();
    return restaurantList;
}

async function getRestaurantList(tagId, rating, price){    
    let restaurants = [];
    let response= await callAPI(tagId, rating, 1, price);
    restaurants = restaurants.concat(response.data)
    let numberOfPages = response.meta.page.last;
    if(numberOfPages > 10){
        numberOfPages = 10;
    }
    for(let i=2; i<=numberOfPages;i++){
        let r = await callAPI(tagId, rating, i, price);
        restaurants = restaurants.concat(r.data);
    }
    return restaurants;
}