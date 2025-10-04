const express = require('express');
const router = express.Router();
const cardsCtrl = require('../controllers/cards.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

// Public
router.get('/', cardsCtrl.getAll);                     // GET /cards
router.get('/my-cards', auth, cardsCtrl.getMyCards);   // GET /cards/my-cards
router.get('/:id', cardsCtrl.getOne);                  // GET /cards/:id

// Protected
router.post('/', auth, cardsCtrl.create);              // POST /cards → business only
router.put('/:id', auth, cardsCtrl.update);            // PUT /cards/:id → owner or admin
router.patch('/:id/like', auth, cardsCtrl.toggleLike); // PATCH /cards/:id/like
router.delete('/:id', auth, cardsCtrl.remove);         // DELETE /cards/:id → owner or admin

// BONUS: Admin can update bizNumber if unique
router.patch('/:id/bizNumber', auth, admin, cardsCtrl.updateBizNumber);

module.exports = router;
