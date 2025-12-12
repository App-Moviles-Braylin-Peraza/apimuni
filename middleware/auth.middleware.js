const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');


const JWT_SECRET = process.env.JWT_SECRET || 'secret_weak_dev';


async function authMiddleware(req, res, next) {
const auth = req.headers['authorization'];
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No autorizado' });
const token = auth.split(' ')[1];
try {
const payload = jwt.verify(token, JWT_SECRET);
const user = await userModel.findById(payload.id);
if (!user) return res.status(401).json({ message: 'Usuario no válido' });
req.user = { id: user.id, username: user.username };
next();
} catch (err) {
return res.status(401).json({ message: 'Token inválido' });
}
}


module.exports = authMiddleware;