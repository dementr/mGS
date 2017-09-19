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
//user data type
  let userObj = {
    email : '',
    pass : '',
    login : '',
    hash : ''
  }

  // Find one field
  const getOneData = (table, key, value) => {
      console.log('getOneData 0');
    if(key == 'hash') {
        console.log('getOneData 1');
      return db.collection(table).findOne({hash:value});
    }

    if(key == 'email'){
      return db.collection(table).findOne({email:value});
    }

  }

  const getAllData = (table, key, value) => {

    return db.collection(table).find({email:value}).toArray();
  }

  const putUpdate = (table, key, value) => {
    return db.collection(table).updateOne({id:value.key}, { $set: {'login' : value.login}});
  }

  const postInsert = (table, value) => {

    return db.collection(table).insert(value, (err, result) =>{
      if(err){
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
  }

  //regist user
  const singInUser = async (table='users', value) => {

    if(await getOneData(table, 'email', value.email) == null){
      return postInsert(table, value);
    } else {
        return 'email';
    }
  }

  const auth = async (table='users', value) => {
    console.log('auth 0');
    let res = await getOneData(table, 'hash', value);
    console.log('auth 1');
    console.log(res);
    if(res == null){
      console.log('auth 2');
      return false;
    } else {
      console.log('auth 3');
        return res;
    }
  }

  const updatel = async (table='users', value) => {
    console.log('auth 0');
    let res = await putUpdate(table, 'hash', value);
    console.log('auth 1');
    console.log(res);
    if(res == null){
      console.log('auth 2');
      return false;
    } else {
      console.log('auth 3');
        return res;
    }
  }

  /*
  const singInUser = async (table='users', value) => {
    //console.log(value.email);
    let q = await getOneData(table, 'email', value.email);
    console.log(q);
    if(q == null){
      return postInsert(table, value);
    } else {
        return 'email';
    }
  }
  */

  module.exports = {
    getOneData,
    postInsert,
    singInUser,
    auth,
    updatel,
    userObj
  }
