import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)