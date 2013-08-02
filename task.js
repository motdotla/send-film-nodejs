#!/usr/bin/env node

var dotenv              = require('dotenv');
dotenv().load();

var to                  = process.env.TO;
var sendgrid_username   = process.env.SENDGRID_USERNAME; 
var sendgrid_password   = process.env.SENDGRID_PASSWORD; 

var sendgrid            = require('sendgrid')(sendgrid_username, sendgrid_password);
var goodfilmsGraph      = require('goodfilms-graph')();
var _                   = require('underscore');

var emailFilm = function(film) {
  var file            = {
    cid           : 'film_poster',
    filename      : 'poster.png',
    url           : film.image
  };

  var html            = "<p><img src='cid:film_poster'></p>" +
                        "<h2>"+film.title+"</h2>" +
                        "<p><a href='http://goodfil.ms"+film.url+"'>"+film.url+"</a></p>"; 

  var additional_html = "";
  if (film.netflix_url) {
    additional_html   += "<p><a href='"+film.netflix_url+"'>Netflix</a></p>";
  }
  if (film.itunes_url) {
    additional_html   += "<p><a href='"+film.itunes_url+"'>iTunes</a></p>";
  }
  if (film.amazon_url) {
    additional_html   += "<p><a href='"+film.amazon_url+"'>Amazon</a></p>";
  }
  if (film.hulu_url) {
    additional_html   += "<p><a href='"+film.hulu_url+"'>Hulu</a></p>";
  }

  html += additional_html;
  
  var payload     = {
    to          : to, 
    from        : to, 
    subject     : '[send-film] delivery',
    files       : [file],
    html        : html 
  }

  sendgrid.send(payload, function(err, json) {
    if (err) { 
      console.error(err); 
      return process.exit();
    }

    console.log("Email sent with content: "+JSON.stringify(json));

    return process.exit();
  });

};

var chooseRandomFilm = function() {
  console.log('Attempting to choose random film');

  goodfilmsGraph.random({x: 4, y: 4}, function(err, film) {
    console.log(film);

    if (err) { 
      console.error(err); 
      return process.exit();
    }

    if (film.netflix_url || film.itunes_url || film.amazon_url || film.hulu_url) {
      return emailFilm(film);
    } else {
      chooseRandomFilm();
    } 
  });
};

chooseRandomFilm();
