const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

// Public
router.post('/', usersCtrl.register);         // POST /users → register
router.post('/login', usersCtrl.login);       // POST /users/login → login

// Protected
router.get('/', auth, admin, usersCtrl.getAll);       // GET /users → admin only
router.get('/:id', auth, usersCtrl.getById);          // GET /users/:id → self or admin
router.put('/:id', auth, usersCtrl.update);           // PUT /users/:id → self
router.patch('/:id/business', auth, usersCtrl.toggleBusiness); // PATCH /users/:id/business → toggle isBusiness
router.delete('/:id', auth, usersCtrl.remove);        // DELETE /users/:id → self or admin

module.exports = router;
