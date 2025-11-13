import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      }
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div className={styles.container}>
      <div>
        {/* Logo */}
        <div className={styles.logo}>
          <h1>TaskFlow!!!!</h1>
          <p>Manage your projects beautifully</p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <h2 className={styles.title}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="xxx@example.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className={styles.switchBtn}
            >
              {isRegister ? 'Sign in' : 'Register'}
            </button>
          </p>

          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>

          <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`} className={styles.googleBtn}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>
        </div>

        <p className={styles.footer}>
          © 2025 TaskFlow. Made with ❤️ by Khushi
        </p>
      </div>
    </div>
  );
}