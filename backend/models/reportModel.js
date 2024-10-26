import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    video: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "disapproved"],
      default: "pending",
    },

    schoolLocation: { type: String },
    issueType: { type: String },
    description: { type: String },
    comment: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    privacyPreference: {
      type: String,
      enum: ["public", "anonymous"],
      default: "public",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from schoolName
reportSchema.pre("save", async function (next) {
  if (this.isModified("schoolName") || !this.slug) {
    let baseSlug = this.schoolName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // Check for duplicate slugs
    const existingReport = await this.constructor.findOne({ slug: baseSlug });

    if (existingReport) {
      let counter = 1;
      while (
        await this.constructor.findOne({ slug: `${baseSlug}-${counter}` })
      ) {
        counter++;
      }
      this.slug = `${baseSlug}-${counter}`;
    } else {
      this.slug = baseSlug;
    }
  }
  next();
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
