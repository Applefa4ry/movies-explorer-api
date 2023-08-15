const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser, editUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), editUserInfo);

module.exports = router;
