const express = require("express");
const path = require('path');
const sequelize = require('./utils/database');
const applyExtraSetup = require('./extra-setup');
const PORT = process.env.PORT || 8000;
const app = express();

const users = require('./controllers/users');
const files = require('./controllers/files');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.use("/files", files());
app.use("/users", users());

async function start() {
    try {
      await sequelize.sync()
      app.listen(PORT)
      console.log("listen");
    } catch (e) {
      console.log(e)
    }
  }

  applyExtraSetup(sequelize)
  
  start()
