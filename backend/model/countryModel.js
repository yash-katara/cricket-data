import mongoose from "mongoose";
const countrySchema = new mongoose.Schema({
    name :{type:String,required:true},
    teams:{type:[String]},
    venues: { type: [String] },

},
{timestamps:true}
)

export default mongoose.model('country' , countrySchema)