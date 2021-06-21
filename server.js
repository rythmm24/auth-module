const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extendded: true}));
app.get('/',(req, res) => {
  res.json({ message: "Auth Application" });
});
const db = require("./app/models");
const Role = db.role;
const LoggerMiddleware = (req,res,next) =>{
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`)
  next();
}
app.use(LoggerMiddleware);

db.mongoose
  .connect('mongodb+srv://rythmm-98:iamsexy2@cluster0.zzh8c.mongodb.net/auth-db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
