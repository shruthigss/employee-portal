[
  {
    "title": "Introduction to JavaScript",
    "description": "Learn the basics of JavaScript programming language, including variables, functions, and control flow.",
    "tag": "Programming"
  },
  {
    "title": "Effective Time Management Techniques",
    "description": "Explore proven time management strategies to boost productivity and achieve better work-life balance.",
    "tag": "Productivity"
  },
  {
    "title": "Data Security Best Practices",
    "description": "Discover essential practices to ensure data security and protect sensitive information in your projects.",
    "tag": "Security"
  },
  {
    "title": "Getting Started with React",
    "description": "A beginner's guide to building user interfaces with React.js. Understand components, state, and props.",
    "tag": "Web Development"
  },
  {
    "title": "Effective Communication in the Workplace",
    "description": "Improve your communication skills to foster a positive and collaborative work environment.",
    "tag": "Communication"
  },
  {
    "title": "Machine Learning Basics",
    "description": "An overview of machine learning concepts, algorithms, and applications in real-world scenarios.",
    "tag": "Machine Learning"
  },
  {
    "title": "Agile Project Management Fundamentals",
    "description": "Understand the principles of agile project management and its application in modern software development.",
    "tag": "Project Management"
  },
  {
    "title": "Cybersecurity Fundamentals",
    "description": "Learn the fundamentals of cybersecurity, including common threats, preventive measures, and incident response.",
    "tag": "Cybersecurity"
  }
]


// app.put("/vote", (req, res) => {
//     const { upVote } = req.body;
//     let id = req.body.id;
//     const employeeId = req.body.employeeId; // Assuming you send the authenticated employee id in the request

//     // Fetch the post by id
//     const sqlSelect = `SELECT * FROM ideas WHERE id = ${id}`;
//     connection.query(sqlSelect, (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send(err);
//             return;
//         }

//         if (result.length === 0) {
//             res.status(404).send("Post not found");
//             return;
//         }

//         const post = result[0];

//         // Check if the authenticated employee is the creator
//         if (post.employeeid === employeeId) {
//             res.status(403).send("Creator cannot upvote their own post");
//             return;
//         }

//         // Update the vote count based on upVote, ensuring it doesn't go below 0
//         let voteChange = upVote ? 1 : -1;
//         if (!upVote && post.vote === 0) {
//             // If it's a downvote and the current count is 0, keep it at 0
//             voteChange = 0;
//         }

//         const sqlUpdate = `UPDATE ideas SET vote = GREATEST(0, vote + ${voteChange}) WHERE id = ${id}`;
//         connection.query(sqlUpdate, (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send(err);
//                 return;
//             }

//             res.send(result);
//         });
//     });
// });