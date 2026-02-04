// MAP //
// MAP //
// MAP //

mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltYmF6YWpvdGEiLCJhIjoiY2xrNGd6MDAxMHR6MzNtb3loODVremp0NSJ9.b1PuHNLwqm-py9vsXdXcjA';

const setMapStyle = function () {
    const rootElem = document.documentElement
    let dataTheme = rootElem.getAttribute('data-theme'),
        newTheme

    newTheme = (dataTheme === 'light') ? 'dark' : 'light'

    const mapStyle = (newTheme === 'light')
        ? 'dark-v10'
        : 'light-v10';
    return mapStyle;
};

const setMapTheme = function () {
    const mapTheme = `mapbox://styles/mapbox/${setMapStyle()}`;
    return mapTheme;
};



let mapInstance = null;

function addMapMarker(map) {
    const sourceId = 'point';
    const layerId = 'points';
    const imageId = 'memoji';

    if (map.getLayer(layerId)) return;

    map.loadImage(
        '/assets/images/memoji4.png',
        (error, image) => {
            if (error) return;
            if (!map.hasImage(imageId)) {
                map.addImage(imageId, image);
            }

            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [0.0221, 51.4806]
                                }
                            }
                        ]
                    }
                });
            }

            if (!map.getLayer(layerId)) {
                map.addLayer({
                    'id': layerId,
                    'type': 'symbol',
                    'source': sourceId,
                    'layout': {
                        'icon-image': imageId,
                        'icon-size': 0.2,
                    }
                });
            }
        }
    );
}

function initMap() {
    if (mapInstance) return;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: setMapTheme(), // style URL
        zoom: 11, // starting zoom
        center: [0.0221, 51.4806], // starting position
        attributionControl: false,
    });

    mapInstance = map;

    map.scrollZoom.disable()
    map.touchZoomRotate.enable();
    map.addControl(new mapboxgl.NavigationControl());


    map.on('load', () => {
        addMapMarker(map);
    });

    map.on('style.load', () => {
        addMapMarker(map);
    });
}

function updateMapTheme() {
    if (!mapInstance) return;
    mapInstance.setStyle(setMapTheme());
}


// THEME TOGGLE //
// THEME TOGGLE //
// THEME TOGGLE //

const setToggleState = (theme) => {
    const toggle = document.querySelector(`.theme-switcher`);
    if (!toggle) return;
    toggle.setAttribute(`aria-pressed`, theme === `dark`);
};

const switchTheme = () => {
    // Get root element and data-theme value
    const rootElem = document.documentElement
    let dataTheme = rootElem.getAttribute('data-theme'),
        newTheme

    newTheme = (dataTheme === 'light') ? 'dark' : 'light'

    // Set the new HTML attribute
    rootElem.setAttribute('data-theme', newTheme)

    // Set the new local storage
    localStorage.setItem('theme', newTheme)
    setToggleState(newTheme);
    updateMapTheme();
}

// Check local storage
let localS = localStorage.getItem('theme'),
    themeToSet = localS

//If local storage is not set, we check the OS preference
if (!localS) {
    themeToSet = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

//set the correct theme
document.documentElement.setAttribute('data-theme', themeToSet)
setToggleState(themeToSet);
initMap();

// Set event listener for the theme switcher
document.querySelector(`.theme-switcher`).addEventListener(`click`, switchTheme)

if (!localS) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const newTheme = event.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        setToggleState(newTheme);
        updateMapTheme();
    });
}


// FILTER //
// FILTER //
// FILTER //


function filterProduct(value) {
    //Button class code
    let filters = document.querySelectorAll(".filter");
    filters.forEach((filter) => {
        //check if value equals innerText
        if (value.toUpperCase() == filter.innerText.toUpperCase()) {
            filter.classList.add("active");
            filter.setAttribute("aria-pressed", "true");
        } else {
            filter.classList.remove("active");
            filter.setAttribute("aria-pressed", "false");
        }
    });
    //select all cards
    let cards = document.querySelectorAll(".card");
    //loop through all cards
    cards.forEach((card) => {
        //display all cards on 'all' button click
        if (value == "all") {
            card.classList.remove("inactive");
        } else {
            //Check if element contains category class
            if (card.classList.contains(value)) {
                //display element based on category
                card.classList.remove("inactive");
            } else {
                //inactive other cards
                card.classList.add("inactive");
            }
        }
    });

}


const filter = document.querySelectorAll(`.filter`);
const filterContainer = document.querySelector(`.filters-container`);
const projectFilter = document.querySelector(`[data-filter="projects"]`);
const grid = document.querySelector(`.grid`);

function applyFilterLayout(filterValue) {
    document.querySelector(`.card-intro`).setAttribute(`id`, `card-intro-${filterValue}`);
    document.querySelector(`.card-map`).setAttribute(`id`, `card-map-${filterValue}`);
    document.querySelector(`.card-contact`).setAttribute(`id`, `card-contact-${filterValue}`);
    document.querySelector(`.card-skills`).setAttribute(`id`, `card-skills-${filterValue}`);
    document.querySelector(`.card-spotify`).setAttribute(`id`, `card-spotify-${filterValue}`);
    document.querySelector(`.card-github`).setAttribute(`id`, `card-github-${filterValue}`);
    document.querySelector(`.card-linkedin`).setAttribute(`id`, `card-linkedin-${filterValue}`);
    document.querySelector(`.card-weather`).setAttribute(`id`, `card-weather-${filterValue}`);
    document.querySelector(`.card-vanlife`).setAttribute(`id`, `card-vanlife-${filterValue}`);
    document.querySelector(`.card-quizzical`).setAttribute(`id`, `card-quizzical-${filterValue}`);
    document.querySelector(`.card-evogym`).setAttribute(`id`, `card-evogym-${filterValue}`);
}

function transitionToFilter(filterValue, { animate = true } = {}) {
    if (!grid) return;
    if (!animate) {
        filterProduct(filterValue);
        applyFilterLayout(filterValue);
        return;
    }

    const cards = Array.from(document.querySelectorAll(`.card`));
    if (!cards.length) {
        filterProduct(filterValue);
        applyFilterLayout(filterValue);
        return;
    }

    const firstRects = cards.map(card => card.getBoundingClientRect());

    filterProduct(filterValue);
    applyFilterLayout(filterValue);

    const lastRects = cards.map(card => card.getBoundingClientRect());

    cards.forEach((card, index) => {
        const first = firstRects[index];
        const last = lastRects[index];
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        if (deltaX || deltaY) {
            card.style.transition = `none`;
            card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });

    grid.offsetHeight;

    requestAnimationFrame(() => {
        cards.forEach((card) => {
            card.style.transition = ``;
            card.style.transform = ``;
        });
    });
}




filterContainer.addEventListener(`click`, function (event) {
    const clicked = event.target.closest(`.filter`);
    if (!clicked) return;
    filter.forEach(filter => filter.classList.remove(`active`));
    clicked.classList.add(`active`);
    transitionToFilter(clicked.dataset.filter);
})


document.querySelector('.intro-btn').addEventListener(`click`, function () {
    projectFilter.click();
});

//Initially display all products
window.onload = () => {
    transitionToFilter("all", { animate: false });
};

// CONTACT FORM VALIDATION
const contactForm = document.querySelector(".card-contact form");
if (contactForm) {
    const requiredFields = contactForm.querySelectorAll("input[required], textarea[required]");

    const updateFieldError = (field) => {
        const errorEl = document.getElementById(`error-${field.id}`);
        if (!errorEl) return;
        const showInvalid = !field.checkValidity();
        errorEl.textContent = "";
        field.setAttribute("aria-invalid", showInvalid ? "true" : "false");
    };

    contactForm.addEventListener("submit", (event) => {
        let firstInvalid = null;
        requiredFields.forEach((field) => {
            updateFieldError(field);
            if (!field.checkValidity() && !firstInvalid) {
                firstInvalid = field;
            }
        });
        if (firstInvalid) {
            event.preventDefault();
            firstInvalid.focus();
        }
    });

    requiredFields.forEach((field) => {
        field.addEventListener("input", () => {
            if (field.getAttribute("aria-invalid") === "true") {
                updateFieldError(field);
            }
        });
    });
}


// WEATHER API

let weather = {
    apiKey: "e960a1c2edec148280ede019ca0e60b9",
    fetchWeather: function (city) {
        const weatherContainer = document.querySelector(".weather");
        if (weatherContainer) {
            weatherContainer.classList.add("loading");
            weatherContainer.setAttribute("aria-busy", "true");
        }
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        const weatherIcon = document.querySelector(".icon");
        weatherIcon.src = "https://openweathermap.org/img/wn/" + icon + ".png";
        weatherIcon.alt = description;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        const weatherContainer = document.querySelector(".weather");
        weatherContainer.classList.remove("loading");
        weatherContainer.setAttribute("aria-busy", "false");
        // document.querySelector(".card-weather").style.backgroundImage =
        // "url('https://source.unsplash.com/1600x900/?" + description + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".weather-search-bar").value);
    },
};

document.querySelector(".weather-search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".weather-search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

weather.fetchWeather("London");

// SPOTIFY NOW PLAYING
const spotifyCard = document.querySelector(".card-spotify");
const spotifyCover = document.querySelector(".spotify-cover");
const spotifyTrack = document.querySelector(".spotify-track");
const spotifyArtist = document.querySelector(".spotify-artist");
const spotifyStatusText = document.querySelector(".spotify-status-text");
const spotifyStatusDot = document.querySelector(".spotify-status-dot");
const spotifyFallbackCover =
    "/assets/images/Spotify_Primary_Logo_RGB_Black.png";

const updateSpotifyCard = (data) => {
    if (!spotifyCard) return;
    if (!data || !data.isPlaying) {
        if (data?.track) {
            spotifyTrack.textContent = data.track;
            spotifyArtist.textContent = data.artist || "—";
            const fallbackNeeded = !data.albumArt;
            spotifyCover.src = data.albumArt || spotifyFallbackCover;
            spotifyCover.alt = `${data.track} album cover`;
            spotifyCover.classList.toggle("spotify-cover--fallback", fallbackNeeded);
        } else {
            spotifyTrack.textContent = "—";
            spotifyArtist.textContent = "—";
            spotifyCover.src = spotifyFallbackCover;
            spotifyCover.alt = "Spotify logo";
            spotifyCover.classList.add("spotify-cover--fallback");
        }
        if (spotifyStatusText) spotifyStatusText.textContent = "MUSIC";
        if (spotifyStatusDot) spotifyStatusDot.classList.add("is-hidden");
        return;
    }
    spotifyTrack.textContent = data.track;
    spotifyArtist.textContent = data.artist;
    const fallbackNeeded = !data.albumArt;
    spotifyCover.src = data.albumArt || spotifyFallbackCover;
    spotifyCover.alt = `${data.track} album cover`;
    spotifyCover.classList.toggle("spotify-cover--fallback", fallbackNeeded);
    if (spotifyStatusText) spotifyStatusText.textContent = "NOW PLAYING";
    if (spotifyStatusDot) spotifyStatusDot.classList.remove("is-hidden");
};

const fetchNowPlaying = async () => {
    if (!spotifyCard) return;
    try {
        const response = await fetch(`/.netlify/functions/spotify?t=${Date.now()}`, {
            cache: "no-store",
        });
        if (!response.ok) {
            updateSpotifyCard(null);
            return;
        }
        const data = await response.json();
        updateSpotifyCard(data);
    } catch (error) {
        updateSpotifyCard(null);
    }
};

fetchNowPlaying();
setInterval(fetchNowPlaying, 60000);
// } 
