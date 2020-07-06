import { differenceInDays } from 'date-fns';

/* Global Variables */
let baseURLGeoNames = 'http://api.geonames.org/searchJSON?maxRows=1&username=valeriia&name=';

let baseURLWeatherbitCurrent = 'http://api.weatherbit.io/v2.0/current?';
let baseURLWeatherbitDaily = 'http://api.weatherbit.io/v2.0/forecast/daily?';
let apiKeyWeatherbit = '4f64fed98275458e9ed0a797ec81774e';

let baseURLPixabay = 'https://pixabay.com/api/?image_type=photo&category=buildings&q=';
let apiKeyPixabay = '6315616-d5cb7351229c7679827eaf034';

// red,orange,yellow,green,turquoise,blue,lilac,pink,brown,white

// Object with all data
let primaryData;

function performAction(e) {
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
    if (departureDate === '') {
        alert('Date is not specified');
        return;
    }
    // console.log(`Departure date: ${departureDate}`);
    primaryData.departureDate = departureDate;
    const daysLeft = differenceInDays(new Date(departureDate), Date.now());
    // console.log(`Days left: ${daysLeft}`);
    primaryData.daysLeft = daysLeft;
    // GeoNames API
    const destination = document.getElementById('destination').value;
    if (destination === '') {
        alert('Location is not specified');
        return;
    }
    primaryData.destination = destination;
    getData(baseURLGeoNames, destination)
        .then(async (allData) => {
            // console.log(allData);
            // console.log(allData.geonames[0].countryName);
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
                    // console.log('Current weather:', weatherDataCurrent);
                    const temperature = weatherDataCurrent.data[0].temp;
                    const weatherDescription = weatherDataCurrent.data[0].weather.description;
                    primaryData.temperature = temperature;
                    primaryData.weatherDescription = weatherDescription;
                    // console.log('Temperature:', temperature);
                    // console.log('Weather:', weatherDescription);
                });
            } else {
                await getData(
                    baseURLWeatherbitDaily,
                    `key=${apiKeyWeatherbit}&lat=${lat}&lon=${lng}`
                ).then((weatherDataDaily) => {
                    // console.log('Daily weather:', weatherDataDaily);
                    const temperatureMax = weatherDataDaily.data[0].max_temp;
                    const temperatureMin = weatherDataDaily.data[0].min_temp;
                    const weatherDescriptionDaily = weatherDataDaily.data[0].weather.description;
                    // console.log('Temperature Max:', temperatureMax);
                    // console.log('Temperature Min:', temperatureMin);
                    // console.log('Weather:', weatherDescriptionDaily);
                    primaryData.temperatureMax = temperatureMax;
                    primaryData.temperatureMin = temperatureMin;
                    primaryData.weatherDescription = weatherDescriptionDaily;
                });
            }
            // pixabay API
            await getData(baseURLPixabay, `${destination}&key=${apiKeyPixabay}`).then(async (pictureData) => {
                console.log(pictureData);
                // Pull in an image for the country from Pixabay API when the entered location brings up no results.
                if (pictureData.totalHits > 0) {
                    const locationPhoto = pictureData.hits[0].webformatURL;
                    // console.log(locationPhoto);
                    primaryData.pictureURL = locationPhoto;
                } else {
                    // console.log('No picture of city found');
                    await getData(
                        baseURLPixabay,
                        `${countryName}&key=${apiKeyPixabay}`
                    ).then(async (pictureDataCountry) => {
                        // console.log(pictureDataCountry);
                        // Pull in a travel image from Pixabay API when trere is no picture of country.
                        if (pictureDataCountry.totalHits > 0) {
                            const countryPhoto = pictureDataCountry.hits[0].webformatURL;
                            // console.log(countryPhoto);
                            primaryData.pictureURL = countryPhoto;
                        } else {
                            // console.log('No picture of country found');
                            await getData(baseURLPixabay, `travel&key=${apiKeyPixabay}`).then((pictureDataMock) => {
                                // console.log(pictureDataMock);
                                const mockPhoto = pictureDataMock.hits[0].webformatURL;
                                // console.log(mockPhoto);
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
    destination.innerText = 'A trip to: ' + primaryData.destination + ', ' + primaryData.countryName;
    resultsText.appendChild(destination);

    let departure = document.createElement('div');
    departure.classList.add('text-entry');
    departure.innerText = 'When: ' + primaryData.departureDate;
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
    }

    if (primaryData.temperatureMax !== '') {
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
