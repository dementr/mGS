const fcdb = require('mongodb').MongoClient;
const objID = require('mongodb').ObjectID;

module.exports = {

  dbconn : fcdb.connect('mongodb://localhost:27017/mGSDB', (err, database) => {
    if(err){
      return console.log(err);
    }
    return database;
  }),

  //user data type
  userObj : {
    email : '',
    pass : '',
    login : '',
    hash : ''
  },

  // Find one field
  getOneData : (db, table, key, value) => {
    db.collection(table).findOne({ key: value}, (err, result) => {
      if(err){
        console.log(err);
        return false;
      }
      return result;
    });
  },

  //insert
  postInsert : (db, table, value) => {
    db.collection(table).insert(value, (err, result) =>{
      if(err){
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
  },

  //regist user
  singInUser : (db, table='users', value) => {
    if(getOneData(db, table, 'email', value.email)){
      return 'email';
    } else {
      return postInsert(db, table, value);
    }
  },

}
