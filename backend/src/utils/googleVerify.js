import { OAuth2Client } from "google-auth-library";
import { ENV } from "../config/env.js";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: ENV.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return payload; // { email, sub: googleId, ... }
    } catch (err) {
        console.error("Google token error:", err);
        return null;
    }
};
