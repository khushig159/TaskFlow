const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const auth = require('../middleware/auth');

// Get all boards
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.userId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id',auth,async(req,res)=>{
    try{
        const board=await Board.findOne({_id:req.params.id,userId:req.user.userId})
        if(!board) return res.status(404).json({error:'Board not found'})
        res.json(board)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// Create board
router.post('/', auth, async (req, res) => {
  try {
    const board = new Board({ ...req.body, userId: req.user.userId });
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update board
router.put('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete board
router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;