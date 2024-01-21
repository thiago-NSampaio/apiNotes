const {hash} = require("bcryptjs")
const AppError = require("../utils/AppError")
class UserCreateService{
    /**
     * Construtor da classe UserCreateService.
     * @param {UserRepository} userRepository - O repositório de usuário a ser utilizado pelo serviço.
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }


    async execute({ name, email, password }) {

        const checkUserExists = await this.userRepository.findByEmail(email)

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso.")
        }

        // Criptografia a senha inserida pelo usuário.
        const hashedpassword = await hash(password, 8);

        // Cria o usuário.
        await this.userRepository.create({name, email, password: hashedpassword});
    }

}

module.exports = UserCreateService;