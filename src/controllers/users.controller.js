const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { registerSchema, loginSchema, updateSchema } = require('../validations/users.validation');

exports.register = async (req, res, next) => {
  try {
    await registerSchema.validateAsync(req.body, { abortEarly: false });
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashed });

    const token = jwt.sign(
      { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // check if blocked
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      return res
        .status(403)
        .json({ message: 'User temporarily blocked due to failed login attempts' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= 3) {
        user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        user.failedLoginAttempts = 0; // reset counter
      }

      await user.save();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // login success
    user.failedLoginAttempts = 0;
    user.blockedUntil = null;
    await user.save();

    const token = jwt.sign(
      { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await updateSchema.validateAsync(req.body, { abortEarly: false });
    const { id } = req.params;

    if (req.user._id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const update = { ...req.body };
    if (update.password) update.password = await bcrypt.hash(update.password, 10);

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.toggleBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    user.isBusiness = !user.isBusiness;
    await user.save();

    res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
