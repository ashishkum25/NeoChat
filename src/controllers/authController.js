const userModel = require('../models/userModel.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRegisterController = async (req, res) => {
    res.render('register.ejs')
};

const postRegisterController = async (req, res) => {
    const { username, email, password } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [  // Check if username or email already exists 
            { username: username },
            { email: email }
        ]
    });
    if (isUserExists) {
        return res.status(400).json({
            message: "User already exists with this username or email"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        username: username,
        email: email,
        password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    return res.status(201).json({
        message: "User registered successfully",
        user: user
    });
};

const getLoginController = async (req, res) => {
    res.render('login.ejs');
};

const postLoginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.redirect('/login?error=User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.redirect('/login?error=Invalid password');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    return res.status(200).json({
        message: "User logged in successfully",
        user: user
    });
};


module.exports = {
    getRegisterController,
    postRegisterController,
    getLoginController,
    postLoginController
};