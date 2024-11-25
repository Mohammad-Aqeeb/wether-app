const YourWhetherTab = document.querySelector(".YourWhetherTab");
const selectWhetherTab = document.querySelector(".selectWhetherTab");
const locationAccessContainer = document.querySelector(".locationAccess");
const searchWhetherContainer = document.querySelector(".searchWhether");
const loadingContainer = document.querySelector(".loading");
const wheatherContainer = document.querySelector(".wheather");

const grantAccessButton = document.querySelector('.grantAccessButton');
const inputContainer = document.querySelector('.inputContainer');
const searchButton = document.querySelector('.searchButton');
const not_found_container  =document.querySelector('.not-found-container');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = YourWhetherTab;
currentTab.classList.add("abc");
getFromSessionStorage();

YourWhetherTab.addEventListener('click',function(){
    tabChange(YourWhetherTab);
});

selectWhetherTab.addEventListener('click',function(){
    tabChange(selectWhetherTab);
} );


function tabChange(clickedTab)
{
    if(currentTab!=clickedTab)
    {
        currentTab.classList.remove('abc');
        currentTab = clickedTab;
        currentTab.classList.add('abc');
        not_found_container.classList.remove('active');

        if(!searchWhetherContainer.classList.contains('active'))
        {
            locationAccessContainer.classList.remove('active');
            wheatherContainer.classList.remove('active');
            searchWhetherContainer.classList.add('active');
        }
        else{
            searchWhetherContainer.classList.remove('active');
            wheatherContainer.classList.remove('active');
            getFromSessionStorage();
        }
    }   
}

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        locationAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserInfo(coordinates)
    }
}

async function fetchUserInfo(coordinates)
{
    const {lat,lon} = coordinates;
    locationAccessContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    let data;
    try
    {
        data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        data = await data.json();
        loadingContainer.classList.remove('active');
        renderFunction(data);
        wheatherContainer.classList.add('active');
    }catch{
        loadingContainer.classList.remove('active');
        new error('404 error');
    }

}

function renderFunction(data){
    const cityName = document.querySelector(".cityName");
    const flag = document.querySelector(".flag");
    const cityDescription = document.querySelector(".cityDescription");
    const cityDescriptionIcon = document.querySelector(".cityDescriptionIcon");
    const cityTemperature = document.querySelector(".cityTemperature");
    const windspeed = document.querySelector(".windspeed");
    const humidity = document.querySelector(".humidity");
    const clouds = document.querySelector(".clouds");
 
    cityName.innerText = data?.name;
    flag.src = `https://flagcdn.com/144x108/${data.sys.country.toLowerCase()}.png`;
    cityDescription.innerText = data.weather?.[0].description;
    cityDescriptionIcon.src = `https://openweathermap.org/img/w/${data.weather?.[0].icon}.png`;
    cityTemperature.innerText = ((data.main.temp)/10).toFixed(2)+"°C";
    windspeed.innerText = data.wind.speed + "m/s";
    humidity.innerText = data.main.humidity + "%";
    clouds.innerText = data.clouds.all + "%";


}

grantAccessButton.addEventListener('click',getLocation);

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        new Error('Geolocation not available');
    }
}

function showPosition(position){
    const usercoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchUserInfo(usercoordinates);
}

searchButton.addEventListener("click",(e)=>{
    e.preventDefault();
    not_found_container.classList.remove('active');
    let cityName = inputContainer.value;
    if(cityName.trim()===''){
        not_found_container.classList.add('active');
    }
    else{
        fetchWeatherInfoByCity(cityName);
    }
});

async function fetchWeatherInfoByCity(city){
    wheatherContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    let data;
    try
    {
    data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    data = await data.json();
    }catch{
        not_found_container.classList.add('active');
    }
    console.log(data);
    console.log(data.cod);
    if(data.cod==404)
    {
        not_found_container.classList.add('active');
    }
    loadingContainer.classList.remove('active');
    renderFunction(data);
    wheatherContainer.classList.add('aaa');
    wheatherContainer.classList.add('active');

    
}
