const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

function normalizeSkillGaps(skillGaps = []) {
    const allowedSeverities = new Set(["low", "medium", "high"])

    const normalized = skillGaps.map((gap) => {
        const rawSeverity = String(gap?.severity || "medium").toLowerCase()
        const severity = allowedSeverities.has(rawSeverity) ? rawSeverity : "medium"

        return {
            ...gap,
            severity
        }
    })

    const hasHigh = normalized.some((gap) => gap.severity === "high")

    if (!hasHigh && normalized.length > 0) {
        const mediumIndex = normalized.findIndex((gap) => gap.severity === "medium")
        const targetIndex = mediumIndex >= 0 ? mediumIndex : 0
        normalized[targetIndex].severity = "high"
    }

    return normalized
}


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res){
    const resumeFile = req.file;

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
     });

    const normalizedSkillGaps = normalizeSkillGaps(interviewReportByAi?.skillGaps)
    
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi,
        skillGaps: normalizedSkillGaps
    })

    res.status(200).json({
        message: "Interview report generated successfully",
        interviewReport
     })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const normalizedSkillGaps = normalizeSkillGaps(interviewReport.skillGaps)
    interviewReport.skillGaps = normalizedSkillGaps

    await interviewReport.save()

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    // agar uss id ka interview report nhi mila to
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    // mil gya to ye 3 chizein nikaalenge interview report se
    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}


module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }