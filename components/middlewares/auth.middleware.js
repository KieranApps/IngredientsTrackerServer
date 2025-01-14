
// Token check
export async function checkAccessToken(req, res, next) {
    const { accesstoken } = req.headers;
    let verifiedToken;
    try {
        verifiedToken = jwt.verify(accesstoken, process.env.JWT_SECRET);
    } catch (error) {
        // The token is invalid
        throw new UnAuthorized('Invalid Tokens');
    }
    console.log(verifiedToken)

    next();
};