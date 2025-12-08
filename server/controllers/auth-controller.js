const auth = require('../auth')
const DatabaseManager = require('../db/index')
const bcrypt = require('bcryptjs')

const GUEST_USER = {
    _id: "guest_user_id",
    username: "Guest",
    email: "h7g2f9d4s1@guest.playlister.com",
    passwordHash: "",
    avatarPng: "https://robohash.org/Guest.png"
}

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        if (userId === GUEST_USER._id) {
            return res.status(200).json({
                loggedIn: true,
                user: {
                    username: GUEST_USER.username,
                    email: GUEST_USER.email,
                    avatarPng: GUEST_USER.avatarPng
                }
            })
        }

        const loggedInUser = await DatabaseManager.findOneUser({ _id: userId });

        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email,
                avatarPng: loggedInUser.avatarPng
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const emailLower = email.toLowerCase();

        const existingUser = await DatabaseManager.findOneUser({ email: emailLower });

        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                username: existingUser.username,
                email: existingUser.email,
                avatarPng: existingUser.avatarPng
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginGuest = async (req, res) => {
    console.log("loginGuest");
    try {
        const token = auth.signToken(GUEST_USER._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                username: GUEST_USER.username,
                email: GUEST_USER.email,
                avatarPng: GUEST_USER.avatarPng
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

updateUser = async (req, res) => {
    try {
        const { email, username, password, passwordVerify, avatarPng } = req.body;
        console.log("update user: " + username);

        if (!email) {
            return res.status(400).json({ errorMessage: "Email is required to identify user." });
        }

        let passwordHash = undefined;
        if (password && passwordVerify) {
            if (password.length < 8) {
                return res.status(400).json({ errorMessage: "Please enter a password of at least 8 characters." });
            }
            if (password !== passwordVerify) {
                return res.status(400).json({ errorMessage: "Please enter the same password twice." });
            }
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const updatedUser = await DatabaseManager.updateUser(email, username, passwordHash, avatarPng);

        if (!updatedUser) {
            return res.status(400).json({ success: false, errorMessage: "User not found." });
        }

        const token = auth.signToken(updatedUser._id);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                avatarPng: updatedUser.avatarPng
            }
        })

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    try {
        const { username, avatarPng, email, password, passwordVerify } = req.body;
        console.log("create user: " + username + " " + avatarPng + " " + email + " " + password + " " + passwordVerify);
        if (!username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        const emailLower = email.toLowerCase();
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");

        const existingUser = await DatabaseManager.findOneUser({ email: emailLower });

        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const savedUser = await DatabaseManager.createUser(username, emailLower, passwordHash, avatarPng);

        console.log("new user saved: " + savedUser._id);

        return res.status(200).json({
            success: true,
            user: {
                username: savedUser.username,
                email: savedUser.email,
                avatarPng: savedUser.avatarPng
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    loginGuest,
    logoutUser,
    updateUser
}