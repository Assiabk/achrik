import DashboardLayout from "../layouts/DashboardLayout";

export default function AddProject() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">إضافة مشروع</h1>

      <form className="bg-white p-8 rounded-3xl shadow-xl space-y-6 max-w-4xl mx-auto">
        {/* اسم المشروع */}
        <input
          type="text"
          placeholder="اسم المشروع أو الشعار المقترح"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* قطاع المشروع */}
        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          <option>اختر قطاع المشروع</option>
          <option>فلاحي</option>
          <option>صناعي</option>
          <option>تجاري</option>
          <option>خدماتي</option>
        </select>

        {/* نوع المشروع */}
        <input
          type="text"
          placeholder="نوع المشروع (مثال: صناعة الحليب)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* اسم الشركة أو المؤسسة */}
        <input
          type="text"
          placeholder="اسم الشركة أو المؤسسة (إذا كانت مؤسسة اقتصادية)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* نوع المؤسسة */}
        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          <option>نوع المؤسسة</option>
          <option>شخص طبيعي</option>
          <option>شركة مساهمة (SPA)</option>
          <option>شركة محدودة المسؤولية (SARL)</option>
        </select>

        {/* محل المؤسسة */}
        <input
          type="text"
          placeholder="محل المؤسسة (إن وجدت)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* اسم المنتوج أو الخدمة */}
        <input
          type="text"
          placeholder="اسم المنتج أو الخدمة التي يقدمها المشروع"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* تكلفة المشروع */}
        <input
          type="number"
          placeholder="تكلفة المشروع (≤ 20,000,000 دج)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* المبلغ الشخصي */}
        <input
          type="number"
          placeholder="المبلغ الشخصي المتاح للاستثمار (إن وجد)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* عدد العمال ومهامهم */}
        <textarea
          placeholder="عدد العمال المطلوب ومهام كل عامل"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* الزبائن المستهدفون */}
        <input
          type="text"
          placeholder="من يهتم بشراء منتجك أو الخدمة"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* عدد الزبائن المتوقع */}
        <input
          type="number"
          placeholder="عدد الزبائن المتوقع"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* عدد المنافسين */}
        <input
          type="number"
          placeholder="عدد المنافسين إن وجد"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* متطلبات إضافية */}
        <textarea
          placeholder="متطلبات أخرى يحتاجها المشروع"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* رفع شهادات */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* عدد الفروع */}
        <input
          type="number"
          placeholder="عدد الفروع الموجودة للمشروع"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* رفع دراسة اقتصادية */}
        <input
          type="file"
          accept=".pdf"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* رفع ملفات وشروط مالية */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* Submit button */}
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300">
          إرسال المشروع
        </button>
      </form>
    </DashboardLayout>
  );
}
