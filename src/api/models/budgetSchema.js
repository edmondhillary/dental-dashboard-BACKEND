import {Schema, model } from 'mongoose';
const budgetSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  costWithDiscount: {
    type: Number
  },
  treatment: {
    type: String,
    ref: 'Treatment',
    required: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  financing:{
    type: Boolean,
    immutable: true 
  },
  paid: {
    type: Number,
    required: true,
    default: 0
  },
 
  }, { timestamps: true ,toObject: { getters: true }, toJSON: { getters: true , versionKey: false}} );
 
  budgetSchema.virtual('balance').get(function() {
  
    return this.costWithDiscount - this.paid;
  });
 
  budgetSchema.virtual('isPaidCompleted').get(function() {
   if(this.paid === this.costWithDiscount) {
    return true;
   } else{
    return false;
   }
  })

  budgetSchema.pre('save', function (next) {
    
    if (this.paid < this.cost) {
      this.financing = true;
    }
  
    next();
  });

  budgetSchema.path('discount').validate(function(value) {
    if (this.cost && value>=0) {
      this.costWithDiscount = this.cost * (100 - value) / 100;
    }
  
    return value >= 0 && value <= 100;
  })
  
  
  const budgetModel = model('Budget', budgetSchema);
  
  export default budgetModel;
  
  