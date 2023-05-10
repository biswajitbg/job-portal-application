const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")


//---------------------------- CREATE USER------------------------------------------------

                     


const userRegister = async (req, res, next) => {
    try {
        let data = req.body;
        const { fname, lname, phone, email, password } = data;

        if (!(fname && lname && phone && email && password)) {
            next("all feilds are mandatory")
        };

        data.password = bcrypt.hashSync(data.password) // for encrypted password

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send("user already exist in this email")
        }

        const createData = await User.create(data);
        return res.status(201).send({ status: true, message: "created sccessfully", createData });


    } catch (error) {
        next(error);
    }

};
//---------------------------USER LOGIN----------------------------------------------
const userLogin = async (req, res) => {

    try {
        let data = req.body;

        const { email, password } = data;
        if (!(email && password)) {
            res.status(400).send("please enter email and  password")

        }
        //Checking Credential

        const user = await User.findOne({ email })
        if (user) {
            const validPassword = bcrypt.compareSync(password, user.password) //compare password

            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }


        //token generation

        const token = JWT.sign({
            userId: user._id,

        }, process.env.JWT_SECRET);


        res.status(200).send({ status: true, msg: "you are logged in successfully", data: { user, token } })



    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }


};
//-------------------------------GET USER BY USERID-----------------------------------------------

const getUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        let userData = await User.findById(userId);
        return res.status(200).send({ status: true, message: "find user details", data: userData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
};


//----------------------------UPDATE USER------------------------------------------------

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        res.status(200).send({ status: true, message: "updated successfully", updatedUser })

    } catch (error) {
        next(error);

    }




};

module.exports = { userRegister, userLogin, getUser, updateUser }

