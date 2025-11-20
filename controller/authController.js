const { Users } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, 'jwt_key', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await Users.findOne({ where: { email } });
        if (userExists) {
            return res.status(401).json({ message: 'Email telah digunakan' });
        }

        const newUser = await Users.create({ username, email, password });

        return res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser.id),
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        const isMatch = await user.validPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password salah' });
        }

        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.json({
            id: user.id,
            username: user.username,
            email: user.email
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
