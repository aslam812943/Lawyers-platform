import { Router } from "express";
import { LawyerController } from "../../controllers/lawyer/lawyerController";
import { upload } from "../../../infrastructure/services/cloudinary/CloudinaryConfig";

const router = Router();
const controller = new LawyerController();

router.post(
  "/verifyDetils",
  upload.array("documents"),
  (req, res) => controller.registerLawyer(req, res)
);

export default router;
