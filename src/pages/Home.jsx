import Header from "../components/Header";
import AnimatedBanners from "../components/AnimatedBanners";
import RegisterForm from "../components/RegisterForm";
import InfoSection from "../components/InfoSection";
import AdsSection from "../components/AdsSection";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <AnimatedBanners />
      <RegisterForm/>
      <InfoSection/>
      <AdsSection/>
      <Footer/>
      
    </div>
  );
}
