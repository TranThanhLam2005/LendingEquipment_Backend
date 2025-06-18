function hashString(string) {
  return bcrypt.hashSync(
    string,
    process.env.SALT_ROUNDS
  );
}

function compareHash(string, hash) {
  return bcrypt.compareSync(
    string,
    hash
  );
}

