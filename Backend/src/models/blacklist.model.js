// uss database / model ka use krenge jiska throughput sabse zyada ho, redis ka generally us ekrte h production mei kyunki uska throughput zyada rehta hai
// abhi mongodb ka use krenge filhaal

const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
        token: {
            type: String,
            required: [true, "token is required to be added in blacklist"]
        }
    },
    {
        timestamps: true // token kb blacklist hua tha ye aapka manage krna chalu krdega database khud hi apne aap se
    }
)

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel

