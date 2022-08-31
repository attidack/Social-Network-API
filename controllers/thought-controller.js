const { Thought, User } = require('../models');

const thoughtController = {
  // get all Thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbSocialData => res.json(dbSocialData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create Thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(dbSocialData => {
        console.log(dbSocialData)
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $addToSet: { thoughts: dbSocialData._id } },
          { new: true })
      })
      .then(userData => {
        console.log(userData)
        res.json(userData)
      })

      .catch(err => res.json(err));
  },

  // update Thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbSocialData => {
        if (!dbSocialData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbSocialData);
      })
      .catch(err => res.json(err));
  },

  // delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbSocialData => {
        console.log(dbSocialData)
        return User.findOneAndUpdate(
          { thoughts: dbSocialData._id },
          { $pull: { thoughts: dbSocialData._id } },
          { new: true })
      })
      .then(userData => {
        console.log(userData)
        res.json(userData)
      })
      .catch(err => res.json(err));
  },

  // add reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true })
      .then(dbSocialData => {
        if (!dbSocialData) {
          res.status(404).json({ message: "No reaction found with that id. " });
          return;
        }
        res.json(dbSocialData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    ).then(dbSocialData => {
      if (!dbSocialData) {
        res.status(404).json({ message: "No reaction found with that id. " });
        return;
      }
      res.json(dbSocialData);
    })
      .catch(err => res.status(400).json(err));
  }
};
module.exports = thoughtController;
