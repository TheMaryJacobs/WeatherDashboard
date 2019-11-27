const apiKey = "0b1ad7993fb1635feccbffde378e7b49";
let cityArray = []

//use moment to display date in a normal format 
const TodayIs = moment().format('MMMM Do , YYYY');
    $('#todayIs').text(TodayIs);

const DayTwo = moment().add(1, 'days').calendar();
    $('#day-Two').text(DayTwo);

const DayThree = moment().add(2, 'days').calendar();
    $('#day-Three').text(DayThree);

const DayFour = moment().add(3, 'days').calendar();
    $('#day-Four').text(DayFour);

const DayFive = moment().add(4, 'days').calendar();
    $('#day-Five').text(DayFive);

const DaySix = moment().add(5, 'days').calendar();
    $('#day-Six').text(DaySix); 

$("#searchButton").on("click", function () {
    city = $(this).parent("div").children("div").children("input").val();
    $(this).parent("div").children("div").children("input").val("");
    currentCall();

    console.log(city);

});

storedCities = JSON.parse(localStorage.getItem("cities"));


if (storedCities !== null) {
    city = storedCities[0].name;
    window.onload = currentCall(city);
};


function renderList() {
    Object.values(storedCities).forEach((value) => {
        const $cityLi = $("<li>", { "class": "list-group-item" });
        $cityLi.text(value.name);
        $(".list-group").prepend($cityLi);
    }
    )
}

if (storedCities !== null) {
    renderList();
}


function currentCall() {
    // $('#todayIs').removeAttr("d-none");
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
    //promise - call the api for the information
        .then(function (response) {
            const $cityLi = $("<li>", { "class": "list-group-item" });
            //used stack exchange to figure out icon image: https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
            const iconCode = response.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";

            cityObject = {
                name: response.name
            }
            city = {name: response.name}

            cityLat = response.coord.lat;
            cityLong = response.coord.lon;
            cityId = response.id;
            $(".city").text(response.name);
            $(".temp").text("Temp: " + response.main.temp);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".windSpeed").text("Wind: " + response.wind.speed);
            $("#icon").attr('src', iconURL);
           
            const uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${cityLat}&lon=${cityLong}&units=imperial`;
            $.ajax({
                url: uviURL,
                method: "GET",
            })
                .then(function (response) {
                    $(".uvIndex").text("UVI: "+response.value);
                    // let $dateHeader = $("<h2>");
                    // let $dateHeader = $("<h2>");
                    let shortDate = response.date_iso.substr(0, response.date_iso.indexOf('T'));
                    // $dateHeader.text(shortDate);
                    // $("h1").append($dateHeader);
                    // "https://openweathermap.desk.com/customer/portal/questions/17064492-date-and-time-specific-response?t=535697"
                    // $dateHeader.text(shortDate);
                    // $("h1").append($dateHeader);
                })


            const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&id=${cityId}&units=imperial`;
            //sets the information 
            let index = 3;
            $.ajax({
                url: fiveDayURL,
                method: "GET",
            })
                .then(function (response) {
                    for (let i = 4; i < response.list.length; i += 8) {
                        const iconCode = response.list[i].weather[0].icon;
                        const iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                        const shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
                        $("#day-" + index).text(shortDate);
                        // const shortDate = response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(' '));
                        // $("#day-" + index).text(shortDate);
                        // const temp = Math.floor(+response.list[i].main.temp)
                        $("#temp-" + index).text("Temp: "+response.list[i].main.temp);
                        $("#humid-" + index).text("Humidity: "+response.list[i].main.humidity);
                        $("#icon-" + index).attr('src', iconURL);
                        index = index + 8;
                    }
                })
        })
};
$(document).on("click", "li", function () {
    city = $(this).text();
    currentCall();
});