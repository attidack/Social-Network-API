const { User } = require('../models');

const userController = {
  // get all Users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one pizza by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
        path: 'friends',
        select: '-__v'
      })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createPizza
  createUser({ body }, res) {
    User.create(body)
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => res.json(err));
  },

  // update pizza by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbSocialData => {
        if (!dbSocialData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbSocialData);
      })
      .catch(err => res.json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => res.json(err));
  }
};

module.exports = userController;
