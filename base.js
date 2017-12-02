var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var url = require('url');

var results;
var totalrows = 0;

var con = mysql.createConnection({
  host: "play.pulsarmc.com",
  user: "endylan",
  password: "Password-123",
});

createDatabase();

function createDatabase() {
  con.connect(function(err) {
    if (err) throw err;
    console.log("[SQL] Connection Successful.");
    console.log("[SQL] Preparing database.");
    con.query("CREATE DATABASE nodejs_student", function(err, result) {
      if (err) {
        main()
      } else {
        console.log("[SQL] This is the first time this application is runned, therefore a database has been created.");
        createTable();
      }
    })
  })
}

function createTable() {
  con = mysql.createConnection({
    host: "play.pulsarmc.com",
    user: "endylan",
    password: "Password-123",
    database: "nodejs_student"
  });
  con.connect(function(err) {
    if (err) throw err;
    //tables
    con.query("CREATE TABLE students (fname VARCHAR(255), lname VARCHAR(255), address VARCHAR(255),  postalcode VARCHAR(255), age VARCHAR(255), gender VARCHAR(255), emailid VARCHAR(255), mobileno VARCHAR(255), grade VARCHAR(255), hobby VARCHAR(255))", function(err, result) {
      if (err) {
        main()
      } else {
        console.log("[SQL] Tables created - First run.");
        alterTable();
      }
    });
  });
}

function alterTable() {
  console.log("[SQL] Setting additional attributes - First run.");
  con.query("ALTER TABLE students ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY", function(err, result) {
    if (err) throw err;
    main();
  });
}

function main() {
  console.log("[Webserver] Starting web interface.");
  http.createServer(function(req, res) {
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      res.write(data);


      var conn = mysql.createConnection({
        host: "play.pulsarmc.com",
        user: "endylan",
        password: "Password-123",
        database: "nodejs_student"
      });

      conn.query("SELECT distinct * FROM STUDENTS", function(err, result, fields) {
        if (err) throw err;

        results = result;
        totalrows = result.length;
        console.log("First Name : " + results[0].fname);
        console.log("Total no of rows : " + totalrows);

      })
      res.write('<center><table style="width:70%; margin-bottom:20px;" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">')
      res.write('<thead><tr>')
      res.write('<th class="mdl-data-table__cell--non-numeric">First Name</th>')
      res.write('<th>Last Name</th>')
      res.write('<th>Age</th>')
      res.write('<th>Postal Code</th>')
      res.write('<th>Gender</th>')
      res.write('<th>Address</th>')
      res.write('<th>Email Address</th>')
      res.write('<th>Phone Number</th>')
      res.write('<th>Grade</th>')
      res.write('<th>Hobby</th>')
      res.write('</tr></thead>')

      res.write('<tbody>')

      if (totalrows > 0) {
        for (i = 0; i < totalrows; i++) {
          if (results[i].fname != 'undefined') {
            res.write('<tr>')
            res.write('<td class="mdl-data-table__cell--non-numeric">' + results[i].fname + '</td>')
            res.write('<td>' + results[i].lname + '</td>')
            res.write('<td>' + results[i].age + '</td>')
            res.write('<td>' + results[i].gender + '</td>')
            res.write('<td>' + results[i].address + '</td>')
            res.write('<td>' + results[i].postalcode + '</td>')
            res.write('<td>' + results[i].emailid + '</td>')
            res.write('<td>' + results[i].mobileno + '</td>')
            res.write('<td>' + results[i].grade + '</td>')
            res.write('<td>' + results[i].hobby + '</td>')
            res.write('</tr>')
          }
        }
      }
      res.write('</tbody>')
      res.write('</table></center>')



      res.end();

      //fname=___&lname=___&age=1&gender=on&address=___&postal=1&emailid=___&phone=1&grade=___&hobby=___

      var q = url.parse(req.url, true).query; //querystring

      //correction for gender field
      if (q.gender == "on") {
        q.gender = "male"
      } else {
        q.gender = "female"
      };


      if (q.fname != "" && q.lname != "") {
        var data = '"' + q.fname + '"' + ", " + '"' + q.lname + '"' + ", " + '"' + q.gender + '"' + ", " + '"' + q.address + '"' + ", " + '"' + q.age + '"' + ", " + '"' + q.postal + '"' + ", " + '"' + q.emailid + '"' + ", " + '"' + q.phone + '"' + ", " + '"' + q.grade + '"' + ", " + '"' + q.hobby + '"';
        var sqlcommand = "INSERT INTO nodejs_student.students (fname, lname, address, postalcode, age, gender, emailid, mobileno, grade, hobby) VALUES (" + data + ")";
        con.query(sqlcommand, function(err, result) {
          if (err) throw err;
          console.log("[SQL] Added a record");
          //con.end();
        });
      } else {
        console.log('Rejected data')
      }
    });

    var sqlcommand = "DELETE FROM nodejs_student.students where fname= 'undefined'";
    con.query(sqlcommand, function(err, result) {
      if (err) throw err;
      //con.end();
    });




  }).listen(8080);
  console.log("[Webserver] Started.");
}
