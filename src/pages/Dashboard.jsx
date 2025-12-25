import DashboardLayout from "../layouts/DashboardLayout";
import ProjectsList from "../components/ ProjectsList";
export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">المشاريع المعروضة للتمويل</h1>
      <ProjectsList />
    </DashboardLayout>
  );
}
