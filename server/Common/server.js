const PORT = process.env.PORT || 42069;

function validatePassword(password) {
  if (password.length < 8 || password.length > 16) {
    return false;
  }
  const capitalRegex = /[A-Z]/;
  const smallRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const symbolRegex = /[@!_$%#]/;

  if (
    !capitalRegex.test(password) ||
    !smallRegex.test(password) ||
    !numberRegex.test(password) ||
    !symbolRegex.test(password)
  ) {
    return false;
  }
  return true;
}

module.exports = { PORT, validatePassword };
