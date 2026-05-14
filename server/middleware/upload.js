import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

export const upload = multer({ storage });
