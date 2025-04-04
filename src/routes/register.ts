import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post(
  '/register',
  upload.array('files'),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const body = req.body;

      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const fileData = await fs.promises.readFile(file.path);
          return {
            filename: file.originalname,
            mimetype: file.mimetype,
            content: fileData.toString('base64')
          };
        })
      );

      // Cleanup temp files
      files.forEach(file => fs.unlinkSync(file.path));

      const payload = {
        ...body,
        files: uploadedFiles
      };

      // Forward to service B
      // const response = await axios.post('http://localhost:5000/api/receive', payload);

      return res.status(200).json(payload);
    } catch (error: any) {
      console.error('Error forwarding:', error.message);
      return res.status(500).json({ error: 'Failed to process and forward data' });
    }
  }
);

export default router;
