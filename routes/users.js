const router = require('express').Router();

const {
  getUsers,
  updateUserInfo,
} = require('../controllers/users');
const {
  validationUpdateUserInfo,
} = require('../validation/validation');

router.get('/users/me', getUsers);
router.patch('/users/me', validationUpdateUserInfo, updateUserInfo);

module.exports = router;
