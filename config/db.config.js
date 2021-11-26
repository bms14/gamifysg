const config = {
    HOST: process.env.DB_HOST || 'www.joaoferreira.eu',
    USER: process.env.DB_USER || 'joaoferr_ESMAPP_21_22_GRP7',
    PASSWORD: process.env.DB_PASSWORD || 'ZN29pBNKrWd32S5n',
    DB: process.env.DB_NAME || 'joaoferr_ESMAPP_21_22_GRP7',
    dialect: "mysql",
};

module.exports = config;