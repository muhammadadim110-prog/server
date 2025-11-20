const {user} = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, 'jwt_key', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body; 
        const userExists = await user.findOne({ where: { email } });

        if (userExists) {
            return res.status(401).json({ message: 'Email telah digunakan' });
        }

        const user = await user.create({ username, email, password });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email belum terdaftar' });
        }

        const isMatch = await user.validPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password anda salah' });
        }

         res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await user.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email'],
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};