var express = require('express');
var router = express.Router();

cn="DRIVER={DB2 ODBC Driver};DATABASE=SAMPLE;HOSTNAME=localhost;UID=rohit;PWD=D#st1nat1on8;PORT=50000;PROTOCOL=TCPIP";


/*
 * GET druglist.
 */
router.get('/druglist', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); return console.log(err);}
    
      conn.query("select * from drug WHERE drugName = 'PCM'", function(err, data) {

        if(err) {
          res.json(err);
          console.log("select error :" +err);
        } else {
          res.json(data);
        }

        conn.close(function() {
          console.log("connection closed");
        });
      });

    });
  });


  /*
 * GET drug (search).
 */
router.get('/search/:drugname', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); return console.log(err);}

      var drug = req.params.drugname;
      console.log("searched drug :" + drug);

      conn.prepare("select * from drug WHERE drugName = ?", function (err, stmt) {
        if (err) { res.json(err); console.log(err); conn.closeSync(); }

        stmt.execute([drug], function (err, result) {
          if (err) { res.json(err); console.log(err); }
          else {
            var data = result.fetchAllSync();
            if(data.length !== 0) {
              console.log(data);
              res.json(data);
            }else {
              console.log("No such drug found");
              res.json("No such drug found");
            }  
            result.closeSync();
            stmt.closeSync();
          }

          conn.close(function() {
          console.log("connection closed");
          });
        });
      });

    });
  });

/*
 * POST to createdb.
 */
router.post('/createdb', function(req, res) {
    var db = req.db;
    db.open(cn, function (err,conn){
      if(err){ res.json(err); return console.log(err);}
    
      conn.query("create table drug (drugID int, drugName char(30))", function(err) {
    
      if(err){
        res.json(err);
        console.log("db creation error :" +err);   
      }else{
        res.json("db created");
        console.log("db created");
      }
      conn.close(function(){console.log("connection closed");});
      });
   });
});


/*
 * POST to inserting drug.
 */
router.post('/addbanneddrug', function(req, res) {
  var db = req.db;
  db.open(cn, function (err, conn){
    if(err){ res.json(err); return console.log(err);}

    conn.query("insert into drug values(1, 'PCM')", function(err) {
      
      if(err){
        res.json(err);
        console.log("db insert error :" +err);   
      }else{
        res.json("drug added");
        console.log("drug added");
      }

      conn.close(function(){console.log("connection closed");});
    });

  });
});


/*
 * POST to deleting db.
 */
router.post('/deletedb', function(req, res) {
  var db = req.db;
  db.open(cn, function (err, conn){
    if(err){ res.json(err); return console.log(err);}

    conn.prepare("drop table drug", function(err, stmt) {
      
      if(err) {
        console.log("delete table error :"+err);
        conn.close(function() { 
          console.log("connection closed" );
        });
        res.json(err);
      }else {
        stmt.execute([], function(err, result) {
          
          if(err) {
            res.json(err);
            console.log("delete execute error :"+err);
          }else {
            result.closeSync();
            res.json("db dropped");
            console.log("db dropped");
          }

          conn.close(function() {
            console.log("connection closed" );
          });
        });
      }

    });
  }); 
});


module.exports = router;