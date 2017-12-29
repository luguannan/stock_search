var express = require('express');
var app = express();
var request = require('request');
var parser = require('xml2js');

// use public as static file folder.
app.use(express.static(__dirname + '/public')); 

function forwardJsonRequest(forwardUrl, req, res) {
	var input = req.param('input');

  	req = request({

    	url:forwardUrl+input ,
    	json: true
  	}, function(error, response, body) {

    	if (error) { return console.log(error); }

 		//console.log(body);
 		res.send(body);

	});

}

  function forwardJsonRequestIndicator(forwardIndicatorUrlPart1, forwardIndicatorUrlPart2,req,res) {
    var input = req.param('input');
    var indicator = req.param('indicator');
    req = request({
       url :forwardIndicatorUrlPart1+indicator+forwardIndicatorUrlPart2+input,
       json: true

    },function (error,response,body){

      if (error) { return console.log(error); }

    //console.log(body);
    res.send(body);
  });

   
}


function forwardXMLRequest(forwardUrl, req, res) {
  var input = req.param('input');


    req = request({

      url:forwardUrl+input+'.xml' ,

    }, function(error, response, body) {

      if (error) { return console.log(error); }

    var parseString = parser.parseString;

    parseString(body, function (err, result) {
      var jsonResult = JSON.stringify(result)
    //console.dir(JSON.stringify(result));

      res.send(JSON.stringify(result));
});
    

  });

}







app.get('/market.json',function(req,res){

	forwardJsonRequest('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=', req, res);
 });

app.get('/stock.json',function(req,res){
	forwardJsonRequest('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey=9L1UZT1MNNMSY7T6&symbol=', req, res);
 });

app.get('/chart.json',function(req,res){
  forwardJsonRequestIndicator('https://www.alphavantage.co/query?function=','&apikey=9L1UZT1MNNMSY7T6&interval=daily&time_period=10&series_type=close&symbol=', req, res);
 });

app.get('/news.json',function(req,res){
  forwardXMLRequest('https://seekingalpha.com/api/sa/combined/', req, res);
 });
app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});


app.listen(8081);



