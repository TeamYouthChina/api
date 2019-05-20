const express = require('express');
const request = require('request');

const router = express.Router();

/* GET api document. */
router.get('/', function (req, res) {
  if (req.query.token !== global.config.general.urlToken) {
    res.send('401: Unauthorized');
    return;
  }
  if (typeof (req.query.file) !== 'string') {
    res.send('404: Not Found');
    return;
  }
  request(
    {
      url: global.config.general.githubPrefix + req.query.file,
      headers: {
        Authorization: 'token ' + global.config.sensitive.github.token
      }
    },
    function (error, response, body) {
      if (!error) {
        res.send('<pre>' + body + '</pre>');
      } else {
        res.send('<pre>' + error.toString() + '</pre>');
      }
    }
  );
});

module.exports = router;
