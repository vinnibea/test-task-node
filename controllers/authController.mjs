import { db } from "../db.mjs";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


class AuthenticationController {
    constructor() { }

    async authenticate(req, res) {
        const { password, username } = req.body;

        if (username === 'admin') {
            const { password: adminPassword, ...data } = db.admin;
            const decodedPassword = await bcrypt.compare(req.body.password, adminPassword);
            if (!decodedPassword) return res.status(400).send({ error: 'Wrong password or you are not admin!' })

            const token = await jwt.sign(data, 'secret');
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
            return res.redirect('/users')
        }

        const bossAuth = db.bosses.find(boss => boss.name === username);

        if (bossAuth) {
            const decodedPassword = await bcrypt.compare(password, bossAuth.password);
            if (!decodedPassword) return res.status(400).send({ error: 'Incorrect password or/and username' });

            const { password: bossPassword, ...bossWithoutPassword } = bossAuth;
            const token = await jwt.sign(bossWithoutPassword, 'secret');

            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
            return res.redirect('/users')
        }

        const userFromDB = await db.users.find(user => user.name === username);

        if (!userFromDB) return res.status(404).send({ error: 'User not found or password is incorrect' });

        const decodedPassword = await bcrypt.compare(password, userFromDB.password);
        if (!decodedPassword) return res.status(400).send({ error: 'Incorrect password or/and username' });

        const { password: userPassword, ...userWithoutPassword } = userFromDB;
        const token = await jwt.sign(userWithoutPassword, 'secret');

        res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
        res.redirect('/users')
    }
}

export const authenticationController = new AuthenticationController();