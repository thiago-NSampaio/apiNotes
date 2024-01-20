module.exports = {
    jwt: {
        // Caso não encontre valor na env adiciona outro valor
        secret: process.env.AUTH_SECRET || "default",
        expiresIn: "1d",
    }
}