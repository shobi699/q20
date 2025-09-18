
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { GoogleGenAI } from '@google/genai';

// SVG Icons (Component-based for reusability and clarity)
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

const DemoGame: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setFeedback('');
    setSubmitted(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `شما داور بازی "زنجیره خلاقیت" هستید. کلمه شروع "ابر" است و کاربر کلمه "${answer}" را پیشنهاد داده است. یک بازخورد کوتاه (حداکثر 2 جمله)، خلاقانه و تشویق‌آمیز به زبان فارسی بنویس. در پایان، او را به تجربه کامل بازی دعوت کن.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setFeedback(response.text);
    } catch (error) {
      console.error("Error calling Gemini API", error);
      setFeedback("متاسفانه در حال حاضر امکان بررسی پاسخ شما وجود ندارد. لطفا وارد شوید و بازی اصلی را امتحان کنید!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-12 px-4" aria-live="polite">
      <div className="bg-surface p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">یک دور امتحان کنید!</h2>
        <p className="text-on-surface/70 mb-6">از کلمه «<span className="font-bold text-secondary text-xl">ابر</span>» شروع کنید و یک کلمه مرتبط بنویسید.</p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="کلمه شما..."
              className="flex-grow bg-background border border-on-surface/20 rounded-md p-3 text-lg text-center sm:text-right focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              disabled={loading}
              aria-label="Your associated word"
            />
            <button
              type="submit"
              disabled={loading || !answer.trim()}
              className="py-3 px-6 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant disabled:bg-gray-500 transition-colors"
            >
              {loading ? '...' : 'بررسی کن'}
            </button>
          </form>
        ) : (
          <div className="mt-4 text-center min-h-[150px] flex flex-col justify-center items-center">
             {loading ? (
                <div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4">در حال بررسی با هوش مصنوعی...</p>
                </div>
             ) : (
                <>
                  <p className="p-4 bg-background rounded-md text-on-surface/90 whitespace-pre-wrap animate-fade-in">{feedback}</p>
                  <Link 
                    to={user ? "/play" : "/"} 
                    onClick={() => !user && document.getElementById('email')?.focus()}
                    className="mt-6 inline-block py-3 px-8 bg-secondary text-on-secondary font-bold text-lg rounded-md hover:opacity-90 transition-opacity animate-fade-in"
                  >
                    {user ? 'شروع بازی کامل' : 'ورود و شروع بازی'}
                  </Link>
                </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-20">
      
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-lg shadow-lg text-center">
        {user ? (
          <>
            <h1 className="text-3xl font-bold text-primary">
              خوش آمدی, {profile?.username || user.email || 'کاربر'}!
            </h1>
            <p className="text-on-surface/80">
              آماده‌ای برای یک چالش جدید؟
            </p>
            <div className="pt-4">
              <Link 
                to="/play" 
                className="w-full block py-3 px-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-variant transition-colors"
              >
                شروع بازی
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary">به بازی زنجیرهٔ خلاقیت خوش آمدید!</h1>
            <p className="text-on-surface/80">
              برای شروع بازی، یک حساب کاربری بسازید یا وارد شوید.
            </p>
            <div className="pt-4">
              <AuthForm />
            </div>
          </>
        )}
      </div>

      <DemoGame />

      {/* How to Play Section */}
      <div className="w-full max-w-5xl mt-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">چگونه بازی کنیم؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconLightbulb />
            <h3 className="text-xl font-semibold mt-4 mb-2">۱. کلمه بگیرید</h3>
            <p className="text-on-surface/70">بازی با یک کلمه تصادفی شروع می‌شود.</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconLink />
            <h3 className="text-xl font-semibold mt-4 mb-2">۲. ارتباط بسازید</h3>
            <p className="text-on-surface/70">یک کلمه مرتبط با کلمه داده شده پیدا کنید.</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconCheckCircle />
            <h3 className="text-xl font-semibold mt-4 mb-2">۳. پاسخ دهید</h3>
            <p className="text-on-surface/70">کلمه خود را وارد کنید تا زنجیره ادامه یابد.</p>
          </div>
          <div className="bg-surface p-6 rounded-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
            <IconTrophy />
            <h3 className="text-xl font-semibold mt-4 mb-2">۴. امتیاز بگیرید</h3>
            <p className="text-on-surface/70">هرچه ارتباط خلاقانه‌تر باشد، امتیاز بیشتری دارد.</p>
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
              <h3 className="text-xl font-semibold mt-4 mb-2">رکورد خود را بشکنید</h3>
              <p className="text-on-surface/70">برای کسب بالاترین امتیاز تلاش کنید و بهترین عملکرد خود را ثبت کنید.</p>
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