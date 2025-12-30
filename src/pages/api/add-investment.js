import "../../index"; // make sure this connects to MongoDB
import Investment from "../../models/Investment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Received investment data:", req.body);

    const investment = await Investment.create(req.body);

    console.log("Investment saved:", investment);

    res.status(201).json({ success: true, investment });
  } catch (err) {
    console.error("Error saving investment:", err);
    res.status(500).json({ error: err.message });
  }
}
