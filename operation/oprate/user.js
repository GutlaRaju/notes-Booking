const express = require('express');
const router = express.Router();
const User = require('../operation/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, password: hashedPassword });
        await username.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error){
        res.status(400).json({error: error.message})
    }
});
router.post('/login', async(req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({username})
        const token = jwt.sign({ userId: user._id}, {expiresIn: '1h'})
        res.json({ token });
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});
module.exports = router;