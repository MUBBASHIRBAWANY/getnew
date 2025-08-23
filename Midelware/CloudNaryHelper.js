import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';
    let resourceType = 'image';

    if (file.mimetype === 'application/pdf') {
      folder = 'uploads/pdf';
      resourceType = 'raw'; // Cloudinary uses 'raw' for non-image files like PDFs
    } else {
      folder = 'Blogs/users';
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Specify allowed formats here
    };
  },
});

const uploads = multer({ storage });

export default uploads;
