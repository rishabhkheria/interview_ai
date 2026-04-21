// const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod"); // ai se structured output laane ke liye, else ai text deta h output mei jo ki database mei store krna aur pdhna dono hi mushkil hota h // docs line.. In addition to supporting json schema in rest api, the google gen ai sdks make it easy to define schemas using Pydantic (Python) and Zod (JavaScript).
// const { zodToJsonSchema } = require("zod-to-json-schema"); // zod schema ko json schema mei convert krne ke liye, kyuki ai ko json schema chahiye hota h structured output ke liye

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// // ye schema database mei save krne wale h uss schema se ye kaafi alg hai
// // prettier-ignore
// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

// // prettier-ignore
// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

//     // const prompt = `Generate an interview report for a candidate with the following details:
//     //                     Resume: ${resume}
//     //                     Self Description: ${selfDescription}
//     //                     Job Description: ${jobDescription}`

//     // const prompt = `Return only JSON. No extra fields.
//     //                 Generate an interview report for a candidate with the following details:
//     //                 Resume: ${resume}
//     //                 Self Description: ${selfDescription}
//     //                 Job Description: ${jobDescription}`; 

//     const prompt = `
//                     Return ONLY valid JSON. Do NOT add any text.
//                     Fill ALL fields with meaningful values. Do NOT use null.

//                     {
//                     "matchScore": number,
//                     "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
//                     "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
//                     "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
//                     "preparationPlan": [{ "day": number, "focus": "", "tasks": [""] }],
//                     "title": ""
//                     }

//                     Candidate Details:
//                     Resume: ${resume}
//                     Self Description: ${selfDescription}
//                     Job Description: ${jobDescription}
//                     `;

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseJsonSchema: z.toJSONSchema(interviewReportSchema, {
//                 target: "draft-07",
//             }),
//         }
//     })

//     const report = JSON.parse(response.text);
//     console.dir(report, { depth: null });

// }


// // async function invokeGeminiAi() {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.5-flash",
// //     contents: "Hello gemini ! Explain what is Interview ?",
// //   });

// //   console.log(response.text);
// // }

// //module.exports = invokeGeminiAi;

// module.exports = generateInterviewReport;


const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Severity rules for skillGaps:
                        - Use only: low, medium, high
                        - Mark a gap as high only if it is role-critical and strongly impacts interview success
                        - If candidate is missing at least one role-critical skill from the job description, include at least one high severity gap
                        - Do not assign all gaps as low unless the candidate profile is already very close to the role requirements
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema, {
                target: "draft-07",
            }),
        }
    })

    return JSON.parse(response.text);

    // const report = JSON.parse(response.text);
    // console.dir(report, { depth: null });


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    })
    const page = await browser.newPage();

    // A4 at 96dpi = 794 x 1123 px
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    // Inject global CSS to prevent right-side overflow and fix layout
    await page.addStyleTag({
        content: `
            *, *::before, *::after { box-sizing: border-box !important; }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: hidden !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }
            * { max-width: 100% !important; }
        `
    })

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "12mm",
            bottom: "12mm",
            left: "12mm",
            right: "12mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `You are an expert resume writer. Generate a tailored, job-specific resume in HTML for the following candidate.

                        CANDIDATE DETAILS:
                        Resume / Background: ${resume}
                        Self Description: ${selfDescription}
                        Target Job Description: ${jobDescription}

                        YOUR TASK:
                        - Create a resume that is SPECIFICALLY optimized for the given job description.
                        - Do NOT just copy the candidate's resume. Reframe, reword, and reorder everything to match what the role demands.
                        - Highlight skills, experiences, and achievements that are MOST RELEVANT to the job description.
                        - If the candidate's projects do not align well with the job, you MAY suggest/replace them with plausible, realistic projects that demonstrate the required technical skills. These should be believable extensions of the candidate's background.
                        - Emphasize keywords from the job description naturally throughout.
                        - Content should read like a strong human-written resume, not AI-generated.

                        FORMATTING RULES:
                        1. The resume MUST fill close to one full A4 page (aim for 85-100% of the page). Do not leave large empty spaces.
                        2. Use font size 11-12px for body, 16px for name, 12-13px for section headings.
                        3. Professional line-height (1.4-1.5). Sections clearly separated but not with large gaps.
                        4. NO borders, NO box shadows, NO card containers, NO outer rectangle or decorative frame.
                        5. Flat, clean, ATS-friendly layout. Use divs, not tables, for structure.
                        6. Internal CSS only — no external resources or Google Fonts.
                        7. Return ONLY a JSON object: { "html": "<full html string>" }
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema( resumePdfSchema, {
                target: "draft-07",
            }),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports =  {generateInterviewReport, generateResumePdf} ;