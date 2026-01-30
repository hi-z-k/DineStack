const jwt = require('jsonwebtoken');

const protect = (req, res, callback) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: "No token, authorization denied" }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        callback();

    } catch (error) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: "Token is not valid" }));
    }
};

module.exports = protect;
