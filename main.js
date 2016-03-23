var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
