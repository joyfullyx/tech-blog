const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      // Get all posts and JOIN with data
      const postData = await Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [
          {
            model: User,
            attributes: ['name'],
          },
          {
            model: Comment,
            attributes: ['id', 'content', 'user_id', 'post_id'],
            include: {
              model: User,
              attributes: ['name']
            }
          }
        ],
      });
  
      // Serialize data so the template can read it
      const post = postData.map((post) => post.get({ plain: true }));
  
      // Pass serialized data and session flag into template
      res.render('allPosts', { 
        ...post, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.redirect('login');
    }
  });

  router.get('/new', withAuth, (req, res) => {
    res.render('newPost', {
      layout: 'dashboard'
    })
  })

  router.get('/edit/:id', withAuth, async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id);

      const post = postData.map((post) => post.get({ plain: true }));
      res.render('postEdit', {
        layout: 'dashboard',
        post
      })
    } catch (err) {
      res.status(500).json(err)
    }
  })

  module.exports = router;