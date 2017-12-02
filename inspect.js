var mysql = require('mysql');
var http = require('http');

var results;
var totalrows = 0;

var con = mysql.createConnection({
  host: "play.pulsarmc.com",
  user: "endylan",
  password: "Password-123",
  database: "nodejs_student"
});

con.connect(function(err){
  if(err) throw err;
  con.query("SELECT distinct * FROM STUDENTS", function (err, result, fields){
    if (err) throw error;

    results = result;
    totalrows = result.length;
    console.log("Total no of rows : " + totalrows);

  })
})

http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
res.write('<center><table style="width:70%" class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">')
res.write('<thead><tr>')
res.write('<th class="mdl-data-table__cell--non-numeric">First Name</th>')
res.write('<th>Last Name</th>')
res.write('<th>Age</th>')
res.write('<th>Gender</th>')
res.write('<th>Address</th>')
res.write('<th>Postal Code</th>')
res.write('<th>Email Address</th>')
res.write('<th>Phone Number</th>')
res.write('<th>Grade</th>')
res.write('<th>Hobby</th>')
res.write('</tr></thead>')

res.write('<tbody>')

if (totalrows > 0)
{
for (i = 0; i < totalrows; i++) {
  res.write('<tr>')
  res.write('<td class="mdl-data-table__cell--non-numeric">' + results[i].fname + '</td>')
  res.write('<td>' + results[i].lname + '</td>')
  res.write('<td>' + results[i].age + '</td>')
  res.write('<td>' + results[i].gender + '</td>')
  res.write('<td>' + results[i].address + '</td>')
  res.write('<td>' + results[i].postal + '</td>')
  res.write('<td>' + results[i].emailid + '</td>')
  res.write('<td>' + results[i].phone + '</td>')
  res.write('<td>' + results[i].grade + '</td>')
  res.write('<td>' + results[i].hobby + '</td>')
  res.write('</tr>')
}
}
res.write('</tbody>')
res.write('</table></center>')
res.end()
}).listen(8080);
console.log("[Webserver] Started.");
