import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaFilePdf, FaDownload, FaProjectDiagram, FaMoneyCheckAlt } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Projects data
const projects = [
  {
    id: 1,
    title: "مشروع صناعة الحليب",
    description: "مشروع فلاحي لإنتاج وتوزيع الحليب.",
    daysLeft: 25,
    budget: "500,000 د.ج",
    status: "نشط",
    owner: "مالك 1",
    progress: 65
  },
  {
    id: 2,
    title: "شركة خدمات رقمية",
    description: "منصة رقمية للشركات الناشئة.",
    daysLeft: 12,
    budget: "300,000 د.ج",
    status: "نشط",
    owner: "مالك 2",
    progress: 85
  },
  {
    id: 3,
    title: "مشروع تجاري صغير",
    description: "متجر إلكتروني لتسويق المنتجات المحلية.",
    daysLeft: 18,
    budget: "150,000 د.ج",
    status: "مكتمل",
    owner: "مالك 3",
    progress: 100
  },
];

const investors = [
  { id: 1, investment: "200,000 د.ج", projects: 2 },
  { id: 2, investment: "150,000 د.ج", projects: 1 },
  { id: 3, investment: "300,000 د.ج", projects: 3 },
];

const stats = [
  { title: "إجمالي المشاريع", value: projects.length, color: "from-emerald-500 to-emerald-600" },
  { title: "مكتملة", value: projects.filter(p => p.status === "مكتمل").length, color: "from-amber-500 to-amber-600" },
  { title: "نشطة", value: projects.filter(p => p.status === "نشط").length, color: "from-blue-500 to-blue-600" },
  { title: "المستثمرين", value: investors.length, color: "from-violet-500 to-violet-600" },
];

export default function ProjectsList() {
  // Chart Data with minimal curve
  const chartData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو"],
    datasets: [
      {
        label: "المشاريع",
        data: [3, 2, 5, 4, 6],
        fill: false,
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        borderWidth: 3,
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.1, // Minimal curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10B981',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
        }
      }
    },
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('ar-EG');
    
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text("تقرير المشاريع", doc.internal.pageSize.width / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`تاريخ: ${date}`, doc.internal.pageSize.width / 2, 35, { align: 'center' });
    
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(20, 40, doc.internal.pageSize.width - 20, 40);
    
    doc.autoTable({
      startY: 45,
      head: [['المشروع', 'الحالة', 'الميزانية', 'التقدم']],
      body: projects.map(p => [p.title, p.status, p.budget, `${p.progress}%`]),
      theme: 'striped',
      styles: { 
        font: 'helvetica', 
        fontSize: 10, 
        textAlign: 'right',
        cellPadding: 5,
      },
      headStyles: { 
        fillColor: [16, 185, 129], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
    });
    
    doc.save(`مشاريع-${date}.pdf`);
  };

  const exportProjects = () => {
    const doc = new jsPDF();
    doc.text("المشاريع", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['المشروع', 'الحالة', 'الميزانية', 'التقدم']],
      body: projects.map(p => [p.title, p.status, p.budget, `${p.progress}%`]),
    });
    doc.save('المشاريع.pdf');
  };

  const exportInvestors = () => {
    const doc = new jsPDF();
    doc.text("المستثمرين", 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['المستثمر', 'الإستثمار', 'المشاريع']],
      body: investors.map((inv, i) => [`مستثمر ${i + 1}`, inv.investment, inv.projects]),
    });
    doc.save('المستثمرين.pdf');
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">المشاريع</h1>
            <p className="text-gray-600 text-sm">عرض وإدارة جميع المشاريع</p>
          </div>
          
          <button
            onClick={generatePDF}
            className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaDownload className="text-lg" />
            <span>تنزيل PDF</span>
          </button>
        </div>

        {/* Stats Cards - Premium */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden relative"
            >
              <div className="p-6 relative z-10">
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 block mb-1">{stat.value}</span>
                  <span className="text-gray-600 text-sm font-medium">{stat.title}</span>
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${stat.color} transition-all duration-300 group-hover:h-1.5`}></div>
              <div className={`absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-r ${stat.color} opacity-5 rounded-full`}></div>
            </div>
          ))}
        </div>

        {/* Chart Card - Premium */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">نمو المشاريع</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">المشاريع الجديدة</span>
            </div>
          </div>
          <div className="h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Download - Premium */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">خيارات التنزيل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button
              onClick={exportProjects}
              className="group bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all duration-300">
                  <FaProjectDiagram className="text-2xl text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">المشاريع</div>
                  <div className="text-sm text-gray-600">{projects.length} مشروع</div>
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <FaDownload className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </button>
            
            <button
              onClick={exportInvestors}
              className="group bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center group-hover:from-violet-200 group-hover:to-violet-100 transition-all duration-300">
                  <FaMoneyCheckAlt className="text-2xl text-violet-600" />
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">المستثمرين</div>
                  <div className="text-sm text-gray-600">{investors.length} مستثمر</div>
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                <FaDownload className="text-gray-400 group-hover:text-violet-600 transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* Projects Grid - Premium */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-5">المشاريع الحالية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    project.status === 'نشط' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{project.daysLeft} يوم</span>
                </div>
                
                {/* Project Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">{project.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                {/* Progress Bar - Minimal Curve */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>التقدم</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        project.status === 'نشط' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">الميزانية:</span>
                    <span className="font-semibold text-gray-900">{project.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">المالك:</span>
                    <span className="font-semibold text-gray-900">{project.owner}</span>
                  </div>
                </div>
                
                {/* Bottom Border Effect */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1.5 group/btn">
                    <span>عرض التفاصيل</span>
                    <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}