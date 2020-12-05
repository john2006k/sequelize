User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.get('Token');
  if (!token) {
    return res.status(401).send({ error: 'Token not presented' });
  }
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.sendStatus(401);
  }
  req.user = user;
  next();
};

module.exports = auth;
