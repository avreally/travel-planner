import { differenceInDays } from 'date-fns';

/* Global Variables */
let baseURLGeoNames = 'http://api.geonames.org/searchJSON?maxRows=1&username=valeriia&name=';

let baseURLWeatherbit = 'http://api.weatherbit.io/v2.0/forecast/daily?';
let apiKeyWeatherbit = '4f64fed98275458e9ed0a797ec81774e';

let baseURLPixabay = 'https://pixabay.com/api/?image_type=photo&category=places&q=';
let apiKeyPixabay = '6315616-d5cb7351229c7679827eaf034';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('get-info').addEventListener('click', performAction);

// geoNames
function performAction(e) {
	//Countdown
	const departureDate = document.getElementById('departure-date').value;
	// console.log(departureDate);
	const daysLeft = differenceInDays(new Date(departureDate), Date.now());
	// console.log(daysLeft);
	//
	const destination = document.getElementById('destination').value;
	getData(baseURLGeoNames, destination)
		.then((allData) => {
			console.log(allData);
			console.log(allData.geonames[0].countryName);
			const countryName = allData.geonames[0].countryName;
			const lat = allData.geonames[0].lat;
			const lng = allData.geonames[0].lng;
			// weatherbit
			getData(baseURLWeatherbit, `key=${apiKeyWeatherbit}&lat=${lat}&lon=${lng}`).then((weatherData) => {
				console.log(weatherData);
				// postData('/addData', {
				// 	country: allData.country,
				// 	date: newDate,
				// 	userResponse: document.getElementById('departure-date').value
				// });
			});
			// pixabay
			getData(baseURLPixabay, `${destination}&key=${apiKeyPixabay}`).then((pictureData) => {
				console.log(pictureData);
				// Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
				if (pictureData.totalHits > 0) {
					const locationPhoto = pictureData.hits[0].webformatURL;
					// now it is a link and we need a picture
					console.log(locationPhoto);
				} else {
					console.log('No picture of city found');
					getData(baseURLPixabay, `${countryName}&key=${apiKeyPixabay}`).then((pictureDataCountry) => {
						console.log(pictureDataCountry);
						const countryPhoto = pictureDataCountry.hits[0].webformatURL;
						// now it is a link and we need a picture
						console.log(countryPhoto);
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

const postData = async (path, data) => {
	const response = await fetch(path, {
		method: 'POST',
		body: data
	});
	try {
		const allData = await response.json();
		return allData;
	} catch (error) {
		console.log('error', error);
	}
};

const updateUI = async () => {
	const request = await fetch('/');
	try {
		const allData = await request.json();
		console.log(allData);
		document.getElementById('date').innerHTML = allData.date;
		document.getElementById('temp').innerHTML = allData.temp;
		document.getElementById('content').innerHTML = allData.userResponse;
	} catch (error) {
		console.log('error', error);
	}
};

// Example of exported function
// export { functionName }
