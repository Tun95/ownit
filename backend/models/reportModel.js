import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    slug: { type: String },
    images: [String],
    video: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "disapproved"],
      default: "pending",
    },

    schoolLocation: { type: String },
    issueType: [String],
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

//Virtual method to populate created product
reportSchema.virtual("reports", {
  ref: "Report",
  foreignField: "user",
  localField: "_id",
});

// Pre-save middleware to generate slug from schoolName
reportSchema.pre("save", async function (next) {
  if (this.isModified("schoolName") || !this.slug) {
    let baseSlug = this.schoolName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // If slug exists with the same baseSlug, append a counter
    const existingSlugs = await this.constructor
      .find({ slug: new RegExp(`^${baseSlug}(-\\d+)?$`, "i") })
      .select("slug");

    if (existingSlugs.length > 0) {
      const slugs = existingSlugs.map((doc) => doc.slug);
      let counter = 1;
      while (slugs.includes(`${baseSlug}-${counter}`)) {
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
