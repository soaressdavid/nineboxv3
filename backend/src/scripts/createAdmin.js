const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');

async function createAdmin() {
    try {
        // Verifica se já existe um admin
        const adminExists = await prisma.user.findFirst({
            where: { email: 'admin@ninebox.com' }
        });

        if (adminExists) {
            console.log('❌ Admin já existe!');
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Cria o usuário admin
        const admin = await prisma.user.create({
            data: {
                email: 'admin@ninebox.com',
                password: hashedPassword,
                role: 'admin'
            }
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('📧 Email: admin@ninebox.com');
        console.log('🔑 Senha: admin123');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
