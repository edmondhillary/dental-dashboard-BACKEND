// import { Schema, model } from "mongoose";

// const sessionSchema = new Schema({

//     observations: {
//       type: String,
//     },
//     patient: {  
//         type: Schema.Types.ObjectId,
//         ref: 'Patient',
//         required: true
//     },
//     treatments : [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'Treatment',
//         required: true
//       }
//     ]
//   },{ timestamps: true, toObject: { getters: true }, toJSON: { getters: true , versionKey: false} });


// const sessionModel = model('Session', sessionSchema);

// export default sessionModel;