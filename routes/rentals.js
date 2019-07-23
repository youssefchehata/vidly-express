const {Rental,validate} = require('../models/rental');
const {Movie} = require('../models/movie');      //change
const {Customer} = require('../models/customer');      //change

const Fawn = require('fawn')

const mongoose = require('mongoose')//MONGOOSE
const express = require('express');
const router = express.Router();

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut') //in descending order   //MONGOOSE
  res.send(rentals);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
  // return res.status(400).send('Invalid customer.')

  const customer = await Customer.findById(req.body.customerId)  //change
  if(!customer)return res.status(400).send('Invalid customer.')

  const movie = await Movie.findById(req.body.movieId)  //change
  if(!movie)return res.status(400).send('Invalid movie.')

  if(movie.numberInstock===0)return res.status(400).send('Movie not in stock')
  let rental = new Rental( {
  
      customer:{
          _id:customer._id,                                 //change
          name:customer.name,
          phone:customer.phone,
      },
      movie:{
          _id:movie._id,                                 //change
          title:movie.title,
          dailyRentalRate:movie.dailyRentalRate
      },

  });
  try {
      new Fawn.Task()
  .save('rentals',rental)
  .update('movies',{_id:movie._id},{
      $inc:{numberInStock:-1}
  })
  .run()  
  res.send(rental)
  }
catch (ex){
 res.status(500).send('something failed')
}
//   rental = await rental.save()     //MONGOOSE

//   movie.numberInstock-- //decrement stock
//   movie.save()
//   res.send(rental);
});



router.get('/:id',async (req, res) => {
 const rental = await Rental.findById(req.params.id)
   if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  res.send(rental);
});



module.exports = router;