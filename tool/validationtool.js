var jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const validateToken = (req, res) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token.replace('Bearer ', ''), config.secret, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: "Invalid Token!" })
        }
        req.loggedUserId = decoded.id
    })
}

exports.validateToken = validateToken