import React, { useState } from 'react';
import { supabase } from '../lib/supabase/client';

const AuthForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (signInError) {
      setError('خطا در ارسال لینک ورود. لطفا ایمیل خود را بررسی کنید.');
      console.error('Sign in error:', signInError.message);
    } else {
      setMessage('لینک ورود به ایمیل شما ارسال شد. لطفا صندوق ورودی خود را بررسی کنید.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-lg shadow-lg text-center animate-fade-in">
      <h1 className="text-2xl font-bold text-primary">ورود یا ثبت‌نام</h1>
      <p className="text-on-surface/80">
        برای شروع بازی، ایمیل خود را وارد کنید. یک لینک جادویی برایتان ارسال می‌شود.
      </p>
      
      {message ? (
        <div className="p-3 text-center bg-green-500/20 text-green-400 rounded-md">{message}</div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              ایمیل
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-on-surface/20 rounded-md placeholder-on-surface/50 focus:ring-primary focus:border-primary"
              placeholder="آدرس ایمیل شما"
            />
          </div>

          {error && <div className="p-3 text-center bg-error/20 text-error rounded-md">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-on-primary bg-primary hover:bg-primary-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-500"
            >
              {loading ? 'در حال ارسال...' : 'ارسال لینک جادویی'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
