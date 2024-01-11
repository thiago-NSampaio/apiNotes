const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")
const {sign} = require("jsonwebtoken")
const authConfig = require("../configs/auth")

class SessionsController{
    async create(req, res) {
        const { email, password } = req.body;

        const user = await knex("users").where({ email }).first()
        
        if (!user) {
            throw new AppError("Email ou senha incorretos",401)
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError("Email ou senha incorretos",401)
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })
        
        return res.json({user, token})
    }
}

module.exports = SessionsController;