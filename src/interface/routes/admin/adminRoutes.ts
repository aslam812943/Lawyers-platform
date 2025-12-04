
import express from 'express';
import { AdminAuthMiddleware } from '../../middlewares/admin/AdminAuthMiddleware';
import { NodeMailerEmailService } from '../../../infrastructure/services/nodeMailer/NodeMailerEmailService';

//  Admin Authentication
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { AdminRepository } from '../../../infrastructure/repositories/admin/AdminRepository';
import { LoginAdminUseCase } from '../../../application/useCases/Admin/LoginAdminUseCase';
import { TokenService } from '../../../infrastructure/services/jwt/TokenService';

//  User Management
import { GetAllUsersController } from '../../controllers/admin/GetAllUsersController';
import { UserRepository } from '../../../infrastructure/repositories/user/UserRepository';
import { GetAllUsersUseCase } from '../../../application/useCases/Admin/GetAllUsersUseCase';
import { BlockUserController } from '../../controllers/admin/BlockUserController';
import { BlockUserUseCase } from '../../../application/useCases/Admin/BlockUserUseCase';
import { UNBlockuserUseCase } from '../../../application/useCases/Admin/UNBlockUserUseCase';
import { UNBlockUserController } from '../../controllers/admin/UNBlockUserController';

// Lawyer Management
import { LawyerRepository } from '../../../infrastructure/repositories/lawyer/LawyerRepository';
import { GetAllLawyersController } from '../../controllers/admin/GetAllLawyersController';
import { GetAllLawyersUseCase } from '../../../application/useCases/Admin/GetAllLawyersUseCase';
import { BlockLawyerUseCase } from '../../../application/useCases/Admin/BlockLawyerUseCase';
import { BlockLawyerController } from '../../controllers/admin/BlockLawyerController';
import { UNBlockLawyerUseCase } from '../../../application/useCases/Admin/UNBlockLawyerUseCase';
import { UNBlockLawyerController } from '../../controllers/admin/UNBlockLawyerController';
import { ApproveLawyerUseCase } from '../../../application/useCases/Admin/ApproveLawyerUseCase';
import { ApproveLawyerController } from '../../controllers/admin/ApproveLawyerController';
import { RejectLawyerUseCase } from '../../../application/useCases/Admin/RejectLawyerUseCase';
import { RejectLawyerController } from '../../controllers/admin/RejectLawyerController';





const router = express.Router();

// ------------------------------------------------------
// Initialize Services & Core Dependencies
// ------------------------------------------------------
const tokenService = new TokenService();
const adminRepo = new AdminRepository();
const nodeMailerEmailService = new NodeMailerEmailService()
const adminAuth = new AdminAuthMiddleware().execute;
// ------------------------------------------------------
//  Admin Authentication
// ------------------------------------------------------
const loginUseCase = new LoginAdminUseCase(adminRepo, tokenService);
const controller = new AdminAuthController(loginUseCase);

// ------------------------------------------------------
// User Management Setup
// ------------------------------------------------------
const userRepo = new UserRepository();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
const blockUserUseCase = new BlockUserUseCase(userRepo);
const blockUserController = new BlockUserController(blockUserUseCase);
const unBlockuserUseCase = new UNBlockuserUseCase(userRepo);
const unBlockUserController = new UNBlockUserController(unBlockuserUseCase);

// ------------------------------------------------------
// Lawyer Management Setup
// ------------------------------------------------------
const lawyerRepo = new LawyerRepository();
const getAllLawyersUseCase = new GetAllLawyersUseCase(lawyerRepo);
const getAllLawyersController = new GetAllLawyersController(getAllLawyersUseCase);
const blockLawyerUseCase = new BlockLawyerUseCase(lawyerRepo);
const blockLawyerController = new BlockLawyerController(blockLawyerUseCase);
const unBlockLawyerUseCase = new UNBlockLawyerUseCase(lawyerRepo);
const unBlockLawyerController = new UNBlockLawyerController(unBlockLawyerUseCase);
const approveLawyerUseCase = new ApproveLawyerUseCase(lawyerRepo,nodeMailerEmailService);
const approveLawyerController = new ApproveLawyerController(approveLawyerUseCase);
const rejectLawyerUseCase = new RejectLawyerUseCase(lawyerRepo,nodeMailerEmailService);
const rejectLawyerController = new RejectLawyerController(rejectLawyerUseCase);

// ------------------------------------------------------
//  Admin Routes
// ------------------------------------------------------

//  Admin Login and Logout
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout',(req,res)=>controller.logout(req,res))

//  User Management Routes
router.get('/users', adminAuth, (req, res) => getAllUsersController.handle(req, res));
router.patch('/users/:id/block', adminAuth, (req, res) => blockUserController.handle(req, res));
router.patch('/users/:id/unblock', adminAuth, (req, res) => unBlockUserController.handle(req, res));

//  Lawyer Management Routes
router.get('/lawyers',adminAuth, (req, res) => getAllLawyersController.handle(req, res));
router.patch('/lawyers/:id/block', adminAuth, (req, res) => blockLawyerController.handle(req, res));
router.patch('/lawyers/:id/unblock', adminAuth, (req, res) => unBlockLawyerController.handle(req, res));
router.patch('/lawyers/:id/approve',adminAuth, (req, res) => approveLawyerController.handle(req, res));
router.patch('/lawyers/:id/reject', adminAuth, (req, res) => rejectLawyerController.handle(req, res));


export default router;
