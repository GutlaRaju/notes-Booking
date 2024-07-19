const express = require('express');
const router = express.Router();
const Note = require('../operation/Note');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.userId;
        next();
    });
};

router.post('/notes', authenticate, async(req, res) => {
    try{
        const { title, content, tags, backgroundColor, reminderDate } = req.body;
        const note = new Note({
            userId : req.userId,
            title,
            content, 
            tags,
            backgroundColor,
            reminderDate,
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get("/notes", authenticate, async(req, res) => {
    try{
        const notes = await Note.find({ userId: req.userId, trashed: false }).sort({ updatedAt: -1 });
        res.json(notes)
    } catch (error){
        res.status(500).json({error: error})
    }
})

router.put('/notes/:id', authenticate, async (req, res) => {
    try {
        const { title, content, tags, backgroundColor, reminderDate } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, content, tags, backgroundColor, reminderDate, updatedAt: Date.now() },
            { new: true }
        );
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/notes/:id', authenticate, async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { trashed: true, updatedAt: Date.now() }
        );
        res.json({ message: 'Note trashed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;