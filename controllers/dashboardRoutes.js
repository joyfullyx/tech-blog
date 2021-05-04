const router = require('express').Router();
const { Post } = require('../models');
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
      res.status(500).json(err);
    }
  });