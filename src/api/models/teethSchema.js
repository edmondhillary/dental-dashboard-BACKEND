import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const teethSchema = new Schema({

    number: {
        type: Number,
        required: true,
        // enum: [0, 11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48]
      },
      treatments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment'
      }],
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        inmutable: true
      },
      imagen: {
        type: String
      },
      name: {
        type: String
      }
  },{ timestamps: true, toObject: { getters: true }, toJSON: { getters: true , versionKey: false} });


const teethModel = model('Teeth', teethSchema);

export default teethModel;