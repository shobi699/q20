import React, { useState } from 'react';
import { supabase } from '../lib/supabase/client';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('ثبت‌نام موفقیت‌آمیز بود! لطفاً ایمیل خود را برای تایید حساب کاربری بررسی کنید.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('ایمیل یا رمز عبور نامعتبر است.');
      }
      // On success, the onAuthStateChange listener in useAuth will handle the redirect.
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <p className="text-center text-green-400">{message}</p>}
        {error && <p className="text-center text-error">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-on-surface/80">ایمیل</label>
          <input
            id="email"
            className="w-full mt-1 p-2 bg-background border border-on-surface/20 rounded-md focus:ring-primary focus:border-primary"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-on-surface/80">رمز عبور</label>
          <input
            id="password"
            className="w-full mt-1 p-2 bg-background border border-on-surface/20 rounded-md focus:ring-primary focus:border-primary"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-on-primary font-semibold rounded-md hover:bg-primary-variant disabled:bg-gray-500"
          >
            {loading ? 'در حال پردازش...' : (isSignUp ? 'ثبت‌نام' : 'ورود')}
          </button>
        </div>
      </form>
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError('');
          setMessage('');
        }}
        className="w-full text-center text-sm text-primary hover:underline mt-4"
      >
        {isSignUp ? 'حساب کاربری دارید؟ وارد شوید' : 'حساب کاربری ندارید؟ ثبت‌نام کنید'}
      </button>
    </div>
  );
};

export default AuthForm;