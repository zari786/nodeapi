const userModel = require("..//models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("..//models/user");
const SECRET_KEY = process.env.SECRET_KEY;


const signup = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            email: email,
            password: hashPassword,
            username: username
        });

        const token = jwt.sign({ email: email, id: result._id }, SECRET_KEY);
        res.status(201).json({ user: result, token: token });

    } catch (error) {

        res.status(500).json({ message: "internal server error" })
    }

}

const signin = async (req, res) => {

    const { email, password } = req.body;

    try {
        const userExist = await userModel.findOne({ email: email });
        if (!userExist) {
            return res.status(404).json({ message: "user not found" });
        }

        const matchPassword = await bcrypt.compare(password, userExist.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ email: userExist.email, id: userExist._id }, SECRET_KEY);
        res.status(200).json({ user: userExist, token: token });


    } catch (error) {
        console.log(`${error}`)
        res.status(500).json({ message: "internal server error" })
    }
}

module.exports = { signup, signin }