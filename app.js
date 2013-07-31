var dotenv = require('dotenv');
dotenv().load();

var port        = parseInt(process.env.PORT) || 3000;
var hapi        = require('hapi');

var server      = new hapi.Server(+port, '0.0.0.0', { cors: true });

var home      = {
  index: {
    handler: function(request) {
      request.reply({
        success: true,
        message: "send-film is running"
      });    
    }
  }
};

server.route({
  method    : 'GET',
  path      : '/',
  config    : home.index
});

server.start();
