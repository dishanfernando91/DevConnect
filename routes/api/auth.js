const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

//Just adding this middleware into routes as a parameter creates a protected route
const auth = require('../../middleware/auth')

//@route   GET api/auth
//@desc    Test route
//@access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error') 
    }   
})

//@route   POST api/auth
//@desc    Authenticate user & get token 
//@access  Public
router.post('/', [
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Password is required.').exists()
], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            
            if(!user){
                return res.status(400).json({ errors: [{ message: 'Invalid Credentials.'}]})
            }

            const isMatched = await bcrypt.compare(password, user.password)

            if(!isMatched){
                return res.status(400).json({ errors: [{ message: 'Invalid Credentials.'}]})
            }
            
            const payload = {
                user: {
                    //user.id === user._id ||| mongoose uses abstraction to hide the underscore
                    id: user.id
                }
            }

            jwt.sign(
                payload, 
                config.get('jwtSecret'), 
                { expiresIn: 360000 }, 
                (err, token) => {
                    if(err) throw err;
                    res.json({ token })
            })

        } catch(err) {
            console.error(err.message);
            res.status(500).send("Server error")
        }

})

module.exports = router;
