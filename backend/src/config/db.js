import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGODB CONNECTED SUCCESSFULLY!")
    } catch (error) {
        console.log("error connecting to mongodb", error);
        process.exit(1) //exit with failure. 1 means failure but 0 mean success
    }
    
}