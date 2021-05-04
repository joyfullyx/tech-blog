const router = require('express').Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// GET all posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'content', 'created_at'],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
    .then((postData) => res.json(postData.reverse()))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// GET a single post
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: 'No post with this id' });
        return;
      }
      res.json(postData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// CREATE post
router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((postData) => res.json(postData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// UPDATE post title
router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: 'No post with this id' });
        return;
      }
      res.json(postData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE post
router.delete('/:id', withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    include: [Comment]
  })
  .then(post => {
    post.comments.forEach(comment => {
      comment.destroy();
    })
    post.destroy();
    res.end();
  })
});

module.exports = router;