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

document.querySelector('#geo').addEventListener('click',async ()=>{
    geolocalize();
});

async function geolocalize(){
    if ("geolocation" in navigator) {
        /* la geolocalización está disponible */
        navigator.geolocation.getCurrentPosition(async function(position) {
            const response = await geoAPI(position.coords.longitude, position.coords.latitude);
            let postCode = response.address.postcode;
            
            const filterPostCode = document.getElementById("filterPostCode");
            filterPostCode.value = postCode;
          });
    } else {
        /* la geolocalización NO está disponible */
        alert("The gps is not active!")
    }
}

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
    let filterPostCode = document.getElementById("filterPostCode");
    let restaurantList=await getRestaurantList(filterType.value, filterRange.value, filterPrice.value, filterPostCode.value);
    let randomIndex= Math.floor(Math.random()*restaurantList.length);
    let randomRestaurant =restaurantList[randomIndex];
    
    let name = document.getElementById("name");
    name.innerHTML= randomRestaurant.name;

    let type = document.getElementById("type");
    type.innerHTML= randomRestaurant.servesCuisine;
    let ranking = document.getElementById("ranking");
    ranking.innerHTML= randomRestaurant.aggregateRatings.thefork.ratingValue;
    let middlePrice = document.getElementById("middlePrice");
    middlePrice.innerHTML= randomRestaurant.priceRange;
    let picture = document.getElementById("picture");
    picture.setAttribute("src",randomRestaurant.mainPhotoSrc);
    let map= document.getElementById("maps");
    map.setAttribute ("src",`https://maps.google.com/maps?q=${randomRestaurant.geo.latitude},${randomRestaurant.geo.longitude}&hl=es&z=14&output=embed`)
}

async function geoAPI(longitude, latitude)
{
    const geoResponse = await fetch(`https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?polygon_geojson=0&accept-language=en&polygon_text=0&polygon_threshold=0.0&polygon_svg=0&addressdetails=1&polygon_kml=0&zoom=18&namedetails=0&limit=5&format=json&lon=${longitude}&lat=${latitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
            "x-rapidapi-key": "aca3225584msha8950f36b0c8910p18946fjsnc4bd7d77b5f1"
        }
    })
    const position = await geoResponse.json();
    return position;
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

async function getRestaurantList(tagId, rating, price, postCode){    
    let restaurants = [];
    let filteredRestaurants = [];
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
    if(postCode)
    {
        filteredRestaurants = restaurants.filter(function(restaurant){
            return restaurant.address.postalCode == postCode;
        });
    }
    if(filteredRestaurants.length > 0){
        restaurants = filteredRestaurants;
    }
    return restaurants;
}