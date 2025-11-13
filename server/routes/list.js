const express = require('express');
const router = express.Router({ mergeParams: true });
const List = require('../models/List');
const Board = require('../models/Board');
const auth = require('../middleware/auth');

// Get all lists in a board
router.get('/', auth, async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.params.boardId }).sort('position');
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create list
router.post('/', auth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId, userId: req.user.userId });
    if (!board) return res.status(404).json({ error: 'Board not found' });

    const list = new List({ ...req.body, boardId: req.params.boardId });
    await list.save();
    board.lists.push(list._id);
    await board.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;