const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const body_parser = require("body-parser");
app.use(body_parser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'nodejs',
    port:3306
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected");
    }
});

//====================================================login=================================================

app.post("/login", (req, res) => {
    let employeeid = req.body.employeeid;
    connection.query('select * from userid where employeeid = ?', [employeeid], (err, result) => {
        if (err) {
            req.setEncoding({ err: err });
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.send({ message: "Employee Id does not exits" })
            }
        }
    });
});

//=========================================Get all Ideas =======================================================

app.get('/ideas', (req, res) => {
    connection.query('select * from ideas', (err, result, field) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result);
        }
    });
});
//=============================================by DESC date===========================================================
app.get("/sortdate", (req, res) => {
    connection.query('SELECT * FROM ideas ORDER BY date DESC, date_format(date, "%H:%i:%s") DESC', (err, result, field) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(result);
        }
    });
});

//==============================================By DESC id ==========================================================
app.get("/sortvote", (req, res) => {
    connection.query('select * from ideas order by vote DESC', (err, result, field) => {
        if(result){
            res.send(result);
        }
        else console.log(err);
    })
})

//================================================Insert all==================================================
app.post('/ideas', (req, res) => {
    let title = req.body.title;
    let des = req.body.des;
    let tag = req.body.tag;
    let employeeid = req.body.employeeid;
    let vote = req.body.vote;
    let voted_by = req.body.voted_by;
    connection.query('insert into ideas (title,des,tag,employeeid,vote,voted_by) values(?,?,?,?,?,?)', [title, des, tag, employeeid,vote,voted_by],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });

});

//==============================================Searching Query ================================================

app.get('/search', function (req, res) {
    var title = req.query.title;
    var search = `select * from ideas where title like "${title}%" `;
    connection.query(search, function (error, results, fields) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "erreur survenue"
            })
        } else {
            res.send(results);
        }
    });
});

app.put("/vote", (req, res) => {
    const { upVote } = req.body;
    let id = req.body.id;
    if (req.body.upVote) var sqlupdate = `update ideas set vote = vote-1 where id = ${id}`;
    else var sqlupdate = `update  ideas set vote = vote+1 where id = ${id}`;
    connection.query(sqlupdate, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    })
});

app.put("/liked",(req,res)=>{
    const {id,employeeid} =req.body;
    const query = `update ideas set liked_by = JSON_ARRAY_APPEND(liked_by, '$.votedBy',?) where id = ?;`
    connection.query(query,[employeeid,id],(err,result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
   })
});

app.put("/disliked", (req, res) => {
    const { id, employeeIndex } = req.body;
    const parsedIndex = parseInt(employeeIndex, 10);
    console.log(parsedIndex);
  
    const jsonPathExpression = `$.votedBy[${parsedIndex >= 0 ? parsedIndex : 0}]`;
  
    const query = `UPDATE ideas SET liked_by = JSON_REMOVE(liked_by, ?) WHERE id = ?;`;
  
    connection.query(query, [jsonPathExpression, id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
      res.send(result);
    });
  });

app.listen(5000, () => {
    console.log("server running");
});




















//=============================================Update votes=========================================
// app.post("/likes", (req,res)=>{
//     const q = "INSERT INTO user_like (`id`) VALUES (?)";
//     const values = [
//       req.params.employeeid,
//       req.body.id
//     ];
//     connection.query(q, [values], (err, data) => {
//         console.log(data);
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("Post has been liked.");
//     });
//   });

// app.get('/search', function (req, res) {
//     var title = req.query.title;
//     var tag = req.query.tag;
//     var search = `select * from ideas where title like "${title}%" or "${tag}%"`;
//     connection.query(search, function (error, results, fields) {
//         if (error) {
//             console.log("error ocurred", error);
//             res.send({
//                 "code": 400,
//                 "failed": "erreur survenue"
//             })
//         } else {
//             res.send(results);
//         }
//     });
// });


    // app.put("/upvote", (req, res) => {
    //     const { id, upvoted, employeeid,liked_by, liked_byIndex } = req.body;
    //     console.log(id, upvoted, employeeid,liked_by,liked_byIndex);
    //     if (upvoted) var sqlUpvote = `UPDATE ideas SET vote = vote-1 WHERE id = ${id};
    //     UPDATE ideas SET liked_by = JSON_REMOVE(liked_by, '$.employeeid[${liked_byIndex}]')
    //     WHERE id = ${id}; UPDATE ideas SET liked_by = JSON_REMOVE(like_by, '$.[${liked_byIndex}]') 
    //     WHERE id = ${id};`;                                 
    //     else {
    //         var sqlUpvote = `UPDATE ideas SET vote = vote+1 WHERE id = ${id};
    //         UPDATE ideas SET liked_by = JSON_ARRAY_APPEND(liked_by, '$.employeeid', 
    //         ${employeeid}) WHERE id = ${id};UPDATE ideass SET liked_by = JSON_ARRAY_APPEND(liked_by,
    //              '$.liked_by', '${liked_by}') WHERE id = ${id};`;
    //     }
    //     connection.query(sqlUpvote, (error, result) => {
    //         if (error) console.log(error);
    //         res.send(result);
    //     })
    // })
