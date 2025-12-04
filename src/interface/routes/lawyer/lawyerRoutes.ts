

import { Router } from "express";

// Controllers

import { LawyerController } from "../../controllers/lawyer/lawyerController";
import { LawyerLogoutController } from "../../controllers/lawyer/lawyerLogoutController";
import { AvailabilityController } from "../../controllers/lawyer/AvailabilityController";
import { GetProfileController } from "../../controllers/lawyer/ProfileController";

// Cloudinary Upload Service

import { upload } from "../../../infrastructure/services/cloudinary/CloudinaryConfig";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
// Repository

import { AvailabilityRuleRepository } from "../../../infrastructure/repositories/lawyer/AvailabilityRuleRepository";
import { LawyerRepository } from "../../../infrastructure/repositories/lawyer/LawyerRepository";
import { UserRepository } from "../../../infrastructure/repositories/user/UserRepository";
import { TokenService } from "../../../infrastructure/services/jwt/TokenService";



// Use Cases 

import { CreateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/CreateAvailabilityRuleUseCase";
import { UpdateAvailabilityRuleUseCase } from "../../../application/useCases/lawyer/UpdateAvailabilityRuleUseCase";
import { GetAllAvailableRuleUseCase } from "../../../application/useCases/lawyer/GetAllAvailabilityRulesUseCase";
import { DeleteAvailableRuleUseCase } from "../../../application/useCases/lawyer/DeleteAvailabileRuleUseCase";
import { GetProfileUseCase } from "../../../application/useCases/lawyer/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../../application/useCases/lawyer/UpdateProfileUseCase";
import { ChangePasswordUseCase } from "../../../application/useCases/lawyer/ChangePasswordUseCase";
import { CheckUserStatusUseCase } from "../../../application/useCases/user/checkUserStatusUseCase";
const router = Router();

// ============================================================================
//  Controller Instances
// ============================================================================
const lawyerController = new LawyerController();
const lawyerLogoutController = new LawyerLogoutController();



// Repository instance
const availabilityRuleRepository = new AvailabilityRuleRepository();
const lawyerRepository = new LawyerRepository()
const userRepository = new UserRepository();



// UseCase instances
const createAvailabilityRuleUseCase = new CreateAvailabilityRuleUseCase(availabilityRuleRepository);
const updateAvailabilityRuleUseCase = new UpdateAvailabilityRuleUseCase(availabilityRuleRepository);
const getAllAvailableRuleUseCase = new GetAllAvailableRuleUseCase(availabilityRuleRepository);
const deleteAvailableRuleUseCase = new DeleteAvailableRuleUseCase(availabilityRuleRepository);
const getProfileUseCase = new GetProfileUseCase(lawyerRepository)
const updateProfileUseCase = new UpdateProfileUseCase(lawyerRepository)
const changePasswordUseCase = new ChangePasswordUseCase(lawyerRepository)
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepository);
const tokenService = new TokenService();
const authMiddleware = new AuthMiddleware(["lawyer"], checkUserStatusUseCase, tokenService);

// Availability Controller 
const availabilityController = new AvailabilityController(
  createAvailabilityRuleUseCase,
  updateAvailabilityRuleUseCase,
  getAllAvailableRuleUseCase,
  deleteAvailableRuleUseCase
);


const getProfileController = new GetProfileController(getProfileUseCase, updateProfileUseCase, changePasswordUseCase)




router.post(
  "/verifyDetils",
  upload.array("documents"), authMiddleware.execute,
  (req, res,next) => lawyerController.registerLawyer(req, res,next)
);


router.post("/logout", (req, res,next) =>
  lawyerLogoutController.handle(req, res,next)
);



//  Schedule Management Routes

router.post("/schedule/create", authMiddleware.execute, (req, res,next) =>
  availabilityController.createRule(req, res,next)
);


router.put("/schedule/update/:ruleId", authMiddleware.execute, (req, res,next) =>
  availabilityController.updateRule(req, res,next)
);


router.get("/schedule/", authMiddleware.execute, (req, res,next) =>
  availabilityController.getAllRuls(req, res,next)
);

router.delete("/schedule/delete/:ruleId", (req, res,next) =>
  availabilityController.DeleteRule(req, res,next)
);



router.get('/profile', authMiddleware.execute, (req, res,next) => getProfileController.getDetils(req, res,next))


router.put('/profile/update', authMiddleware.execute, upload.single('profileImage'), (req, res,next) => getProfileController.updateProfile(req, res,next))

router.put('/profile/password', authMiddleware.execute, (req, res,next) => getProfileController.changePassword(req, res,next))

export default router;
