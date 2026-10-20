import cloudinary from "../Configs/Cloudinary.js";

const uploadToCloudinary = async (fileBuffer, folderName = 'AnnStream-job-platform', profilePicture = false) => {
return new Promise((resolve, reject) => {
    let uploadOptions = {
        folder: folderName,
        resource_type: 'auto'
    }
        
        if (profilePicture) {
            uploadOptions = {
        folder: folderName,
        resource_type: 'image'
    };
        };

        const uploader = cloudinary.v2.uploader;

 const stream = uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
        } else {
            resolve(result);
        }
    })
    stream.end(fileBuffer);
})
};
export default uploadToCloudinary;