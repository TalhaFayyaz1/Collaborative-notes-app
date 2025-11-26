import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 8080,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};
