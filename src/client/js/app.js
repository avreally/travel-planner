import { differenceInDays } from 'date-fns';

/* Global Variables */
let baseURLGeoNames = 'http://api.geonames.org/searchJSON?maxRows=1&username=valeriia&name=';

let baseURLWeatherbit = 'http://api.weatherbit.io/v2.0/forecast/daily?';
let apiKeyWeatherbit = '4f64fed98275458e9ed0a797ec81774e';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('get-info').addEventListener('click', performAction);

// geoNames and weatherbit
function performAction(e) {
	//Countdown
	const departure = document.getElementById('departure').value;
	// console.log(departure);
	const daysLeft = differenceInDays(new Date(departure), Date.now());
	// console.log(daysLeft);
	//
	const destination = document.getElementById('destination').value;
	getData(baseURLGeoNames, destination).then((allData) => {
		console.log(allData);
		console.log(allData.geonames[0].countryName);
		const countryName = allData.geonames[0].countryName;
		const lat = allData.geonames[0].lat;
		const lng = allData.geonames[0].lng;
		getData(baseURLWeatherbit, `key=${apiKeyWeatherbit}&lat=${lat}&lon=${lng}`)
			.then((weatherData) => {
				console.log(weatherData);
				// postData('/addData', {
				// 	country: allData.country,
				// 	date: newDate,
				// 	userResponse: document.getElementById('departure').value
				// });
			})
			.then(() => updateUI());
	});
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
