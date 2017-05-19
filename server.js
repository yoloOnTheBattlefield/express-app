// BASE SETUP
// =============================================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://cristian:cristian@ds147681.mlab.com:47681/bears');

var Bear = require('./models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();


//middleware for our api
var logger = function(req, res, next){
  console.log('something is happening');
  next();
}

router.use(logger);


//(access at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// Routes for the API/
/**
*   Routes that end in /bears
*/

router.route('/bears')
  .post(function(req, res){   //Create a new bear
    var bear = new Bear();  //Create a new bear model instance
    bear.name = req.body.name;  //Set the bears name comes from request's body

    //Save the bear and check for errors X(
    bear.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({message: `${bear.name} created!`})
    });

  })
  .get(function(req, res){  //Get all the bears
    Bear.find(function(err, bears){
      if(err){
        res.send(err);
      }
      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get(function(req, res){  //Get a specific bear by his id
    Bear.findById(req.params.bear_id, function(err, bear){
      if(err){
        res.send(err);
      }
      res.json(bear);
    });
  })
  .put(function(req, res){  //Update the bear with this id
    Bear.findById(req.params.bear_id, function(err, bear){
      if(err){
        res.send(err);
      }
      bear.name = req.body.name;
      bear.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({ message: `${bear.name} updated!` });
      })
    })
  })
  .delete(function(req, res){
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear){
      if(err){
        res.send(err);
      }
      res.json({ message: 'Succesfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
