var express = require('express');
var router = express.Router();

cn="DRIVER={DB2 ODBC Driver};DATABASE=SAMPLE;HOSTNAME=localhost;UID=rohit;PWD=D#st1nat1on8;PORT=50000;PROTOCOL=TCPIP";


/*
 * GET druglist.
 */
router.get('/druglist', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); console.log(err); conn.closeSync(); }
      
      else {
        conn.query("select * from drug", function(err, data) {

          if(err) {
            res.json(err);
            console.log("select error :" +err);
          }else {
            res.json(data);
          }

          conn.close(function() { console.log("connection closed"); });

        });
      }
    });
  });


  /*
 * GET drug (search).
 */

router.get('/search/:drugname', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); console.log(err); conn.closeSync(); }
      
      else {
        var drug = req.params.drugname;
        console.log("searched drug :" + drug);

        conn.prepare("select * from drug WHERE drugName = ?", function (err, stmt) {
          if (err) { res.json(err); console.log(err); conn.closeSync(); }

          else {
            stmt.execute([drug], function (err, result) {
              if (err) { res.json(err); console.log(err); }
              else {
                var data = result.fetchAllSync();
                if(data.length !== 0) {
                  res.json(data);
                }else {
                  res.json("No such drug found");
                  console.log("No such drug found");
                }

                result.closeSync();
                stmt.closeSync();
              }

              conn.close(function() { console.log("connection closed"); });
            });  
          }

        });
      }
    });
  });


/*
 * POST to createdb.
 */
router.post('/createdb', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); console.log(err); conn.closeSync(); }
      
      else {
        conn.query("create table drug (drugID int, drugName char(30))", function(err) {

          if(err){
            res.json(err);
            console.log("db creation error :" +err);
          }else {
            res.json("db created");
            console.log("db created");
          }

          conn.close(function(){console.log("connection closed");});

        });
      }
   });
});


/*
 * POST to inserting drug (Single)
 * send : drugid : "value", drugname : "value"
 */
router.post('/addbanneddrug', function(req, res) {
  var drugID = req.body.drugid;
  var drugName = req.body.drugname;
  var db = req.db;

  if(!drugID || !drugName) {
    if(!drugID) res.json("Invaild data format- 'drugid'");
    else if(!drugName) res.json("Invaild data format- 'drugname'");
  }
  else {
    db.open(cn, function (err, conn) {
      if(err){ res.json(err); console.log(err); conn.closeSync(); }

      else {
        conn.prepare("insert into drug (drugID, drugName) VALUES (?, ?)", function (err, stmt) {
          if (err) { res.json(err); console.log(err); conn.closeSync(); }
          
          else {
            stmt.execute([drugID, drugName], function (err, result) {
              if(err) { res.json(err); console.log("db insert error :"+ err); }
              else {
                res.json("" + req.body.drugname +" added successfully");
                result.closeSync();
                stmt.closeSync();
              }
              
              conn.close(function() { console.log("connection closed"); });   
            });
          }

        });
      }
    });
  }
});


/*
 * POST to deleting db.
 */
router.post('/deletedb', function(req, res) {
  var db = req.db;
  db.open(cn, function (err, conn){
    if(err){ res.json(err); console.log(err); conn.closeSync();}
    
    else {
      conn.prepare("drop table drug", function(err, stmt) {
        if(err) { res.json(err); console.log(err); conn.closeSync(); }
        
        else {
          stmt.execute([], function(err, result) {
            if(err) { res.json(err); console.log("delete execute error :"+err); }
            else {
              res.json("db dropped");
              result.closeSync();
              stmt.closeSync();
            }

            conn.close(function() { console.log("connection closed"); });
          });
        }

      });
    }
  }); 
});


module.exports = router;