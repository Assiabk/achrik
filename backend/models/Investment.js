import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    fullName: String,
    companyName: String,
    companyType: String,
    registrationNumber: String,
    idCardFile: String,
    otherFiles: String,
    companyLocation: String,
    project: String,
    shares: Number,
    totalValue: Number,
    paymentReceipt: String,
  },
  { timestamps: true }
);

const Investment = mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);

export default Investment;
