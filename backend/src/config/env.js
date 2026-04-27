require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    tokenSecret: process.env.TOKEN_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL
};