const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const providerAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Access denied. Provider only.' });
    }
    next();
  });
};

const adopterAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'adopter') {
      return res.status(403).json({ message: 'Access denied. Adopter only.' });
    }
    next();
  });
};

module.exports = { auth, providerAuth, adopterAuth };
