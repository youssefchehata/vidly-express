const {Customer,validate} = require('../models/customer');//destructuring
const mongoose = require('mongoose')//MONGOOSE
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const customers = await Customer.find()    //MONGOOSE
  res.send(customers);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer( {
      name: req.body.name,      //MONGOOSE
      phone: req.body.phone,      
      isGold: req.body.isGold,      
  });
  
   await customer.save()     //MONGOOSE
  res.send(customer);
});

router.put('/:id',async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(req.params.id,{  
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone},{  //MONGOOSE
    new:true
  })
   
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.delete('/:id',async (req, res) => {
 const customer = await Customer.findByIdAndRemove(req.params.id)

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id',async (req, res) => {
 const customer = await Customer.findById(req.params.id)
   if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
});



module.exports = router;