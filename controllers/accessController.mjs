import { db, bosses } from "../db.mjs";
import jwt from "jsonwebtoken";

class AccessController {
    constructor() { }

    async getUsers(req, res) {
        const { token } = req.cookies;
        if (token) {
            try {
                const decodedToken = await jwt.verify(token, 'secret');
                if (decodedToken.role === 'user') {
                    const { password, ...data } = await db.users.find(user => user.name = decodedToken.name);
                    return res.send(data)
                } if (decodedToken.role === 'admin') {
                    const { password, ...adminWithoutPassword } = db.admin;
                    const preparedUsers = db.users.map(user => {
                        const { password, ...userWithoutPassword } = user;

                        return userWithoutPassword;
                    })

                    const preparedBosses = db.bosses.map(boss => {
                        const { password, ...bossesWithoutPassword } = boss;

                        return bossesWithoutPassword;
                    })
                    const data = { admin: adminWithoutPassword, users: preparedUsers, bosses: preparedBosses }
                    return res.status(200).send(data)
                } if (decodedToken.role === 'boss') {
                    const { password, ...currentBoss } = db.bosses.find(boss => boss.name === decodedToken.name);
                    const subordinates = db.users.filter(user => user.boss === currentBoss.name).map(u => {
                        const { password, ...data } = u;
                        return data;
                    });
                    return res.status(200).send({
                        boss: currentBoss,
                        subordinates,
                    })
                }

            } catch (error) {
                res.status(400).send({ error: 'Something went wrong!' })
            }
        } else {
            res.status(400).send({ error: 'You have no permission to visit this page' });
        }
    }

    async editUser(req, res) {
        const { id } = req.params;
        const userFromDB = db.users.find(user => +user.id === +id);
        if (!userFromDB) return res.status(400).send({ error: 'User not found' });

        const { newBoss } = req.body;
        const { token } = req.cookies;

        if (token) {
            try {
                const decodedToken = await jwt.verify(token, 'secret');
                if (decodedToken.role !== 'boss') return res.send({ error: 'Permission denied!' });
                if (!bosses.includes(newBoss) || !newBoss) return res.status(400).send({ error: 'Please enter valid name' });
                if (userFromDB.boss !== decodedToken.name) return res.status(400).send({ error: 'You are not a boss of this user' });
                if (userFromDB.boss !== newBoss) return res.status(400).send({ error: 'You are already the boss' });

                const editedUsers = db.users.map(user => {
                    if (+user.id === +id) {
                        return {
                            ...user,
                            boss: newBoss,
                        };
                    } else {
                        return user; 
                    }
                });

                db.users = editedUsers;

                res.send({ message: `$User with id:${id} now has new boss - ${newBoss}` })
            } catch (error) {
                res.send(error)
            }
        }
    }
}

export const accessController = new AccessController();