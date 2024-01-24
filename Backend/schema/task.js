import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    task: String,
    description: String
});


let tasks = mongoose.model('Task', taskSchema);
export default tasks;
