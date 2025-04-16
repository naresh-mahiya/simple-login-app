import mongoose from "mongoose";

const connect = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (err) {
        console.log('Could not connect to the database. Error:', err);
    }
};

export default connect;
