const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose'); //MONGOOSE
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }); //
  if (user) return res.status(400).send('User already registred.');

  user = new User(
    _.pick(req.body, ['_id', 'name', 'email', 'password']) //MONGOOSE
    // { name: req.body.name, email: req.body.email, password: req.body.password }
  );
  //salt & hash bcrypt password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save(); //MONGOOSE

  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  
  const token = user.generateAuthToken()  //token
  res.header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));//token
  // res.send({ name:user.name, email:user.email });//to exclude password from user
});

module.exports = router;
