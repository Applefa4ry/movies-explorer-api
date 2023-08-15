const router = require('express').Router();
const { validateEditUserInfo } = require('../middlewares/validations');
const {
  getCurrentUser, editUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validateEditUserInfo, editUserInfo);

module.exports = router;
