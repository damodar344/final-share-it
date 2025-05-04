import mongoose, { Schema } from "mongoose";

// User Schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Profile Schema
const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userType: {
    type: String,
    enum: ["Student", "University Staff"],
    required: true,
  },
  academicLevel: {
    type: String,
    enum: ["Undergraduate", "Graduate", "PhD"],
    default: "Undergraduate",
  },
  gender: {
    type: String,
    enum: ["Female", "Male", "Non-Binary"],
    required: true,
  },
  ageGroup: { type: String, enum: ["18-21", "22-25", "25+"], required: true },
  studySchedule: {
    type: String,
    enum: ["Morning Person", "Night Owl", "Flexible"],
    default: "Flexible",
  },
  socializingPreference: {
    type: String,
    enum: ["Enjoys hanging out", "I prefer my privacy", "A mixture of both"],
    default: "A mixture of both",
  },
  tidiness: { type: Number, min: 1, max: 5, default: 3 },
  drinkingPreference: {
    type: String,
    enum: ["Yes", "No", "Occasionally"],
    default: "No",
  },
  smokingPreference: {
    type: String,
    enum: ["Yes", "No", "Occasionally"],
    default: "No",
  },
  hobbies: [{ type: String }],
});

// Listing Schema
const listingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accommodationType: { type: String, enum: ["Single room", "Entire Unit"] },
  privateBathroom: { type: String, enum: ["Yes", "No, Shared"] },
  rent: { type: String },
  utilityIncluded: { type: Boolean, default: false },
  amenities: [{ type: String }],
  distanceFromCampus: { type: String },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ["draft", "active", "inactive"],
    default: "draft",
  },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Preferences Schema
const preferencesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  preferences: [{ type: String }],
  guestPreference: { type: Number, min: 1, max: 5 },
  additionalPreference: { type: String },
});

// Contact Info Schema
const contactInfoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  phone: { type: String },
  email: { type: String },
  preferredContact: { type: String, enum: ["Email", "Phone No."] },
});

// VerificationToken Schema
const verificationTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Initialize models
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
export const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
export const Preferences =
  mongoose.models.Preferences ||
  mongoose.model("Preferences", preferencesSchema);
export const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model("ContactInfo", contactInfoSchema);
export const VerificationToken = 
  mongoose.models.VerificationToken || 
  mongoose.model("VerificationToken", verificationTokenSchema);
