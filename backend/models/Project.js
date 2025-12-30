import mongoose from "mongoose";
// Project Schema
const projectSchema = new mongoose.Schema(
  {
    projectName: String,
    sector: String,
    type: String,
    companyName: String,
    companyType: String,
    location: String,
    product: String,
    cost: Number,
    personalAmount: Number,
    workers: String,
    clients: String,
    expectedClients: Number,
    competitors: Number,
    requirements: String,
    branches: Number,
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

// Add project route
app.post("/api/projects", async (req, res) => {
  try {
    console.log("📦 Adding new project:", req.body);
    const newProject = await Project.create(req.body);
    console.log("✅ Project saved:", newProject._id);
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("❌ Error saving project:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
