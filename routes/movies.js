const {Movie,validate} = require('../models/movie');
const {Genre} = require('../models/genre');      //change

const mongoose = require('mongoose')//MONGOOSE
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name')    //MONGOOSE
  res.send(movies);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId)  //change
  if(!genre)return res.status(400).send('Invalid genre.')

  let movie = new Movie( {
      title: req.body.title,      //MONGOOSE
      numberInStock:req.body.numberInStock,
      dailyRentalRate:req.body.dailyRentalRate,
      genre:{
          _id:genre._id,                                 //change
          name:genre.name
      }

  });
  
  movie = await movie.save()     //MONGOOSE
  res.send(movie);
});

router.put('/:id',async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const movie = await Movie.findByIdAndUpdate(req.params.id,{name:req.body.name},{  //MONGOOSE
    new:true
  })
   
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.delete('/:id',async (req, res) => {
 const movie = await Movie.findByIdAndRemove(req.params.id)

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id',async (req, res) => {
 const movie = await Movie.findById(req.params.id)
   if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});



module.exports = router;