const mongoose= require('mongoose');
const {Schema, model} = mongoose;

const DataSchema= new Schema({
    title: String,
    note: String,
    pass: String,
    author: {type: Schema.Types.ObjectId, ref:'User'}
},{
    timestamps: true,
})

const DataModel= model('Data', DataSchema);

module.exports= DataModel;