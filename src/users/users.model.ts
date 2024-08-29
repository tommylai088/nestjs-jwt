import * as mongoose from "mongoose"
export const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      uniqur: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    activated: {
      type: Number,
      required: false,
    },
    token: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
)

export interface User extends mongoose.Document {
  _id: string;
  userId: string;
  username: string;
  password: string;
  email: string;
  activated: number;
  token: string;
}