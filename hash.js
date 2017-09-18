// hash pass
//https://github.com/kelektiv/node.bcrypt.js

let bcrypt = require('bcrypt');
const saltRounds = 1;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports = {
  hash : (salt) => {
    console.log(saltRounds);
    console.log(salt);
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) {console.log(err);}
      console.log(salt);
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
          console.log(salt);
          console.log(hash);
          if(err) {console.log(err);}
            return hash;
        });
    });
  }
}
// end hash
