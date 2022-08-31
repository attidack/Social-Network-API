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

  // get one user by id
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
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create User
  createUser({ body }, res) {
    User.create(body)
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => res.json(err));
  },

  // update user by id
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

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => res.json(err));
  },

// add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { runValidators: true, new: true }
            ).then(dbSocialData => {
                if(!dbSocialData) {
                    res.status(404).json({ message: "No user found with that id. "});
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
            ).then(dbSocialData => {
                if(!dbSocialData) {
                    res.status(404).json({ message: "No user found with that id. "});
                    return;
                }
                res.json(dbSocialData);
            })
            .catch(err => res.status(400).json(err)); 
    }
};
module.exports = userController;
