class CliIO {
  showMessage({ type, message }) {
    console.log(`[${type}] ${message}`);
  }
}

module.exports = CliIO;
