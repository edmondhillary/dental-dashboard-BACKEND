import mongoose from 'mongoose';

const { Schema } = mongoose;

const citaSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  comentarios: {
    type: String
  }
},{ timestamps: true, toObject: { getters: true }, toJSON: { getters: true } });

const Appointment = mongoose.model('Appointment', citaSchema);

export default Appointment;
