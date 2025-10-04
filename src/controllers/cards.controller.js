const Card = require('../models/card.model');
const { createCardSchema, updateCardSchema } = require('../validations/cards.validation');

// GET /cards - all cards (public)
exports.getAll = async (req, res, next) => {
  try {
    const cards = await Card.find().populate('user_id', 'name email');
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

// GET /cards/my-cards - cards of the logged-in user
exports.getMyCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

// GET /cards/:id - single card
exports.getOne = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id).populate('user_id', 'name email');
    if (!card) return res.status(404).json({ message: 'Not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// POST /cards - create card (Business only)
exports.create = async (req, res, next) => {
  try {
    await createCardSchema.validateAsync(req.body, { abortEarly: false });

    if (!req.user.isBusiness) {
      return res.status(403).json({ message: 'Only business users can create cards' });
    }

    // Generate a unique bizNumber
    let bizNumber;
    let exists = true;
    while (exists) {
      bizNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
      exists = await Card.findOne({ bizNumber });
    }

    const card = await Card.create({
      ...req.body,
      user_id: req.user._id,
      bizNumber
    });

    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

// PUT /cards/:id - update card (owner or admin)
exports.update = async (req, res, next) => {
  try {
    await updateCardSchema.validateAsync(req.body, { abortEarly: false });

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Not found' });

    if (String(card.user_id) !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(card, req.body);
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// PATCH /cards/:id/like - like/unlike card
exports.toggleLike = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Not found' });

    const userId = req.user._id;
    const idx = card.likes.findIndex(id => String(id) === userId);

    if (idx === -1) {
      card.likes.push(userId); // like
    } else {
      card.likes.splice(idx, 1); // unlike
    }

    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// DELETE /cards/:id - delete card (owner or admin)
exports.remove = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Not found' });

    if (String(card.user_id) !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await card.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

// PATCH /cards/:id/bizNumber - admin only
exports.updateBizNumber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;

    if (!bizNumber) {
      return res.status(400).json({ message: 'bizNumber is required' });
    }

    const exists = await Card.findOne({ bizNumber });
    if (exists) {
      return res.status(400).json({ message: 'bizNumber already in use' });
    }

    const card = await Card.findByIdAndUpdate(
      id,
      { bizNumber },
      { new: true }
    );

    if (!card) return res.status(404).json({ message: 'Not found' });

    res.json(card);
  } catch (err) {
    next(err);
  }
};
