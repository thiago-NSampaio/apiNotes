const { Router } = require("express")
const UsersController = require("../controllers/UsersController")

const usersRoutes = Router();
const usersController = new UsersController();

function userMiddleware(req, res, next) {
    console.log("passou pelo middleware")

    next()
}

usersRoutes.post("/", userMiddleware, usersController.create)
usersRoutes.put("/:id",userMiddleware, usersController.update)


module.exports = usersRoutes;