const express = require('express');
const File = require('../models/File');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const config = require('../config');
const auth = require('../middleware/auth');

const imageFilter = (req, file, cb) => {
  const regExForPhotoExt = new RegExp(/(\W|^)(png|jpeg|jpg|bmp)(\W|$)/);
  if (!regExForPhotoExt.test(file.mimetype.split("/")[1])) {
    req.fileValidationError =
      'Invalid picture format. Valid format (jpg, jpeg, png, bmp)';
    return cb(
      null,
      false,
      new Error(
        'Invalid picture format. Valid format (jpg, jpeg, png, bmp)'
      )
    );
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: async (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5242880 },
  fileFilter: imageFilter,
});

const getFiles = async (req, res) => {
  try {
    const files = await File.findAll({ where: { UserId: req.user.id } });
    if (!files) return res.status(400).send({ message: 'Not own files' });
    res.status(200).send(files);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: 'Server error',
    });
  }
};

const createFile = async (req, res) => {
  try {
    const title = req.body.title;
    const UserId = req.user.id;
    if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    }
    if (req.files) {
      const arrPromises = req.files.map(async (file) => {
        const newFile = await File.create({
          title,
          UserId,
          image: file.filename,
        });
      });
      if (arrPromises.lenght === req.files.lenght) {
        res.status(201).send({ message: 'Success created' });
      } else return res.status(400).send({ error: 'Not completely created' });   
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: 'Server error',
      e,
    });
  }
};

const getOneFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });
    if (!file) return res.status(400).send({ message: 'Not own file' });
    res.status(200).send(file);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: 'Server error',
    });
  }
};

const createRouter = () => {
  const router = express.Router();
  router.get('/', auth, getFiles);
  router.get('/:id', auth, getOneFile);
  router.post('/', [upload.array('image', 10), auth], createFile);
  return router;
};

module.exports = createRouter;
