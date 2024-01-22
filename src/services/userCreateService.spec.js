const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require("../utils/AppError")

// Agrupar os testes.
describe("UserCreateService", () => {
    // Inicializa as variáveis para o repositório de teste e o serviço da regra de negócio.
    let userRepositoryInMemory = null;
    let userCreateService = null;


    // É executado antes de cada teste.
    beforeEach(() => {
        // Repositório que simula o ambiente de produção na memória.
        userRepositoryInMemory = new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepositoryInMemory);
    })
    //  Teste de criação do usuário.
    it("user shold be create", async () => {
        const user = {
            name: 'User Test',
            email: 'user@test.com',
            password: '123'
        };
    
        // Criar o usuário na memória.
        const userCreated = await userCreateService.execute(user);
    
        // Espera que o usuário criado tenha uma chave de id.
        expect(userCreated).toHaveProperty("id");
    });

    it("user not should be create with exists email", async () => {
        const user1 = {
            name: 'User test 1',
            email: 'test@email.com',
            password: '1234'
        }

        const user2 = {
            name: 'User test 2',
            email: 'test@email.com',
            password: '1234'
        }
        // Cria o usuário de acordo com a regra de negócio.
        await userCreateService.execute(user1);

        // Espera que ao criar o usuários com emails iguais seja lançado uma exceção.
        expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está em uso."));
    })
})
