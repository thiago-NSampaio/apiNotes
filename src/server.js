require("express-async-errors")
require("dotenv/config")
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")
const migrationsRun = require("./database/sqlite/migrations")
const uploadConfig = require("./configs/upload")
const cors = require("cors")
migrationsRun();

const app = express();

app.use(cors())

app.use(express.json());

// Rota para devolver o avatar para o usuário
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }
    
    console.error(error);

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
}) 

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})