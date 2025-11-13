const express = require('express');
const router = express.Router({ mergeParams: true });
const Card = require('../models/Card');
const List = require('../models/List');
const auth = require('../middleware/auth');

// Get all cards in a list
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Card.find({ listId: req.params.listId }).sort('position');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create card
router.post('/', auth, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.listId, boardId: req.params.boardId });
    if (!list) return res.status(404).json({ error: 'List not found' });

    const card = new Card({ ...req.body, listId: req.params.listId });
    await card.save();
    res.json(card);
    list.cards.push(card._id)
    await list.save()
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:cardId', auth, async (req, res) => {
  console.log("Params received:", req.params);
  console.log("Body received:", req.body);

  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId, req.body, { new: true });
    if (!card) return res.status(404).json({ error: 'Card not found' });

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;