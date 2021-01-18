import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  // build: (attrs: UserAttrs) => UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// adding a helper to enforce type validation with typescript
// userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

// this will be executed when we call the save() function on a model instance
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.hash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

const UserModel = mongoose.model<UserDoc, UserModel>("User", userSchema);

export class User extends UserModel {
  constructor(attrs: UserAttrs) {
    super(attrs);
  }
}
