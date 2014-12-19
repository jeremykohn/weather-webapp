// Wrap script in self-executing function to create a separate namespace.
(function() {

    // Subroutines.

    function hideJavaScriptError() {
        console.log('hide error div');
        $('#error-need-javascript').css('visibility', 'hidden');
    }

    function showApplicationContainer() {
        console.log('show application div');
        $('#application-container').css('visibility', 'visible');
    }

    function showSpinningCircle() {
        console.log('show circle');
        $('#spinning-circle').css('visibility', 'visible');
    }

    function hideSpinningCircle() {
        console.log('hide circle');
        $('#spinning-circle').css('visibility', 'hidden');
    }

    function showWeatherDisplay() {
        console.log('show data display');
        $('#data-display').css('visibility', 'visible');
    }

    function formatData(apiData) {
        var forecastData = apiData.forecast.simpleforecast.forecastday;
        var first = forecastData[0];
        var second = forecastData[1];
        var third = forecastData[2];

        var formattedData = [
            ["#first-day .day-of-week", first.date.weekday],
            ["#first-day .high-temp", "High " + first.high.fahrenheit],
            ["#first-day .low-temp", "Low " + first.low.fahrenheit],
            ["#first-day .icon", '<img src="' + first.icon_url + '">'],
            ["#first-day .conditions", first.conditions],
            ["#second-day .day-of-week", second.date.weekday],
            ["#second-day .high-temp", "High " + second.high.fahrenheit],
            ["#second-day .low-temp", "Low " + second.low.fahrenheit],
            ["#second-day .icon", '<img src="' + second.icon_url + '">'],
            ["#second-day .conditions", second.conditions],
            ["#third-day .day-of-week", third.date.weekday],
            ["#third-day .high-temp", "High " + third.high.fahrenheit],
            ["#third-day .low-temp", "Low " + third.low.fahrenheit],
            ["#third-day .icon", '<img src="' + third.icon_url + '">'],
            ["#third-day .conditions", third.conditions]
        ];

        return formattedData;
    }


    function populateHTML(dataArray) {
        var dataPair;
        for (var i = 0; i < dataArray.length; i += 1) {
            dataPair = dataArray[i];
            insertDataPoint(dataPair[0], dataPair[1])
        }
    }

    function insertDataPoint(selectorString, weatherDataPoint) {
        $(selectorString).empty();
        $(selectorString).append(weatherDataPoint);

    }

    function insertSample() {
        $('#first-day .day-of-week').text("Sample text here");
    }

    function forecastURL(zipCode) {
        return "http://api.wunderground.com/api/bd381a5dc0d58598/forecast/q/" + zipCode + ".json";
    }


    function apiCall(dataURL) {
        var data;
        var dataForDisplay;

        $.ajax({
            url: dataURL,
            dataType: "jsonp",
            success: function(parsedJSON) {
                data = parsedJSON;

                if (data.response.error) {
                    console.log("ERROR");
                    console.log(data.response.error);
                    alert("There's no weather data for that zip code. Try entering another zip code.");
                } else {
                    console.log("NO ERROR");
                    dataForDisplay = formatData(data);
                    populateHTML(dataForDisplay);

                    hideSpinningCircle();
                    showWeatherDisplay();
                }
            }
        });

    }

    function validZipCode(zipCode) {
        return /^[0-9]{5}$/.test(zipCode);
    }

    function clickHandler() {
        var zip;
        $('#submit-button').click(function() {
            zip = $('#zipcode-input').val();
            url = forecastURL(zip);

            if (validZipCode(zip) === true) {
                console.log("Valid zip. Now, API call.");
                $('#zip-code-display').text("Forecast for zip code " + zip);
                showSpinningCircle();
                apiCall(url);
            } else {
                console.log("Invalid zip.");
                alert("Zip code must be five numeric digits. Try re-entering zip code.");
            }
        });
    }

    // Now, run main script. First wait for document.

    jQuery(document).ready(function($) {
        hideJavaScriptError();
        showApplicationContainer();
        clickHandler();
    });

})();