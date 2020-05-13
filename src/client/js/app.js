/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let apiKey = 'f216829e5bf8f55e2bda7e1a4f29d3a9&units=imperial';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    const zip = document.getElementById('zip').value;
    getData(baseURL, zip, apiKey).then((allData) => {
        postData('/addData', {
            temp: allData.main.temp,
            date: newDate,
            userResponse: document.getElementById('feelings').value
        });
    })
        .then(() => updateUI());
}

const getData = async (url, zip, key) => {
    const response = await fetch(url + `${zip},us&appid=${key}`);
    try {
        const allData = await response.json()
        return allData;
    }
    catch (error) {
        console.log("error", error);
    }
};

const postData = async (path, data) => {
    const response = await fetch(path, {
        method: 'POST',
        body: data
    });
    try {
        const allData = await response.json()
        return allData;
    }
    catch (error) {
        console.log("error", error);
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
        console.log("error", error);
    }
}

// Example of exported function
// export { functionName }