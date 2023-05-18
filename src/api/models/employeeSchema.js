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
  securityNumber: {
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
  displayName: {
    type: String,
    get: function () {
      return this.firstName + " " + this.lastName;
    },
  },
  avatar: {
    type: String,
    default: "https://www.shutterstock.com/image-illustration/vector-medical-icon-dentist-doctor-260nw-1492048499.jpg"
  }
  
}, { timestamps: true,
  toObject: { getters: true },
  toJSON: { getters: true , versionKey: false}
});



const employeeModel = model('Employee', employeeSchema);

export default employeeModel;

//h: 'https://www.shutterstock.com/image-illustration/vector-medical-icon-dentist-doctor-260nw-1492048499.jpg'
//h2: 'https://www.shutterstock.com/shutterstock/photos/1492021100/display_1500/stock-photo-vector-medical-icon-dentist-doctor-image-medic-dentist-avatar-illustration-doctor-dentist-in-1492021100.jpg'
//m:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Zb-nbVmJFpSSjOVAw_l40GMnGd9n0Bnn6w&usqp=CAU'
//m2 : 'image.png'