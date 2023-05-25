const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'myPassword123';

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating password hash:', err);
    return;
  }

  console.log('Password hash:', hash);
  bcrypt.compare(plainPassword, hash, (err, result) => {
    if (err) {
      console.error('Error comparing password with hash:', err);
      return;
    }

    console.log('Password matches hash:', result);
  });
});
