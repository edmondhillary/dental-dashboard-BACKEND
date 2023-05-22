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
    },
    gender: {
      type: String,
      enum: ["Masculino", "Femenino"],
    },
    address: {
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
    }],
    firstVisit: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    displayName: {
      type: String,
      get: function () {
        return this.firstName + " " + this.lastName;
      },
    },
    edad: {
      type: Number,
      get: function () {
        return moment().diff(this.dateOfBirth, 'years');
    }
  }
},
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true, versionKey: false } }
);

patientSchema.pre('validate', function(next) {
  if (this.genero === 'Femenino') {
    this.avatar = 'https://w7.pngwing.com/pngs/681/929/png-transparent-avatar-user-profile-computer-icons-woman-avatar-child-face-heroes.png';
  } else if (this.genero === 'Masculino') {
    this.avatar = 'https://e7.pngegg.com/pngimages/573/452/png-clipart-avatar-drawing-icon-men-s-avatar-face-heroes.png';
  }
  next();
});
// patientSchema.virtual("displayName").get(function () {
//   return this.firstName + " " + this.lastName;
// });

const patientModel = model("Patient", patientSchema);

export default patientModel;
