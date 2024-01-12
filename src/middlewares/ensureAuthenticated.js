const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated(req, res, next) {
    // Captura o token do usuário
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("JWT Token não informado", 401);
    }

    // Obtém apenas o token já formatado
    const [, token] = authHeader.split(" ");

    try {
        // Adiciona um alias ao sub e verifica se o token é válido
        const { sub: user_id } = verify(token, authConfig.jwt.secret)
        
        // Cria a propriedade de user junto com o id na request
        req.user = {
            id: Number(user_id),
        };

        // Passa para a próxima função
        return next();
    
    } catch {
        throw new AppError("JWT Token inválido", 401)
    }
}

module.exports = ensureAuthenticated;