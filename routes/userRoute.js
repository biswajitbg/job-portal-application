const express = require("express")
const router = express.Router();

const { userRegister, userLogin, getUser, updateUser } = require("../controllers/userController")
const { authentication, authorization } = require('../middleware/authMiddleware')


router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/:userId", authentication, authorization, getUser)
router.put("/updateuser/:userId", authentication, authorization, updateUser)







module.exports = router;

