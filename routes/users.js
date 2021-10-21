var express = require('express');
var router = express.Router();
var users = require('../data/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var pincode = req.query.pincode;
  if(pincode.length < 6 || pincode.length > 6){
    res.status(201).json({status:"Failed" ,error: 'Invaild Pincode',pincode:pincode });
  } else {
    /* 
      1. Setup database and check in local database 
      2. check in lookup if not present in database and if found using lookup store details in database
      3. check in postal api if lookup failed and if found in postal api then store details in database
      4. not found any of three way return no data found error 202

    */
    res.json(pincode);
  }
  
});

module.exports = router;
