const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password, firstName, lastName } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        if (isUserAlreadyExists.email === email) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        if (isUserAlreadyExists.username === username) {
            return res.status(400).json({ message: "Username already taken" });
        }
        return res.status(400).json({ message: "Account already exists." });
    }

    try {
        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            firstName: firstName || "",
            lastName: lastName || ""
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            const errMessage = error.message.toLowerCase();
            if (errMessage.includes('email')) {
                return res.status(400).json({ message: "Email is already registered" });
            }
            if (errMessage.includes('username')) {
                return res.status(400).json({ message: "Username already taken" });
            }
            return res.status(400).json({ message: "Account already exists" });
        }
        res.status(500).json({ message: error.message || "Registration failed." });
    }
}

/**
 * @name loginUserController
 * @description login a user, expects username, email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email "
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password) //ek password req.body se aayega aur ek jo database mei rhega, dono ko compare krenge

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.status(200).json({
        message: "User logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
    })


}

/**
 * @name logoutUserController
 * @description logout a user, slear token from user cookie and add the token in blacklist, and blacklist the token stored in cookies in request
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
    })
}

/**
 * @name updateProfileController
 * @description update user profile details like firstName, lastName, username
 * @access private
 */
async function updateProfileController(req, res) {
    const { firstName, lastName, username } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already taken." });
        }
        res.status(500).json({ message: "Failed to update profile." });
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController, updateProfileController }