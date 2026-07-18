import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../utils/errors.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Determine and validate upload folder path first
    let targetFolder = 'orgride';
    const allowedSubfolders = ['profile-photos', 'vehicle-images', 'vehicle-rc'];
    const folderParam = req.query.folder as string;

    if (folderParam) {
      if (!allowedSubfolders.includes(folderParam)) {
        throw new BadRequestError(
          `Invalid upload folder. Allowed values: ${allowedSubfolders.join(', ')}`
        );
      }
      targetFolder = `orgride/${folderParam}`;
    }

    // 2. Then check file presence
    if (!req.file) {
      throw new BadRequestError('No file was uploaded');
    }

    // Upload direct buffer to designated Cloudinary folder
    const result = await uploadToCloudinary(req.file.buffer, targetFolder);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      }
    });
  } catch (error) {
    next(error);
  }
};
