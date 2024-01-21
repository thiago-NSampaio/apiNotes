const {hash, compare} = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

const UserRepository = require("../repositories/UserRepository")

class UsersController {
    async create(req, res) {
        const userRepository = new UserRepository();
        // Extrai as informações do corpo da solicitação
        const { name, email, password } = req.body;

        const checkUserExists = await userRepository.findByEmail(email)

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso.")
        }

        // Criptografia a senha inserida pelo usuário.
        const hashedpassword = await hash(password, 8);

        // Cria o usuário.
        await userRepository.create({name, email, password: hashedpassword});

        return res.status(201).json();
    }

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const user_id = req.user.id;
        
        const db = await sqliteConnection();
        const user = await db.get("SELECT * FROM users WHERE id = (?)", [user_id])
        
        if (!user) {
            throw new AppError("Usuário não encontrado.")
        }
        const checkEmailUpdate = await db.get("SELECT * FROM users WHERE email = (?)", [email])
        
        if (checkEmailUpdate && checkEmailUpdate.id !== user.id) {
            throw new AppError("Este email já existe")
        }
        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password,user.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            }

            user.password = await hash(password, 8)
        }
        
        await db.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        );

        return res.json()
    }
}

module.exports = UsersController;
