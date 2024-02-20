const mongoose = require('mongoose');
const dbConnection = () => {
  const DB_ATLAS = "mongodb+srv://mostafamohamed8828:lmHEZZ7b2CxYBs66@cluster0.kvwnqcx.mongodb.net/?retryWrites=true&w=majority"
// const local = "mongodb://127.0.0.1:27017/corser4arab"

 
const server = mongoose.connect(DB_ATLAS)
.then((conn) => {
  console.log(`Conncted to db successfuly ${conn.connection.host}`);
})
};

module.exports = dbConnection; 