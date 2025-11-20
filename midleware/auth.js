const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        if (!token) {
            throw new Error('');
        }

        const decoded = jwt.verify(token, '');
        const user = await Users.findOne({ where: { id: decoded.id } });

        if (!user) {
            throw new Error('');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Belum terautentikasi' });
    }
};

module.exports = auth;