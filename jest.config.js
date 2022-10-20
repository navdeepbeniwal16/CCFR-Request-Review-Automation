module.exports = {
    testTimeout: 15000,

    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
};