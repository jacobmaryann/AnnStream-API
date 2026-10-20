import mongoose from 'mongoose';

const DBconnect = async () => {
    await mongoose.connect(process.env.MongoDB_URI)
    console.log('Database connected successfully');
    const error = mongoose.connection.on('error', (err) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with an error code
    });
};

export default DBconnect;