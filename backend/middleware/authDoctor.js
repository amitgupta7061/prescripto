import jwt from 'jsonwebtoken';


export const authDoctor = async (req, res, next) => {
    try {
        const {dtoken} = req.headers;
        if(!dtoken) {
            return res.json({
                success:false,
                message:"Un-Authorized access"
            })
        }

        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}