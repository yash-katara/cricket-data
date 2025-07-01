import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const userProfileSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, maxlength: 50, unique: true },
    password: { type: String, required: true },
    role: { type: Number, enum: [1, 2, ] }, // 1:Admin(OWNER), 
    status: { type: String, enum: Object.values(STATUS) },
    userId: { type: String, sparse: true }, 
    phone:{type:String,required:true},
    
    
    otp: {
    value: { type: String },        
    expiry: { type: Date },         
  },
  isOTP:{
    type:Boolean,
    default:false
  }

  },
  { timestamps: true }
);

const User = model("user", userProfileSchema);

export default User;
