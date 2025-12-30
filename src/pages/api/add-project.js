import express from "express";
import mongoose from "mongoose";
const router = express.Router();

// Project Schema
const ProjectSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

// Middleware to ensure DB connection
async function ensureDB(req, res, next) {
  if (!mongoose.connection.readyState) {
    console.log("🔌 DB not connected, connecting...");
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ DB connected");
    } catch (err) {
      console.error("❌ DB connection error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  next();
}

router.use(ensureDB);

// GET /api/add-project – fetch all projects
router.get("/", async (req, res) => {
  console.log("📥 GET /api/add-project called");
  try {
    const projects = await Project.find();
    console.log(`📊 Projects fetched: ${projects.length}`); // ✅ FIXED
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/add-project – create new project
router.post("/", async (req, res) => {
  console.log("📥 POST /api/add-project called");
  console.log("📦 Incoming data:", req.body);
  try {
    const project = await Project.create(req.body);
    console.log("✅ Project created:", project._id);
    res.status(201).json({ success: true, project });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;