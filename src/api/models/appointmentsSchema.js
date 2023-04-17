import mongoose from 'mongoose';

const { Schema } = mongoose;

const appointmentSchema = new Schema({
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
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

  comentarios: {
    type: String
  }
},{ timestamps: true, toObject: { getters: true }, toJSON: { getters: true , versionKey: false}});

const appointment = mongoose.model('Appointment', appointmentSchema);

export default appointment;
