import mongoose from "mongoose";

export async function getDbConnection() {
    return mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch(err => console.error(err));
}
