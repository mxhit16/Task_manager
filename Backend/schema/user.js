import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userId: String,
    password: String
});


let user = mongoose.model('Users', userSchema);
export default user;