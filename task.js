#!/usr/bin/env node

var dotenv              = require('dotenv');
dotenv().load();

var to                  = process.env.TO;
var sendgrid_username   = process.env.SENDGRID_USERNAME; 
var sendgrid_password   = process.env.SENDGRID_PASSWORD; 

var sendgrid            = require('sendgrid')(sendgrid_username, sendgrid_password);
var request             = require('request');
var _                   = require('underscore');

request.get({url: 'http://goodfil.ms/graph/graph.json', json:true}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var filtered_points = _.filter(body.points, function(point) { return point.x >= 4; });
    var random          = _.random(0, filtered_points.length-1);
 
    var film            = filtered_points[random];

    var file            = {
      cid           : 'film_poster',
      filename      : 'poster.png',
      url           : film.image
    };

    var html            = "<p><img src='cid:film_poster'></p>" +
                          "<h2>"+film.title+"</h2>" +
                          "<p><a href='http://goodfil.ms"+film.url+"'>"+film.url+"</a></p>" +
                          "<p><a href=''></a>";
    
    var payload     = {
      to          : to, 
      from        : to, 
      subject     : '[send-film] delivery',
      files       : [file],
      html        : html 
    }
    console.log(payload);

    sendgrid.send(payload, function(err, json) {
      if (err) { return console.error(err); }
      console.log("Email sent with content: "+json);

      process.exit();
    });
  } else {
    process.exit();
  }
});
