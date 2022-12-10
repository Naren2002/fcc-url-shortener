require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let mappingKey = 0;

let ogToShortMap = {

}

let shortToOgMap = {

}

app.post("/api/shorturl", function(req, res){
    let inputUrl = req.body.url;
    console.log(inputUrl);
    if (!(inputUrl in ogToShortMap)){
      mappingKey += 1;
      ogToShortMap[inputUrl] = mappingKey;
      shortToOgMap[mappingKey] = inputUrl;

      res.json({
        original_url: inputUrl,
        short_url: mappingKey
      })
    }
});

app.get("/api/shorturl/:inputShortUrl", function(req, res){
  let inputUrl = req.params.inputShortUrl;
  if(inputUrl in shortToOgMap){
    console.log(inputUrl);
    console.log(shortToOgMap[inputUrl]);
    res.redirect(shortToOgMap[inputUrl]);
  }else{
    res.json({
      "error": "Short URL Not Found"
    });
  }
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
