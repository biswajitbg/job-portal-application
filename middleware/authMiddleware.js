const JWT = require("jsonwebtoken")
const User = require("../models/userModel")

//-------------------------AUTHENTICATION------------------------------------------------

const authentication = async (req, res, next) => {
    try {
        let token = req.header("Authorization")
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" })

        }
        let splitToken = token.split(" ")[1];

        //token verify

        JWT.verify(splitToken, process.env.JWT_SECRET, (error, decodedtoken) => {
            if (error) {
                const message =
                    error.message === "JWT expired" ? "Token is expired, Please login again" : "Token is invalid, Please recheck your Token"
                return res.status(401).send({ status: false, message });
            }
            req.token = decodedtoken.userId;
            next();
        });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//---------------------------------AUTHORIZATION-------------------------------------

let authorization = async (req, res, next) => {
    try {
        let userId = req.params.userId;


        //validation for given userId
        if (!(userId)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId" });
        }

        // Checking if user exist or not 
        let user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(404).send({ status: false, message: "user does not exist with this userId" });
        }

        // Authorisation checking 
        if (req.token != user._id) {
            return res.status(403).send({ status: false, message: "Unauthorised access" });
        }
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
};

module.exports = { authentication, authorization }