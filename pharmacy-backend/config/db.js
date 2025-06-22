import mongoose from "mongoose";

const connectDB = async (retryAttempts = 3, retryDelay = 2000) => {
    if (retryAttempts < 1) {
        console.error("No retry attempts specified. Exiting...");
        process.exit(1);
    }
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB Connected.");
            return;
        } catch (error) {
            console.error(`MongoDB Connection Error (Attempt ${attempt}/${retryAttempts}):`, error.message);
            
            if (attempt === retryAttempts) {
                console.error("Max retry attempts reached. Exiting...");
                process.exit(1);
            }
            
            console.log(`Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

export default connectDB;