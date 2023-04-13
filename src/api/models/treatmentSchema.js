import {Schema, model} from 'mongoose';
const treatmentSchema = new Schema({
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Session'
      }
    ],
    employee:{
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    employee2:{
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    cost: {
      type: Number,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  

  const treatmentModel = model('Treatment', treatmentSchema);
  
  export default treatmentModel;
  
  