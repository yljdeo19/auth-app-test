import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogout, apiProfile, UserProfile } from '../api';

interface LoginRecord {
  id: number;
  email: string;
  timestamp: string;
}

function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Профиль для приветствия
    apiProfile()
      .then(profile => {
        if (profile) setUser(profile);
      })
      .catch(() => {});

    // Простые мок-данные для таблицы последних логинов
    const now = new Date();
    const records: LoginRecord[] = [];

    for (let i = 0; i < 10; i++) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      records.push({
        id: i + 1,
        email: 'test@example.com',
        timestamp: d.toLocaleString()
      });
    }

    setLogins(records);
  }, []);

  const handleLogout = async () => {
    await apiLogout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Добро пожаловать{user ? `, ${user.email}` : ''}!</h1>
          <p className="page-subtitle">
            Это домашняя страница, доступная только авторизованным пользователям.
          </p>
        </div>
        <button className="btn-outline" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <section className="card">
        <h2 className="card-title">Последние логины (пример)</h2>
        <p className="card-subtitle">
          Здесь показаны последние 10 логинов пользователей с отметкой времени.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Время входа</th>
              </tr>
            </thead>
            <tbody>
              {logins.map(record => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.email}</td>
                  <td>{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
