const router = require('express').Router();
const commentRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

router.use('/thoughts', commentRoutes);
router.use('/users', userRoutes);

module.exports = router;
