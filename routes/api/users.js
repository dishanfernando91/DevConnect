const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')

//Checks if any of the entries are invalid using check + different methods. validationResult is passed in to the route handler to //make sure any errors are caught...
const { check, validationResult } = require('express-validator')

//@route   POST api/users
//@desc    Register 
//@access  Public
router.post('/', [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            
            if(user){
                return res.status(400).json({ errors: [{ message: 'User already exists '}]})
            }

            // size, rating and default (for profile pic)
            const avatar = gravatar.url(email, {
                s:'200',
                r: 'pg',
                d: 'mm'
            })
            
            user = new User({
                name, 
                email,
                avatar,
                password
            })

            //Encrypt password and save user
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)
            await user.save();

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