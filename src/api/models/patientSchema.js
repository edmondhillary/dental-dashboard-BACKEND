import { Schema, model } from "mongoose";
import moment from "moment";

const patientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    
    },
    phone: {
      type: String,
      required: true,
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
    dni: {
      type: String,
      
    },
    profesion: {
      type: String,
    
    },

    historialClinicoEnfermedades: [{
      type: String,
     
    }],
    historialDental: [{
      type: String,
   
    }],
    alergias: [{
      type: String,
    }],
    otrosCamposMedicos: {
      type: String,
    },
    // sessions: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Session",
    //   },
    // ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      }
    ],

    budget: [{
      type: Schema.Types.ObjectId,
      ref: "Budget",
    }],
    treatment:[{
      type: Schema.Types.ObjectId,
      ref: "Treatment",
    }],
    tooth: [{
      type: Schema.Types.ObjectId,
      ref: "Teeth",
    }]
  },

  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true , versionKey: false} }
);

patientSchema.virtual("displayName").get(function () {
  return this.firstName + " " + this.lastName;
});
patientSchema.virtual('edad').get(function() {
  return moment().diff(this.dateOfBirth, 'years');
});
const patientModel = model("Patient", patientSchema);

export default patientModel;
