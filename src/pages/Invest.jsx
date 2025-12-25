import DashboardLayout from "../layouts/DashboardLayout";

export default function Invest() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">مساهمة / استثمار</h1>

      <form className="bg-white p-8 rounded-3xl shadow-xl space-y-6 max-w-4xl mx-auto">
        {/* الاسم واللقب */}
        <input
          type="text"
          placeholder="الاسم واللقب"
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

        {/* السجل التجاري */}
        <input
          type="text"
          placeholder="السجل التجاري"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* نسخة من بطاقة التعريف */}
        <label className="block text-gray-600 font-semibold">نسخة من بطاقة التعريف</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* رفع ملفات وشروط مالية */}
        <label className="block text-gray-600 font-semibold">
          نسخة من الملفات وشروط الملاءمة المطلوبة
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* محل المؤسسة */}
        <input
          type="text"
          placeholder="محل المؤسسة (إذا كانت مؤسسة اقتصادية)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* اختيار المشروع */}
        <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
          <option>اختر المشروع الذي ترغب في المساهمة فيه</option>
          <option>مشروع 1</option>
          <option>مشروع 2</option>
          <option>مشروع 3</option>
        </select>

        {/* عدد الأسهم */}
        <input
          type="number"
          placeholder="عدد الأسهم التي ترغب بشرائها"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* قيمة الأسهم (تظهر تلقائياً بناءً على عدد الأسهم) */}
        <input
          type="text"
          placeholder="قيمة المساهمة الإجمالية (تحسب تلقائياً)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed"
          disabled
        />

        {/* وصل تحويل الأموال */}
        <label className="block text-gray-600 font-semibold">وصل تحويل الأموال إلى الحساب البنكي الخاص بالمشروع</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        {/* Submit button */}
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300">
          إرسال الطلب
        </button>
      </form>
    </DashboardLayout>
  );
}
