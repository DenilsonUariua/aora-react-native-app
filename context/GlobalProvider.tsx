import { getCurrentUser } from "@/lib";
import { TUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext({
  isLoading: true,
  user: {} as TUser | null,
  isLoggedIn: false,
  setUser: (val: any) => {},
  setIsLoading: (val: boolean) => {},
  setIsLoggedIn: (val: boolean) => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("I ram");

    getCurrentUser()
      .then((res) => {
        console.log("user fpimf", res);

        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Global user Error: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
