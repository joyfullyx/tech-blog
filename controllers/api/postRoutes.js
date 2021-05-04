const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// post route to make new post
router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

// delete route to delete post by id
router.delete('/:id', withAuth, async (req, res) => {
  if (!req.session.logged_in) {
    return res.status(401).json({ message: 'You are not logged in. Please log in and try again' })
  }
    try {
      const postData = await Post.findByPk(req.params.id);
      if(!postData) {
        return res.status(404).json({ message: 'No post found with this id!'})
      } 
      const postExists = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      res.status(200).json(postExists);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
  