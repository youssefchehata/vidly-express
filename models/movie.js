const Joi = require('joi');
const mongoose = require('mongoose')//MONGOOSE
const {genreSchema}=require('./genre')                     //change


const Movie =  mongoose.model('Movie', new mongoose.Schema({ //MONGOOSE
    title:{ type:String, required:true,trim:true, minlength:5, maxlength:255 },
    numberInStock:{ type:Number, required:true, min:0, max:255 },
    dailyRentalRate:{ type:Number, required:true, min:0, max:255 },
    genre:{                                                //change
        type:genreSchema,
        required:true
    }}));


  function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.string().required(),                  //change
    };
  
    return Joi.validate(movie, schema);
  }
  
  exports.Movie = Movie
  exports.validate = validateMovie