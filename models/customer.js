const Joi = require('joi');
const mongoose = require('mongoose')//MONGOOSE
const Customer =  mongoose.model('Customer', new mongoose.Schema({ //MONGOOSE
    name:{
      type:String,
      required:true,
      minlength:5,
      maxlength:50
    },
    phone:{
      type:String,
      required:true,
      minlength:8,
      maxlength:50
    },
    isGold:{
      type:Boolean,
      default:false //default value false
   
    },
  }));
  function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
  }
  exports.Customer = Customer
  exports.validate = validateCustomer