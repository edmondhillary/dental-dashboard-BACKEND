import {Schema, model } from 'mongoose';
const budgetSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  cost: {
    type: Number,
    required: true,
    optional: true
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
  // financing:{
  //   type: Boolean,
  //   default: false
  // },
  paid: {
    type: Number,
    required: true,
    default: 0
  },
  employee:{
   type: Schema.Types.ObjectId,
   ref: 'Employee',
   required: true
 }
  }, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true, versionKey: false },
    setDefaultsOnInsert: true // se agrega esta opción
  } );
 
  budgetSchema.virtual('deudaPaciente').get(function() {
  
    return this.costWithDiscount - this.paid ;
  });
 
  budgetSchema.virtual('isPaidCompleted').get(function() {
   if(this.paid === this.costWithDiscount) {
    return true;
   } else{
    return false;
   }
  })

  // budgetSchema.pre('save', function (next) {
    
  //   if (this.paid < this.costWithDiscount) {
  //     this.financing = true;
  //   }
  //   else{
  //     this.financing = false;
  //   }
  
  //   next();
  // });
  

  budgetSchema.path('discount').validate(function(value) {
    console.log("Validating discount",this.get('cost'), value);
  
    if (!this.get('cost')) {
      console.log('cost is undefined, skipping validation');
      return true;
    }
  
    if (value >= 0) {
      console.log('discount:', value);
      console.log('cost:', this.get('cost'));
      console.log('costWithDiscount:', this.costWithDiscount);
      
      const expectedCostWithDiscount = this.get('cost') * (100 - value) / 100;
      
      console.log('expectedCostWithDiscount:', expectedCostWithDiscount);
      console.log('costWithDiscount === expectedCostWithDiscount:', this.costWithDiscount === expectedCostWithDiscount);
  
      console.log('Valid discount value', this.get('cost'), value);
      this.costWithDiscount = this.get('cost') * (100 - value) / 100;
    }
  });
  
  budgetSchema.pre('save', function(next) {
    if (this.discount >= 0) {
      this.costWithDiscount = this.cost * (100 - this.discount) / 100;
    }
    next();
  });
  budgetSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
  
    if (!update.cost && !update.discount) {
      return next();
    }
  
    const discount = update.discount || this._update.discount || 0;
    const cost = update.cost || this._update.cost || 0;
    const priceWithDiscount = cost * (100 - discount) / 100;
  
    this._update.costWithDiscount = priceWithDiscount;
  
    next();
  });
  
  
  
  
  
  
  const budgetModel = model('Budget', budgetSchema);
  
  export default budgetModel;
  
  