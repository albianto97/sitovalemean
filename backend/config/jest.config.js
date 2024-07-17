module.exports = {
    testEnvironment: 'node', // Ambiente di test per eseguire i test in Node.js

    // File di test da includere
    testMatch: [
        '**/__tests__/**/*.test.js', // Test in file con estensione .test.js nella cartella __tests__
        '**/?(*.)+(spec|test).js'    // Test in file con estensione .spec.js o .test.js
    ],

    // Trasformazione dei file con Babel per supportare ES6/ES7
    transform: {
        '^.+\\.js$': 'babel-jest', // Trasforma i file .js con babel-jest
    },

    // Variabili globali per i test Jest
    globals: {
        NODE_ENV: 'test', // Imposta NODE_ENV a 'test'
    },
};
