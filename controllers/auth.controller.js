const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');


const JWT_SECRET = process.env.JWT_SECRET || 'secret_weak_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


async function register(req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { username, password, full_name } = req.body;
const existing = await userModel.findByUsername(username);
if (existing) return res.status(400).json({ message: 'El nombre de usuario ya existe' });


const password_hash = await bcrypt.hash(password, 10);
const user = await userModel.createUser({ username, password_hash, full_name });
res.status(201).json(user);
}


async function login(req, res) {
const { username, password } = req.body;
const user = await userModel.findByUsername(username);
if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });


const match = await bcrypt.compare(password, user.password_hash);
if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });


const payload = { id: user.id, username: user.username };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } });
}


module.exports = { register, login };