const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report based on user self description, resume pdf and job description.
 * @access private
*/ 
// kyuki access private hoga, toh isme authentication middleware use karna padega, jisse ki sirf authenticated users hi is route ko access kar sake.
// authUser jo middleware, ye request ko aage sirf tbhi forawrd krega jab ek logged in user hunare paas aayega. ab ek controller humei create krna hoga
interviewRouter.post('/', authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
// interview report mil jayegi id ke according
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)



module.exports = interviewRouter