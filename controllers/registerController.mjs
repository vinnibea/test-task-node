import { db, bosses } from "../db.mjs";
import bcrypt from 'bcrypt';
class RegisterController {
    constructor() { }

    async register(req, res) {
        const { password, username } = req.body;
        if (username === 'admin') return res.send({ error: 'There can be only one admin and he is already existing' })
        if (bosses.includes(username)) return res.send({ error: 'Name is reserved for admin or boss' });

        const userFromDB = await db.users.find(user => user.name === username);
        if (userFromDB) return res.status(400).send({ error: 'User already exists' });

        const boss = bosses[Math.floor(Math.random() * 4)];
        const id = db.users.length + 1;
        const hashedPassword = await bcrypt.hash(password, 10)
        db.users.push({ id, name: username, role: 'user', boss: null, password: hashedPassword, boss });
        res.send({ message: 'User created, now you can log in' })
    }
}

export const registerController = new RegisterController();