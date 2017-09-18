const fcdb = require('mongodb').MongoClient;
const objID = require('mongodb').ObjectID;

let db;

fcdb.connect('mongodb://localhost:27017/mGSDB', (err, database) => {
  if(err){
    console.log(err);
  }
  db = database;
  console.log('db connect');
})
//console.log(fcdb + " <> " + objID);
module.exports = {

  /*dbconn : fcdb.connect('mongodb://localhost:27017/mGSDB', (err, database) => {
    if(err){
      console.log(err);
    }
    return database;
  }),*/

  //user data type
  userObj : {
    email : '',
    pass : '',
    login : '',
    hash : ''
  },

  // Find one field
  getOneData : (table, key, value) => {
    console.log(table + " tab " + value + " val " + key);
    db.collection(table).findOne({ key: value}, (err, result) => {
      if(err){
        console.log(err);
        return false;
      }
      return result;
    });
  },

  //insert
  postInsert : (table, value) => {
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
  singInUser : (table='users', value) => {
    console.log(table + " tab " + value);
    if(getOneData(table, 'email', value.email)){
      return 'email';
    } else {
      return postInsert(table, value);
    }
  },

}
