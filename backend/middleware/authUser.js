import jwt from 'jsonwebtoken';


export const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if(!token) {
            return res.status(400).json({
                success:false,
                message:"Un-Authorized access"
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}