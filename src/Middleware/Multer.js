import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage, limits: 2 * 1024 * 1024}); // this limits file size to 2MB

export default upload;