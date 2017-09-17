// hash pass
//https://github.com/kelektiv/node.bcrypt.js

let bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports = {
  hash : (hash) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) {console.log(err);}
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
          if(err) {console.log(err);}
            return hash;
        });
    });
  }
}
// end hash
