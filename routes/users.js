var express = require('express');
var http = require('http');
const https = require('https');
var router = express.Router();
var users = require('../data/users');
var conneciton  = require('../database/connection');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var pincode = req.query.pincode;
  console.log("Request received for pincode :"+pincode);
  if(pincode.length < 6 || pincode.length > 6){
    console.log("Pincode is not vaild!!!");
    res.status(201).json({status:"Failed" ,error: 'Invaild Pincode',pincode:pincode });
  } else {
    
    /* 
      1. Setup database and check in local database 
      2. check in lookup if not present in database and if found using lookup store details in database
      3. check in postal api if lookup failed and if found in postal api then store details in database
      4. not found any of three way return no data found error 202
    */
    conneciton.query("SELECT p.state_code as state_code, p.country_code  as country_code, p.name as name, p.pincode, p.District, s.name as state_name ,'India' as country_name from pincode p join state s on p.state_code = s.iso2_code where p.pincode =  ?",
    [pincode],(err,rows,fields)=>{
      if(!err){
        if(rows.length != 0){
          console.log("Pincode is present in database.");
          res.send(rows);
        }else {
          console.log("Pincode is not present in database. Try to fetch using lookup.");
          var stateCode = zipCodeToStateCode(pincode);
          if(typeof stateCode !== 'undefined' && stateCode){
            console.log("Request Pincode present in lookup!!");
            conneciton.query("select s.name from state s where iso2_code = ?",[stateCode],(err,rows,fields)=>{
              if(!err){
                var name = rows[0].name;
                console.log(name);
                conneciton.query("INSERT INTO `pincode`(`pincode`, `state_code`, `country_code`, `name`) VALUES (?,?,?,?)",[pincode,stateCode,'IN',name],(err,rows,fields)=>{
                  if(!err){
                    console.log("Pincode fetched by lookup stored in database.");
                    res.json(result);
                  }else{
                    console.log(err)
                  }
                });                
              }else{
                console.log(err)
              }
            })
            res.send(pincode);
          }else{
            console.log("Requested pincode not present in database nor in lookup now. api call start");
            const httpReq = https
            .get("https://api.postalpincode.in/pincode/"+pincode, resp => {
              let data = "";
              // A chunk of data has been recieved.
              resp.on("data", chunk => {
                data += chunk;
              });
              // The whole response has been received. Print out the result.
              resp.on("end", () => {
                console.log(data);
                var result = JSON.parse(data);
                if(result[0].Status == 'Error'){
                  console.log("Requested pinode not present in database , not in lookup nor in api.")
                  res.status(202).json({Status:"Error" ,Message: 'No records found',PostOffice:null });
                }else{
                  console.log("Request pincode presented in api length : "+result.length);
                  console.log(result[0].PostOffice);
                  var postOffice = result[0].PostOffice;
                  for (let i = 0; i < postOffice.length; i++){
                    console.log(postOffice[i].State);
                    conneciton.query("select s.iso2_code from state s where name = ?",[postOffice[i].State],(err,rows,fields)=>{
                      if(!err){
                          console.log(rows[0].iso2_code);
                          conneciton.query("INSERT INTO `pincode`(`pincode`, `state_code`, `country_code`, `name`,`District`) VALUES (?,?,?,?,?)",[pincode,rows[0].iso2_code,'IN',postOffice[i].Name,postOffice[i].District],(err,rows,fields)=>{
                          if(!err){
                              console.log("Api data stroe in database.");
                          }else{
                              console.log(err);
                          }
                          }); 
                      } else {
                          console.log(err);
                      }
                    });
                  }
                  res.json(result);
                }
              });
            })
            .on("error", err => {
              console.log("Error: " + err.message);
            });
            httpReq.end();
            
          }
        }
        
      }else {
        console.log(err);
      }
    })
    //res.json(pincode);
  }
  
});
function zipCodeToStateCode(zipCode) {

  var stateCode ;
  var threeDigitPrefix = zipCode.substring(0,3);
  var twoDigitPrefix = zipCode.substring(0,2);

  //Daman and Diu
  if(zipCode.startsWith("396210")) stateCode = "DD";

  //Check zipcode on the bases of starting three digit
      //Dadra and Nagar Haveli
  else if(threeDigitPrefix == 396) stateCode = "DN";

  //Goa
  else if(threeDigitPrefix == 403) stateCode = "GA";

  //Puducherry
  else if(threeDigitPrefix == 605) stateCode = "PY";

  //Lakshadweep
  else if(threeDigitPrefix == 682) stateCode = "LD";

  //Sikkim
  else if(threeDigitPrefix == 737) stateCode = "SK";

  //Andaman and Nicobar Islands
  else if(threeDigitPrefix == 744) stateCode = "AN";

  //Manipur
  else if(threeDigitPrefix == 795) stateCode = "MN";

  //Mizoram
  else if(threeDigitPrefix == 796) stateCode = "MZ";

  //Tripura
  else if(threeDigitPrefix == 799) stateCode = "TR";

  //Arunachal Pradesh
  else if(threeDigitPrefix >= 790 && threeDigitPrefix <= 792) stateCode = "AR";

  //Meghalaya
  else if(threeDigitPrefix >= 793 && threeDigitPrefix <= 794) stateCode = "ML";

  //Nagaland
  else if(threeDigitPrefix >= 797 && threeDigitPrefix <= 798) stateCode = "NL";

  //Check zipcode on the bases of starting two digit
      //Delhi
  else if(twoDigitPrefix == 11) stateCode = "DL";

  //Chandigarh
  else if(twoDigitPrefix == 16) stateCode = "CH";

  //Himachal Pradesh
  else if(twoDigitPrefix == 17) stateCode = "HP";

  //Chhattisgarh
  else if(twoDigitPrefix == 49) stateCode = "CT";

  //Telangana
  else if(twoDigitPrefix == 50) stateCode = "TG";

  //Assam
  else if(twoDigitPrefix == 78) stateCode = "AS";

  //Haryana
  else if(twoDigitPrefix >= 12 && twoDigitPrefix <= 13) stateCode = "HR";

  //Punjab
  else if(twoDigitPrefix >= 14 && twoDigitPrefix <= 15) stateCode = "PB";

  //Rajasthan
  else if(twoDigitPrefix >= 30 && twoDigitPrefix <= 34) stateCode = "RJ";

  //Gujarat
  else if(twoDigitPrefix >= 36 && twoDigitPrefix <= 39) stateCode = "GJ";

  //Maharashtra
  else if(twoDigitPrefix >= 40 && twoDigitPrefix <= 44) stateCode = "MH";

  //Madhya Pradesh
  else if(twoDigitPrefix >= 45 && twoDigitPrefix <= 48) stateCode = "MP";

  //Andhra Pradesh
  else if(twoDigitPrefix >= 51 && twoDigitPrefix <= 53) stateCode = "AP";

  //Karnataka
  else if(twoDigitPrefix >= 56 && twoDigitPrefix <= 59) stateCode = "KA";

  //Tamil Nadu
  else if(twoDigitPrefix >= 60 && twoDigitPrefix <= 66) stateCode = "TN";

  //Kerala
  else if(twoDigitPrefix >= 67 && twoDigitPrefix <= 69) stateCode = "KL";

  //West Bengal
  else if(twoDigitPrefix >= 70 && twoDigitPrefix <= 74) stateCode = "WB";

  //Odisha
  else if(twoDigitPrefix >= 75 && twoDigitPrefix <= 77) stateCode = "OR";


  return stateCode;
}
module.exports = router;
