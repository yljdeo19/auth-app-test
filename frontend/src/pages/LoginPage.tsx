import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiLogin } from '../api';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setSubmitError('');

    if (!email) {
      setEmailError('Введите email');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Неверный формат email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Введите пароль');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await apiLogin(email, password);

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Неверный email или пароль';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="card">
        <h1 className="card-title">Вход</h1>
        <p className="card-subtitle">
          Введите свои данные, чтобы продолжить
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={emailError ? 'input input-error' : 'input'}
              placeholder="you@example.com"
            />
            {emailError && <div className="error-text">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={passwordError ? 'input input-error' : 'input'}
              placeholder="••••••••"
            />
            {passwordError && <div className="error-text">{passwordError}</div>}
          </div>

          {submitError && (
            <div className="error-banner">{submitError}</div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
