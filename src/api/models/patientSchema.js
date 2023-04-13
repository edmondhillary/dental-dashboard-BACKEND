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
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    dni: {
      type: String,
      required: true,
    },
    profesion: {
      type: String,
      required: true,
    },

    historialClinicoEnfermedades: [{
      type: String,
      required: true,
    }],
    historialDental: [{
      type: String,
      required: true,
    }],
    alergias: {
      type: String,
    },
    otrosCamposMedicos: {
      type: String,
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
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
    }]
  },

  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);

patientSchema.virtual("displayName").get(function () {
  return this.firstName + " " + this.lastName;
});
patientSchema.virtual('edad').get(function() {
  return moment().diff(this.dateOfBirth, 'years');
});
const patientModel = model("Patient", patientSchema);

export default patientModel;
