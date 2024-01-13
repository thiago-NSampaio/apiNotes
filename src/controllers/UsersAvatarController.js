const DiskStorage  = require("../providers/DiskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersAvatarController {
    async update(req, res) {
        const user_id = req.user.id;
        const avatarFileName = req.file.filename;

        const diskStorage = new DiskStorage()

        const user = await knex("users").where({ id: user_id }).first()
        
        if (!user) {
            throw new AppError("Somente usuários autorizado podem fazer uploads.")
        }

        // Verifica se o usuário já tem um avatar, se tiver, é feita a exclusão do arquivo
        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        // Salvar o arquivo na pasta tmp.
        const filename = await diskStorage.saveFile(avatarFileName)
        user.avatar = filename;

        // Salvar a referência no banco de dados.
        await knex("users").update(user).where({ id: user_id });
        
        res.json({user});
    }
}

module.exports = UsersAvatarController;