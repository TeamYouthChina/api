const express = require('express');
const request = require('request');

const router = express.Router();

/* GET api document. */

router.get('/', function (req, res) {
  res.status(404);
  res.send('404: Not Found');
});

router.get('/:filename', function (req, res) {
  if (req.query.token !== global.config.general.urlToken) {
    res.status(401);
    res.send('401: Unauthorized');
    return;
  }
  if (typeof (req.params.filename) !== 'string') {
    res.status(404);
    res.send('404: Not Found');
    return;
  }
  request(
    {
      url: global.config.general.githubPrefix + req.params.filename,
      headers: {
        Authorization: 'token ' + global.config.sensitive.github.token,
        'User-Agent': 'Node.js/request'
      }
    },
    function (error, response, body) {
      if (!error) {
        const bodyObject = JSON.parse(body);
        if (typeof (bodyObject) === 'object') {
          if (typeof (bodyObject.content) === 'string') {
            const headerOrigin = req.get('Origin');
            const data = Buffer.from(bodyObject.content, 'base64').toString('utf8');
            if (headerOrigin && headerOrigin.indexOf('editor.swagger.io') !== -1) {
              res.send(data);
            } else {
              res.send('<pre>' + data + '</pre>');
            }
            return;
          }
        }
      }
      res.status(error.status);
      res.send(error.toString());
    }
  );
});

module.exports = router;
