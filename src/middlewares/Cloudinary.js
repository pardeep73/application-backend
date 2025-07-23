import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from 'fs/promises'

dotenv.config({ path: './.env' });
export const cloudinaryURL = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const image = req.file;

    console.log('image file',image)
    if (!image) {
      throw new Error('Image not received');
    }

    const imagePath = `/.${image.path}`;

    if (!imagePath) {
      throw new Error('Image path is not defined');
    }

    const upload = await cloudinary.uploader.upload(imagePath);

    if (!upload) {
      throw new Error('Cloudinary upload failed');
    }

    console.log('Cloudinary data:', upload);

    if(upload){
      try {
        await fs.unlink(imagePath)
        console.log('image Deleted Successfully')
      } catch (error) {
        throw new Error(`File Deletion Error: ${error}`)
      }
    }

    return { public_id: upload.public_id, url: upload.secure_url };

  } catch (error) {
    console.error(error); // for debugging
    throw new Error(`Cloudinary error: ${error.message}`);
  }
};
