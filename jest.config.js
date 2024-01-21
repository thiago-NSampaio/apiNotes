module.exports = {
  // Caso um teste falhe ele para a execução de testes.
  bail: true,
  // Define o provedor de cobertura de código.
  coverageProvider: "v8",
  testMatch: [
    // Ignora outras pastas como a node_modules e inspeciona apenas as pastas com arquivos .spec .
    "<rootDir>/src/**/*.spec.js"
  ],
}