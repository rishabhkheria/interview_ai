import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ye reload ke time loading dikhayega.. suppose login krke home page aa gye ab reload maare to loading dikhayega, kyuki reload maarne pe initial null value pe set ho jayega chiz.. iske baad useEffect aur getMe use krke iska logged in user retrive krke home page pr le aayenge isko waapas.. ye chiz hooks mei add krdenge //development ke time false, production ke time true

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
