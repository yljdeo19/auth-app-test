import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiProfile, UserProfile } from './api';

type Props = {
  children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const profile = await apiProfile();
        if (!cancelled) {
          if (!profile) {
            navigate('/auth', { replace: true, state: { from: location } });
          } else {
            setUser(profile);
          }
        }
      } catch {
        if (!cancelled) {
          navigate('/auth', { replace: true, state: { from: location } });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="center-screen">
        <div className="card">
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Передадим пользователя детям через контекст при желании.
  return <>{children}</>;
}

export default ProtectedRoute;
