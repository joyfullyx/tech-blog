const sequelize = require('../config/connection');
const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'content', 'created_at'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((postData) => {
      //serialize posts array to readable format
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// render signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

//render single post
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: 'No post with this id' });
        return;
      }

      // serialize data
      const post = postData.get({ plain: true });
      res.render('singlePost', { post, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


router.get('/posts/comments', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: 'No post with this id' });
        return;
      }

      // serialize data
      const post = postData.get({ plain: true });
      res.render('postcomments', { post, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;