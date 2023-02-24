import bcrypt from 'bcrypt';

export const bosses = ['Bob', 'Marley', 'Kurt', 'Cobain'];
const dbConfigure = async (bosses) => {
    let bossesWithDetails = [];
    const hashedAdminPassword = await bcrypt.hash('12345', 10);
    const hashedBossPassword = await bcrypt.hash('12345', 10);
    const admin = {
        name: 'admin',
        password: hashedAdminPassword,
        role: 'admin',
    };
    bosses.forEach((boss) => {
        const newBossDetails = {
            name: boss,
            role: 'boss',
            password: hashedBossPassword,
        }
        bossesWithDetails = [...bossesWithDetails, newBossDetails]
    })

    const db = {
        admin,
        users: [],
        bosses: bossesWithDetails,
    };

    return db;
}

export const db = await dbConfigure(bosses);