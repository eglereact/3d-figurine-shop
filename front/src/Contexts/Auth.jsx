import { createContext, useCallback, useState } from "react";

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("figurineUser");
    return user ? JSON.parse(user) : null;
  });

  const addUser = useCallback((user) => {
    setUser(user);
    localStorage.setItem("figurineUser", JSON.stringify(user));
  }, []);

  const removeUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("figurineUser");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        addUser,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
