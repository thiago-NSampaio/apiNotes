const sqliteConnection = require("../database/sqlite");

class UserRepository {
  // Método para verificar se o email informado existe na tabela de usuários.
  async findByEmail(email) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE email = (?)", [
      email,
    ]);

    return user;
  }

  // Método para inserir um novo usuário.
  async create({ name, email, password }) {
    const database = await sqliteConnection();
    const userId = await database.run(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, password]
      );
      
      return { id: userId };
  }
}

module.exports = UserRepository;
