const bcrypt = require('bcrypt');
const saltRounds = 10;
// Load hash from your password DB.

for( let i = 11 ; i <= 15; i++ ) {
  myPlaintextPassword = `hashed_pw${i}`;
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log(`Hash ${i} :`, hash);
  });
}
