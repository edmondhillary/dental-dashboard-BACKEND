import { Schema, model } from "mongoose";
const treatmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // employee2: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Employee",
    // },
    teeth: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cost: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // isPaid: {
    //   type: Boolean,
    //   default: false,
    // },
    discount: {
      type: Number,
      default: 0,
    },
    fechaFin:{
      type: Date,
      default: Date.now
    },
    
      discountEnabled:{
        type: Boolean,
      
      
    },
    isAddedToBudget:{
      type: Boolean,
      default: false,
    },
    budget: { // Agregar campo de referencia a 'budgetModel'
      type: Schema.Types.ObjectId,
      ref: 'Budget'
    }
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true, versionKey: false },
  }
);

const treatmentModel = model("Treatment", treatmentSchema);

export default treatmentModel;

//no se elimina el presupuesto cuando se elimina un tratamiento..//
//ojoooooo///