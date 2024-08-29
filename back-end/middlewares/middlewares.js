const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET=process.env.JWT_SECRET;
function authMiddleWare(req, res, next) {
    const authHeader = req.header('authorization');
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: "Error" });
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(403).json({
            msg: "Back to the user"
        })
    }
}
module.exports = { authMiddleWare }