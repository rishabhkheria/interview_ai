import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, updateProfile } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return { success: true, message: data?.message };
    } catch (err) {
      setUser(null);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password, firstName, lastName }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password, firstName, lastName });
      setUser(data.user);
      return { success: true, message: data?.message };
    } catch (err) {
      setUser(null);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await updateProfile(data);
      setUser(res.user);
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    
  return { user, loading, handleLogin, handleRegister, handleLogout, handleUpdateProfile };
};
