const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all comments
router.get('/', (req, res) => {
  Comment.findAll({})
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

//GET comment by id
router.get('/:id', (req, res) => {
  Comment.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

//POST comment
router.post("/", withAuth, (req, res) => {
  if (req.session) {
    Comment.create({
      comment_content: req.body.comment_content,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    })
      .then((commentData) => res.json(commentData))
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//UPDATE comment
router.put('/:id', withAuth, (req, res) => {
  Comment.update(
    {
      comment_content: req.body.comment_content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((commentData) => {
      if (!commentData) {
        res.status(404).json({ message: 'No comment with this id' });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//DELETE comment
router.delete("/:id", withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => {
      if (!commentData) {
        res.status(404).json({ message: 'No comment with this id' });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;