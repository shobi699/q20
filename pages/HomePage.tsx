import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';

// SVG Icons (re-use existing ones for brevity)
const IconLightbulb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const IconLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconTrophy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l3-3 3 3v13m-6 0h6m-3-4.5a.5.5 0 11-1 0 .5.5 0 011 0zM12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);
const IconBrain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.25l1.75-1.75a2.5 2.5 0 013.536 0l1.75 1.75M9.5 14.25v2.5a2.5 2.5 0 002.5 2.5h0a2.5 2.5 0 002.5-2.5v-2.5m-5 0l1.75-1.75a2.5 2.5 0 013.536 0l1.75 1.75m-5 0L6.25 12.5a2.5 2.5 0 010-3.536l1.75-1.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
  </svg>
);
const IconChartBar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const IconSparkles = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.125 18l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.375 18l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

const HomePage: React.FC = () => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-20">
      
      <div className="w-full max-w-md mx-auto">
        {user ? (
          <div className="p-8 space-y-6 bg-surface rounded-lg shadow-lg text-center animate-fade-in">
             <h1 className="text-3xl font-bold text-primary">خوش آمدی، {profile?.username || 'خلاق'}!</h1>
             <p className="text-on-surface/80">
               آماده‌ای برای یک چالش جدید؟
             </p>
             <div className="pt-4">
               <Link 
                 to="/play" 
                 className="w-full block py-3 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant transition-colors text-lg"
               >
                 شروع بازی
               </Link>
             </div>
           </div>
        ) : (
          <AuthForm />
        )}
      </div>

      {/* How to Play Section */}
      <div className="w-full max-w-5xl mt-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">چگونه بازی کنیم؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconLightbulb />
            <h3 className="text-xl font-semibold mt-4 mb-2">۱. هدف بگیرید</h3>
            <p className="text-on-surface/70">بازی با یک کلمه شروع می‌شود: «کاغذ».</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconLink />
            <h3 className="text-xl font-semibold mt-4 mb-2">۲. نابود کنید</h3>
            <p className="text-on-surface/70">یک کلمه برای نابود کردن آن بگویید. مثلا «آتش».</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconCheckCircle />
            <h3 className="text-xl font-semibold mt-4 mb-2">۳. زنجیره بسازید</h3>
            <p className="text-on-surface/70">پاسخ شما هدف بعدی می‌شود. حالا «آتش» را نابود کنید!</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconTrophy />
            <h3 className="text-xl font-semibold mt-4 mb-2">۴. امتیاز کمیاب بگیرید</h3>
            <p className="text-on-surface/70">پاسخ‌های خلاقانه و کمیاب، امتیاز بیشتری دارند.</p>
          </div>
        </div>
      </div>

      {/* Why Play Section */}
      <div className="w-full max-w-5xl mt-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">چرا بازی کنیم؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-surface/50 p-6 rounded-lg text-center">
              <IconBrain />
              <h3 className="text-xl font-semibold mt-4 mb-2">تقویت خلاقیت</h3>
              <p className="text-on-surface/70">ذهن خود را برای یافتن ارتباطات غیرمنتظره به چالش بکشید.</p>
           </div>
           <div className="bg-surface/50 p-6 rounded-lg text-center">
              <IconChartBar />
              <h3 className="text-xl font-semibold mt-4 mb-2">رقابت کنید</h3>
              <p className="text-on-surface/70">برای کسب بالاترین امتیاز تلاش کنید و در جدول امتیازات بالا بروید.</p>
           </div>
           <div className="bg-surface/50 p-6 rounded-lg text-center">
              <IconSparkles />
              <h3 className="text-xl font-semibold mt-4 mb-2">ساده و سرگرم‌کننده</h3>
              <p className="text-on-surface/70">یک سرگرمی جذاب برای اوقات فراغت که به راحتی می‌توانید یاد بگیرید.</p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
