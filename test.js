// Sending an HTTP Request from a NodeJS server

//const http = require("http");
const { CONNREFUSED } = require("dns");

const https = require("https");
var conneciton  = require("./database/connection");
var pincode = '201001';

// function data(name,pincode, stateName, stateCode, District, countryName){
//   this.name = name;
//   this.pincode = pincode;
//   this.stateCode = stateCode;
//   this.stateName = stateName;
//   this.District = District;
//   this.countryName = countryName;
// }
// const httpReq = https
//   .get("https://api.postalpincode.in/pincode/"+"201001", resp => {
//     let data = "";

//     // A chunk of data has been recieved.
//     resp.on("data", chunk => {
//       data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on("end", () => {
//         console.log(data);
//         var result = JSON.parse(data);
//         if(result[0].Status == 'Error'){
//           console.log("Requested pinode not present in database , not in lookup nor in api.")
//           //res.status(202).json({Status:"Error" ,Message: 'No records found',PostOffice:null });
//         }else{
//           console.log("Request pincode presented in api length : "+result.length);
//           console.log(result[0].PostOffice);
//           var postOffice = result[0].PostOffice;
//           var datas = [];
//           let stateCode;
//           conneciton.query("select s.iso2_code from state s where name = ?",[postOffice[0].State],(err,rows,fields)=>{
//             if(!err){
//               console.log("STATE CODE "+rows[0].iso2_code);
//               stateCode = rows[0].iso2_code;
//               let jsonObj = {
//                 "name": postOffice[i].Name,
//                 "pincode": pincode,
//                 "stateName": postOffice[i].State,
//                 "stateCode": stateCode,
//                 "district":postOffice[i].District,
//                 "countryName":postOffice[i].Country
//               } 
//               console.log(jsonObj);                   
//               datas.push(jsonObj);
//             }else {
//               console.log(err);
//             }
//           });
//           // for (let i = 0; i < postOffice.length; i++){
//           //   let jsonObj = {
//           //     "name": postOffice[i].Name,
//           //     "pincode": pincode,
//           //     "stateName": postOffice[i].State,
//           //     "stateCode": stateCode,
//           //     "district":postOffice[i].District,
//           //     "countryName":postOffice[i].Country
//           //   } 
//           //   console.log(jsonObj);                   
//           //   datas.push(jsonObj);
//           // }
          
//           for (let i = 0; i < postOffice.length; i++){
//             console.log(postOffice[i].State);
//             conneciton.query("INSERT INTO `pincode`(`pincode`, `state_code`, `country_code`, `name`,`District`) VALUES (?,?,?,?,?)",[pincode,stateCode,'IN',postOffice[i].Name,postOffice[i].District],(err,rows,fields)=>{
//             if(!err){
//                 console.log("Api data stroe in database."); 
                
//             }else{
//                 console.log(err);
//             }
//             }); 
//           }
//           console.log({Status:"Success" ,Message: 'Number of pincode(s) found: '+postOffice.length,data:datas});
//         }
//     });
//   })
//   .on("error", err => {
//     console.log("Error: " + err.message);
//   });
//   httpReq.end();

/**
 * Astronomy Picture of the Day (APOD)
 * https://api.nasa.gov/planetary/apod?api_key=[Your API key here]
 * PARAMS:
 * api_key
 * hd [Boolean] default false
 * date [YYYY-MM-DD] default today
 *
 * RESPONSE:
 * copyright
 * date
 * explanation
 * title
 * hdurl
 * url
 * media_type: 'image'
 * service_version: 'v1'
 */