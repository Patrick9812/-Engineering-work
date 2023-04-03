const express = require("express");
const app = express();
const dotenv = require('dotenv')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const router = express.Router();

router.get("/", async (req, res) =>
{
   
   const geoData = await geocoder.forwardGeocode({
        query: 'Pszów, Romualda Traugutta 48',
        limit: 1
    }).send()
    res.render("contact")
})

module.exports = router;
