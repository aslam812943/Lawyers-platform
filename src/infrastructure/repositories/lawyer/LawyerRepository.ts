
import LawyerModel, { ILawyerDocument } from "../../db/models/LawyerModel";
import UserModel from "../../db/models/ UserModel";
import { VerificationLawyerDTO } from "../../../application/dtos/lawyer/VerificationLawyerDTO";
import { Lawyer } from "../../../domain/entities/Lawyer";
import { ILawyerRepository } from "../../../domain/repositories/lawyer/ILawyerRepository";
import { UserRepository } from "../user/UserRepository";
import { IUserRepository } from "../../../domain/repositories/user/ IUserRepository";
import { Types } from "mongoose";
import { UpdateLawyerProfileDTO } from "../../../application/dtos/lawyer/UpdateLawyerProfileDTO";
import bcrypt from "bcrypt";


//  LawyerRepository

export class LawyerRepository implements ILawyerRepository {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // ------------------------------------------------------------
  //  createLawyer()
  // ------------------------------------------------------------
  async createLawyer(lawyer: VerificationLawyerDTO): Promise<Lawyer> {
    try {
      const lawyerDoc = (await LawyerModel.create(lawyer)) as ILawyerDocument;


      await this.userRepository.markVerificationSubmitted(lawyerDoc.userId.toString());


      return {
        userId: lawyerDoc.userId.toString(),
        barNumber: lawyerDoc.barNumber,
        barAdmissionDate: lawyerDoc.barAdmissionDate,
        yearsOfPractice: lawyerDoc.yearsOfPractice,
        practiceAreas: lawyerDoc.practiceAreas,
        languages: lawyerDoc.languages,
        documentUrls: lawyerDoc.documentUrls,
        addresses: { address: '', city: '', state: '', pincode: 0 },
        profileImage: '',
        isVerified: lawyerDoc.isAdminVerified,
      };
    } catch (error: any) {
      throw new Error("Database error while creating lawyer record.");
    }
  }

  // ------------------------------------------------------------
  //  findAll(
  // ------------------------------------------------------------
  async findAll(query?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: string;
   fromAdmin?: boolean;
}): Promise<{ lawyers: Lawyer[]; total: number }> {
  try {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const search = query?.search ?? "";
    const sort = query?.sort ?? "";
    const filter = query?.filter ?? "";

    // MATCH CONDITIONS
    const match: any = {
      ...(search && {
        $or: [
          { practiceAreas: { $regex: search, $options: "i" } },
          { languages: { $regex: search, $options: "i" } },
          { "user.name": { $regex: search, $options: "i" } },
          { "user.email": { $regex: search, $options: "i" } },
        ],
      }),
    };


    if (!query?.fromAdmin) {
  match["user.isBlock"] = false;
  match['isAdminVerified'] = true
  match['verificationStatus'] = 'Approved'
}

    // FILTER FEATURE
  if (filter) {
  match.$or = [
    { practiceAreas: { $regex: filter, $options: "i" } },
    { practiceAreas: { $elemMatch: { $regex: filter, $options: "i" } } },
  ];
}


    // SORT OPTIONS
    const sortOption: any = {};

    switch (sort) {
      case "experience-asc":
        sortOption["yearsOfPractice"] = 1;
        break;
      case "experience-desc":
        sortOption["yearsOfPractice"] = -1;
        break;
      default:
        sortOption["_id"] = -1;
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: match },
      { $sort: sortOption }, 
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const countPipeline = [...pipeline.slice(0, 3), { $count: "total" }];

    const [lawyerDocs, countResult] = await Promise.all([
      LawyerModel.aggregate(pipeline),
      LawyerModel.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    const lawyers = lawyerDocs.map((doc: any) => ({
      id: doc._id.toString(),
      userId: doc.user._id.toString(),
      barNumber: doc.barNumber,
      barAdmissionDate: doc.barAdmissionDate,
      yearsOfPractice: doc.yearsOfPractice,
      practiceAreas: doc.practiceAreas,
      languages: doc.languages,
      documentUrls: doc.documentUrls,
      addresses: { address: "", city: "", state: "", pincode: 0 },
      verificationStatus: doc.verificationStatus,
      isVerified: doc.isAdminVerified,
      profileImage: doc.Profileimageurl ?? "",
      user: {
        id: doc.user._id.toString(),
        name: doc.user.name,
        email: doc.user.email,
        phone: doc.user.phone,
        isBlock: doc.user.isBlock,
      },
    }));

    return { lawyers, total };
  } catch (error) {
    console.error(error);
    throw new Error("Database error while fetching lawyers.");
  }
}


  // ------------------------------------------------------------
  //  blockLawyer()
  // ------------------------------------------------------------
  async blockLawyer(id: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findById(id);
      if (!lawyer) throw new Error("Lawyer not found.");

      await UserModel.findByIdAndUpdate(lawyer.userId, { isBlock: true });
    } catch (error: any) {
      throw new Error("Database error while blocking lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  unBlockLawyer()
  // ------------------------------------------------------------
  async unBlockLawyer(id: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findById(id);
      if (!lawyer) throw new Error("Lawyer not found.");

      await UserModel.findByIdAndUpdate(lawyer.userId, { isBlock: false });
    } catch (error: any) {

      throw new Error("Database error while unblocking lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  approveLawyer()
  // ------------------------------------------------------------
  async approveLawyer(id: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findById(id);
      if (!lawyer) throw new Error("Lawyer not found.");

      lawyer.isAdminVerified = true;
      lawyer.verificationStatus = "Approved";
      await lawyer.save();
    } catch (error: any) {

      throw new Error("Database error while approving lawyer.");
    }
  }

  // ------------------------------------------------------------
  //  rejectLawyer()
  // ------------------------------------------------------------
  async rejectLawyer(id: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findById(id);
      if (!lawyer) throw new Error("Lawyer not found.");

      lawyer.isAdminVerified = false;
      lawyer.verificationStatus = "Rejected";
      await lawyer.save();
    } catch (error: any) {
      throw new Error("Database error while rejecting lawyer.");
    }
  }






  async findById(id: string): Promise<Lawyer> {

    try {
      if (!id) {
        throw new Error("Invalid ID: ID not provided");
      }

      const doc = await LawyerModel.findOne({ userId: id })
        .populate({
          path: "userId",
          select: "name email phone role isBlock",
        })
        .exec();
      if (!doc) {
        throw new Error(`Lawyer with ID ${id} not found`);
      }



      return {
        id: (doc._id as Types.ObjectId).toString(),
        userId: (doc.userId as any)._id.toString(),
        barNumber: doc.barNumber,
        barAdmissionDate: doc.barAdmissionDate,
        yearsOfPractice: doc.yearsOfPractice,
        practiceAreas: doc.practiceAreas,
        languages: doc.languages,
        documentUrls: doc.documentUrls,

        addresses: doc.Address || {
          address: "",
          city: "",
          state: "",
          pincode: 0,
        },

        verificationStatus: doc.verificationStatus,
        isVerified: doc.isAdminVerified,

        user: {
          name: (doc.userId as any).name,
          email: (doc.userId as any).email,
          phone: (doc.userId as any).phone,
          isBlock: (doc.userId as any).isBlock,
        },

        profileImage: doc.Profileimageurl || "",
        bio: doc.bio || "",
        isPassword:(doc.userId as any).password?true:false
      };

    } catch (error: any) {


      throw new Error(
        error.message || "Database error while fetching lawyer profile."
      );
    }
  }



  async updateProfile(id: string, dto: UpdateLawyerProfileDTO): Promise<void> {
    try {
      if (!id) throw new Error("Invalid ID: ID not provided");

      const data = await LawyerModel.findOne({ userId: id }).populate("userId");

      if (!data) {
        throw new Error(`Lawyer with ID ${id} not found`);
      }

      if (!data.userId) {
        throw new Error("User linked to this lawyer not found");
      }


      if (!data.Address) {
        data.Address = {
          address: "",
          city: "",
          state: "",
          pincode: 0,
        };
      }


      if (dto.imageUrl) {
        data.Profileimageurl = dto.imageUrl;
      }


      const user: any = data.userId;
      user.name = dto.name;
      user.phone = dto.phone;

      await user.save().catch(() => {
        throw new Error("Failed to update user details");
      });


      data.Address.address = dto.address;
      data.Address.city = dto.city;
      data.Address.state = dto.state;
      data.Address.pincode = Number(dto.pincode);
      if (dto.bio) data.bio = dto.bio;

      await data.save().catch(() => {
        throw new Error("Failed to update lawyer profile");
      });

    } catch (error: any) {


      throw new Error(
        error.message || "Database error while updating lawyer profile."
      );
    }
  }

  async changePassword(id: string, oldPass: string, newPass: string): Promise<void> {
    try {
      const lawyer = await LawyerModel.findOne({ userId: id }).populate("userId");
      if (!lawyer) throw new Error('Lawyer not found');

      const user: any = lawyer.userId;
      if (!user) throw new Error('User not found');

      const match = await bcrypt.compare(oldPass, user.password);
      if (!match) throw new Error('Incorrect old password');

      user.password = await bcrypt.hash(newPass, 10);
      await user.save();
    } catch (error: any) {
      throw new Error('changePassword failed: ' + (error.message || error));
    }
  }



  async getSingleLawyer(id: string): Promise<Lawyer> {

    try {
      if (!id) {
        throw new Error("Invalid ID: ID not provided");
      }

      const doc = await LawyerModel.findOne({userId:id})
        .populate({
          path: "userId",
          select: "name email phone role isBlock",
        })
        .exec();
      if (!doc) {
        throw new Error(`Lawyer with ID ${id} not found`);
      }



      return {
        id: (doc._id as Types.ObjectId).toString(),
        userId: (doc.userId as any)._id.toString(),
        barNumber: doc.barNumber,
        barAdmissionDate: doc.barAdmissionDate,
        yearsOfPractice: doc.yearsOfPractice,
        practiceAreas: doc.practiceAreas,
        languages: doc.languages,
        documentUrls: doc.documentUrls,

        addresses: doc.Address || {
          address: "",
          city: "",
          state: "",
          pincode: 0,
        },

        verificationStatus: doc.verificationStatus,
        isVerified: doc.isAdminVerified,

        user: {
          name: (doc.userId as any).name,
          email: (doc.userId as any).email,
          phone: (doc.userId as any).phone,
          isBlock: (doc.userId as any).isBlock,
        },

        profileImage: doc.Profileimageurl || "",
        bio: doc.bio || "",
      };

    } catch (error: any) {


      throw new Error(
        error.message || "Database error while fetching lawyer profile."
      );
    }
  }


async findOne(userId: string): Promise<string | null> {
  try {
    const lawyer = await LawyerModel.findOne({ userId });
    return lawyer?._id?.toString() || null;
  } catch (error) {
    console.error("Error fetching lawyer:", error);
    return null;
  }
}




}
