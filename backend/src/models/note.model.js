import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true,"time is required"],
    trim:true,
  },
  content:{
    type:String,
    required:[true,"Content is required"],
    trim:true
  }
},{
  timestamps:{createdAt:true,updatedAt:false}
}

);
export const Note = mongoose.model("Note", noteSchema);
