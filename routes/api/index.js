const router = require('express').Router();
const commentRoutes = require('./comment-routes');
const userRoutes = require('./user-routes');

router.use('/comments', commentRoutes);
router.use('/users', userRoutes);

module.exports = router;
