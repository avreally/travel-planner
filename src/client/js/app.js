import { differenceInDays, parseISO } from 'date-fns';
import { startOfTomorrow } from 'date-fns';
import { formatISO } from 'date-fns';
import { addDays } from 'date-fns';

/* Global Variables */
let baseURLGeoNames = 'http://api.geonames.org/searchJSON?maxRows=1&username=valeriia&name=';

let baseURLWeatherbitCurrent = 'http://api.weatherbit.io/v2.0/current?';
let baseURLWeatherbitDaily = 'http://api.weatherbit.io/v2.0/forecast/daily?';
let apiKeyWeatherbit = '4f64fed98275458e9ed0a797ec81774e';

let baseURLPixabay = 'https://pixabay.com/api/?image_type=photo&category=travel&q=';
let apiKeyPixabay = '6315616-d5cb7351229c7679827eaf034';

// Object with all data
let primaryData;

let tomorrow = formatISO(startOfTomorrow(), { representation: 'date' });
document.querySelector('#departure-date').setAttribute('min', tomorrow);

let maxDate = formatISO(addDays(parseISO(tomorrow), 14), { representation: 'date' });
document.querySelector('#departure-date').setAttribute('max', maxDate);

function performAction(e) {
    e.preventDefault();
    primaryData = {
        temperature: '',
        temperatureMax: '',
        temperatureMin: '',
        weatherDescription: '',
        countryName: '',
        destination: '',
        departureDate: '',
        daysLeft: '',
        pictureURL: ''
    };

    // Countdown
    const departureDate = document.getElementById('departure-date').value;
    primaryData.departureDate = departureDate;

    const daysLeft = differenceInDays(new Date(departureDate), Date.now());
    primaryData.daysLeft = daysLeft;

    // GeoNames API
    const destination = document.getElementById('destination').value;

    primaryData.destination = destination;
    getData(baseURLGeoNames, destination)
        .then(async (allData) => {
            const countryName = allData.geonames[0].countryName;
            primaryData.countryName = countryName;
            const lat = allData.geonames[0].lat;
            const lng = allData.geonames[0].lng;

            // Weatherbit API
            if (daysLeft <= 7) {
                await getData(
                    baseURLWeatherbitCurrent,
                    `key=${apiKeyWeatherbit}&lat=${lat}&lon=${lng}`
                ).then((weatherDataCurrent) => {
                    const temperature = weatherDataCurrent.data[0].temp;
                    const weatherDescription = weatherDataCurrent.data[0].weather.description;
                    primaryData.temperature = temperature;
                    primaryData.weatherDescription = weatherDescription;
                });
            } else {
                await getData(
                    baseURLWeatherbitDaily,
                    `key=${apiKeyWeatherbit}&lat=${lat}&lon=${lng}`
                ).then((weatherDataDaily) => {
                    const temperatureMax = weatherDataDaily.data[12].max_temp;
                    const temperatureMin = weatherDataDaily.data[12].min_temp;
                    const weatherDescriptionDaily = weatherDataDaily.data[12].weather.description;
                    primaryData.temperatureMax = temperatureMax;
                    primaryData.temperatureMin = temperatureMin;
                    primaryData.weatherDescription = weatherDescriptionDaily;
                });
            }
            // pixabay API
            await getData(baseURLPixabay, `${destination}&key=${apiKeyPixabay}`).then(async (pictureData) => {
                // Pull in an image for the country from Pixabay API when the entered location brings up no results.
                if (pictureData.totalHits > 0) {
                    const locationPhoto = pictureData.hits[0].webformatURL;
                    primaryData.pictureURL = locationPhoto;
                } else {
                    await getData(
                        baseURLPixabay,
                        `${countryName}&key=${apiKeyPixabay}`
                    ).then(async (pictureDataCountry) => {
                        // Pull in a travel image from Pixabay API when trere is no picture of country.
                        if (pictureDataCountry.totalHits > 0) {
                            const countryPhoto = pictureDataCountry.hits[0].webformatURL;
                            primaryData.pictureURL = countryPhoto;
                        } else {
                            await getData(baseURLPixabay, `&key=${apiKeyPixabay}`).then((pictureDataMock) => {
                                const mockPhoto = pictureDataMock.hits[0].webformatURL;
                                primaryData.pictureURL = mockPhoto;
                            });
                        }
                    });
                }
            });
        })
        .then(() => updateUI());
}

const getData = async (url, parameters) => {
    const response = await fetch(url + parameters);
    try {
        const allData = await response.json();
        return allData;
    } catch (error) {
        console.log('error', error);
    }
};

const updateUI = () => {
    let resultsBackground = document.querySelector('.results-back');
    resultsBackground.style.display = 'flex';

    let resultsPic = document.getElementById('results-pic');
    resultsPic.innerHTML = '';

    let picture = document.createElement('img');
    picture.setAttribute('src', primaryData.pictureURL);
    picture.classList.add('pic');
    resultsPic.appendChild(picture);

    let resultsText = document.getElementById('results-text');
    resultsText.innerHTML = '';

    let destination = document.createElement('div');
    destination.classList.add('where');
    destination.innerText = 'A trip to ' + primaryData.destination + ', ' + primaryData.countryName;
    resultsText.appendChild(destination);

    let departure = document.createElement('div');
    departure.classList.add('text-entry');
    departure.innerText = primaryData.departureDate;
    resultsText.appendChild(departure);

    let daysLeft = document.createElement('div');
    daysLeft.classList.add('text-entry');
    daysLeft.innerText = 'Days left: ' + primaryData.daysLeft;
    resultsText.appendChild(daysLeft);

    if (primaryData.temperature !== '') {
        let temperature = document.createElement('div');
        temperature.classList.add('text-entry');
        temperature.innerText = 'Temperature, ℃: ' + primaryData.temperature;
        resultsText.appendChild(temperature);
    } else if (primaryData.temperatureMax !== '') {
        let temperatureMax = document.createElement('div');
        temperatureMax.classList.add('text-entry');
        temperatureMax.innerText = 'Temperature, max ℃: ' + primaryData.temperatureMax;
        resultsText.appendChild(temperatureMax);

        let temperatureMin = document.createElement('div');
        temperatureMin.classList.add('text-entry');
        temperatureMin.innerText = 'Temperature, min ℃: ' + primaryData.temperatureMin;
        resultsText.appendChild(temperatureMin);
    }

    let weatherDescription = document.createElement('div');
    weatherDescription.classList.add('text-entry');
    weatherDescription.innerText = 'Weather conditions: ' + primaryData.weatherDescription;
    resultsText.appendChild(weatherDescription);
};

// Export performAction to index.js
export { performAction, getData };
