const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Icon } = require("../models/Icon");
//FLATICON API

router.post("/getFlatIconToken", (req, res) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  };
  const apiKey = "ba03cf4b08e7da7f403276f070a4d6db8314d9c0";
  axios
    .post(
      "https://api.flaticon.com/v2/app/authentication",
      { apikey: "ba03cf4b08e7da7f403276f070a4d6db8314d9c0" },
      headers
    )
    .then((response) => {
      const tokenCreatedAt = Date.now();
      console.log(`response.data.data`, response.data.data.token);
      const authToken = response.data.data.token;
      req.session.flatIconAuthToken = { authToken, tokenCreatedAt };
      res.status(200).json(response.data.data);
    });
});

router.get("/getFlatIcon/:queries", (req, res) => {
  const queries = req.params.queries;
  const authToken = req.session.flatIconAuthToken?.authToken;
  const tokenCreatedAt = req.session.flatIconAuthToken?.tokenCreatedAt;
  const TOKEN_EXPIRATION_IN_MILLISEC = 2 * 60 * 60 * 1000; //2 hours
  if (
    !authToken ||
    Date.now() - tokenCreatedAt >= TOKEN_EXPIRATION_IN_MILLISEC
  ) {
    return false;
  }

  var config = {
    method: "get",
    url: `https://api.flaticon.com/v2/search/icons?${queries}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/fetchIconsInDb", (req, res) => {
  Icon.findOne((err, doc) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, doc });
  });
});

router.post("/saveIcons", (req, res) => {
  const allIcons = req.body.allIcons;
  Icon.findOne((err, doc) => {
    if (err) {
      console.log(err);
    }
    if (!doc) {
      const newDoc = new Icon();
      newDoc.save();
    } else {
      console.log(`doc`, doc);
      doc.icons = doc.icons.concat(allIcons);
      doc.save((err, updatedDoc) => {
        if (err) {
          console.log(err);
        }
        console.log(`updatedDoc`, updatedDoc);
        res.status(200).json(updatedDoc);
      });
    }
  });
});
module.exports = router;
