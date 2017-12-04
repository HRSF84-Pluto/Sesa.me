
const models = require('../db/index.js');
const router = require('express').Router();
const axios = require('axios');

router.get('/', (req, res) => {
  const url = req.url.split('?');
  const target = url[url.length-1].split('&').join('').split('long=');
  let latd = target[0].split('lat=');
  latd.shift();
  target.splice(0, 1, latd[0]);
  const lat = Number(target[0]);
  const long = Number(target[1]);

  axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=domestic+violence+services+OR+human+trafficking+help+near+me&location="+ lat + "," + long + "&radius=1000&key=AIzaSyCSvLAVosAQuQOJHtLXnwXVqTNOxMPjSH4")
    .then(function (response) {
      //console.log(response.data.results);
      res.status(200).send(response.data.results);
    })
    .catch(function (error) {
      console.log(error);
      res.status(404).end();
    });
});

module.exports = router;
