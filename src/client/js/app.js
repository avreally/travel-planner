/* Global Variables */
let baseURLGeoNames = 'http://api.geonames.org/searchJSON?maxRows=1&username=valeriia&name=';

// let apiKey = '';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('get-info').addEventListener('click', performAction);

// geoNames
function performAction(e) {
	const destination = document.getElementById('destination').value;
	getData(baseURLGeoNames, destination)
		.then((allData) => {
			postData('/addData', {
				country: allData.main.temp,
				date: newDate,
				userResponse: document.getElementById('departure').value
			});
		})
		.then(() => updateUI());
}

const getData = async (url, destination) => {
	const response = await fetch(url + destination);
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
