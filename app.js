const express = require("express");
const https = require("https");
const app = express();
const bodyp = require("body-parser");
app.use(bodyp.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
let temp = "";
let cond = "";
let mintemp = "";
let maxtemp = "";
let humid = "";
let wind = "";
let imgUrl = "";
let cty = "";
let country = "";
app.get("/", (req, res) => {
  res.render("weather", {
    city: cty,
    cntry: country,
    image: imgUrl,
    temperature: temp,
    weatherCond: cond,
    minTemp: mintemp,
    maxTemp: maxtemp,
    humidity: humid,
    speed: wind,
  });
});
app.post("/", (req, res) => {
  let place = req.body.city;
  if (place.length === 0) {
    res.redirect("/");
  } else {
    let url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      place +
      "&appid=0a3f653b6cdac306be04b48160e387a9&units=metric";

    https.get(url, (response) => {
      response.on("data", (data) => {
        let weatherData = JSON.parse(data);
        temp = weatherData.main.temp;
        let icon = weatherData.weather[0].icon;
        cond = weatherData.weather[0].description;
        mintemp = weatherData.main.temp_min;
        maxtemp = weatherData.main.temp_max;
        humid = weatherData.main.humidity;
        wind = weatherData.wind.speed;
        cty = weatherData.name;
        country = weatherData.sys.country;
        imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.redirect("/");
      });
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000...");
});
