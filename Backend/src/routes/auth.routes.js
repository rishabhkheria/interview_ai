// const express = require('express')

const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
// kabhi chances ho ki token na mile to hum sirf cookies ko clear krdenge aur token ko blacklist nhi krenge
authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET / api/auth/get-me
 * @description get the current logged in user detials
 * @access private
 */
//ye api humari protected rhegi issliye iska access private rhega
// isme ek middle ware bhi use hoga jo ki humein btayega ki request kis user ne ki h
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter