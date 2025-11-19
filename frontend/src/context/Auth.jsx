import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  userAuth: { firstName: null },
  loading: false,
  authenticate: () => {},
  login: async () => {}
});

export function AuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState({ firstName: null });
  const [loading, setLoading] = useState(true);

  // Try to restore auth on first load
  const authenticate = async () => {
    setLoading(true);
    try {
      // ...call your API (e.g. /api/me) or read from localStorage
      // Example with localStorage:
      const stored = localStorage.getItem("userAuth");
      if (stored) {
        setUserAuth(JSON.parse(stored));
      }
    } catch (e) {
      setUserAuth({ firstName: null });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // ...call your login API here
      // Fake minimal example:
      const user = { firstName: "User", email };
      setUserAuth(user);
      localStorage.setItem("userAuth", JSON.stringify(user));
      return true;
    } catch (e) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ userAuth, loading, authenticate, login }}>
      {children}
    </AuthContext.Provider>
  );
}