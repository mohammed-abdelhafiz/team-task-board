import { UserRole } from "@/constants/enums";
import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const transform = (_doc: IUser, ret: Partial<IUser> & { __v?: number }) => {
  delete ret.password;
  delete ret.__v;
  return ret;
};

userSchema.set("toObject", { transform });
userSchema.set("toJSON", { transform });

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
