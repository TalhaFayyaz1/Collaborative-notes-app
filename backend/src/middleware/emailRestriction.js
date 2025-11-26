export function gmailOnly(req, res, next) {
    const { email } = req.body;

    if (!email || !email.endsWith("@gmail.com")) {
        return res.status(400).json({
            message: "Only Gmail accounts are allowed for registration/login.",
        });
    }

    next();
}
