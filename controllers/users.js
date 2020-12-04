const express = require("express");
const User = require('../models/User');
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const {nanoid} = require('nanoid');

const checkPassword = (passFromUser, passFromDB) => {
  return bcrypt.compare(passFromUser, passFromDB);
};

const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  return await bcrypt.hash(password, salt);
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        users.map(user => {
            delete user.password
        })
        res.status(200).send(users)
      } catch (e) {
        console.log(e)
        res.status(500).send({
          message: 'Server error'
        })
      }
};

const createUser = async (req, res) => {
    try {
        const hashPass = await getHashPassword(req.body.password);
        const token = nanoid();
        const user = await User.create({
          username: req.body.username,
          password: hashPass,
          token
        })
        const sendUser = {
          id: user.id,
          username: user.username,
          token: user.token
        }
        res.status(201).send(sendUser)
      } catch (e) {
        console.log(e)
        res.status(500).send(e.errors[0].message)
      }
};

const login = async (req, res) => {
    const user = await User.findOne({where: {username: req.body.username}});

    if (!user) {
        return res.status(400).send({error: "Username not found"});
    }
    const isMatch = await checkPassword(req.body.password, user.password);
    
    if (!isMatch) {
        return res.status(400).send({error: "Password is wrong"});
    }

    user.token = nanoid();

    await user.save();
    const sendUser = {
      id: user.id,
      username: user.username,
      token: user.token
    }
    res.send(sendUser);  
};

const logout = async (req, res) => {
    const token = req.get("Token");
    const success = {message: "Logout success"};
    if (!token) return res.send(success);
    try {
      const user = await User.findOne({where: {token}});
      if (!user) return res.send(success);
      user.token = nanoid();
      await user.save();
    } catch(e) {
      res.status(500).send({message: "Logout failure"});
    }
    res.send(success);
};

const createRouter = () => {
    const router = express.Router();
  router.get("/", getUsers);
  router.post("/", createUser);
  router.post("/sessions", login);
  router.delete("/sessions", logout);
  return router;
};

module.exports = createRouter;
