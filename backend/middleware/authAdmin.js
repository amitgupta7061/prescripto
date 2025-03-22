import jwt from 'jsonwebtoken';


export const authAdmin = async (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if(!atoken) {
            return res.status(400).json({
                success:false,
                message:"Un-Authorized access"
            })
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(400).json({
                success:false,
                message:"Un-Authorized access"
            })
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}