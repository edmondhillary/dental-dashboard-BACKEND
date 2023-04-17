import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  treatments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Treatment",
    },
  ],
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,

    
  },
  lastName: {
    type: String,

    
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,

    
  },
  dateOfBirth: {
    type: Date,
    
  },

  gender: {
    type: String,
    
  },
  address: {
    type: String,
  
    
  },
  city: {
    type: String,
    
  },
  speciality: {
    type: String,
    
  },
  role: {
    type: String,
    
    default: "Employee",
  },
  lastConnection: {
    type: Date,
    default: Date
  },
  securityNamber: {
    type: Number,
    
  },
  dni: {
    type: String,
    
  },
  patients: [
  {
    type: Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Appointment'
    }],
  budgets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Budget'
    }
  ],
  
}, { timestamps: true,
  toObject: { getters: true },
  toJSON: { getters: true , versionKey: false}
});

employeeSchema.virtual('displayName').get(function () { return this.firstName + " " + this.lastName })

const employeeModel = model('Employee', employeeSchema);

export default employeeModel;