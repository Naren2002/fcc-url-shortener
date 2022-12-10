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

// The Object that contains the mapping from the original URL to the short URL 
let ogToShortMap = {

}

// The Object that contains the mapping from the short URL to the original URL
let shortToOgMap = {

}

app.post("/api/shorturl", function(req, res){
    let inputUrl = req.body.url;
    console.log(inputUrl);

    // If the input URL is not present in the keys of "ogToShortMap" Object 
    // It will increment the mappingKey and add the mappings to both the Objects

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

  // Checked if the input URL is present in the mapping Object and
  // Redirects the user to the long form URL if it is present
  
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
