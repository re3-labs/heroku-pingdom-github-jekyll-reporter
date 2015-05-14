// Warning, ugly code below

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var repo = process.env.REPO;
var token = process.env.ACCESS_TOKEN;
var commiter_email = process.env.EMAIL || "support@example.com";
var commiter_name = process.env.NAME || "Support";

app.get('/', function(request, response) {
  response.send('nope');
});

app.post('/report-pingdom', function(req, res) {
  console.log("Incoming pingdom");
  console.log(req.body);
  if(req.body.check && req.body.action == "assign") {
    var id = req.body.incidentid;
    var desc = req.body.description;
    var date = (new Date()).toISOString().slice(0, 11);

    var content = new Buffer(
    "---\n" +
    "title: 'Automated report - incident #"+id+"'\n" +
    "---\n" +
    "\n\n" +
    "Pingdom reports issues reaching service\n" +
    desc + "\n"
    ).toString("base64");

    var payload = {
      "message": "Post Incident #" + id,
      "commiter": {
        "name": commiter_name,
        "email": commiter_email
      },
      "content": content
    };
    console.log("Committing..");

    request.put("https://api.github.com/repos/" + repo + "/contents/_posts/" + date + "-incident-" + id + ".md?access_token=" + token,
    {
      headers: {
        "User-Agent": "Pingdom-Poster-Bot"
      },
      json: true,
      body: payload
    }, function(err, reponse, body) {
      console.log(body);
      res.end("ok");
    });
  } else {
    res.end("meh");
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
// 00ecaf1d031e8d1458f08fda2af571a782b4ba67
