const { Router } = require("express")
const UsersController = require("../controllers/UsersController");
const UsersAvatarController = require("../controllers/UsersAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const multer = require("multer")
const uploadConfig = require("../configs/upload");

const usersRoutes = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig.MULTER)


usersRoutes.post("/", usersController.create)

// O id do usuário já está sendo encorporado dentro das requisições
usersRoutes.put("/", ensureAuthenticated, usersController.update)
// Atulizar um campo específico
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update)


module.exports = usersRoutes;