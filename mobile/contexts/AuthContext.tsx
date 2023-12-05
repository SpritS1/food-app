import axios, { HttpStatusCode } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextProps {
  authToken: string | null;
  login: (values: LoginValues) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const tokenFromStorage = await SecureStore.getItemAsync("authToken");
        setAuthToken(tokenFromStorage);
      } catch (error) {
        console.error("Error retrieving auth token:", error);
      }
    };

    getAuthToken();
  }, []);

  const login = async (values: LoginValues) => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/auth/login`,
        values
      );
      console.log(response.data);

      if (response.status !== HttpStatusCode.Ok) return;

      setAuthToken(response.data.authToken);
      await SecureStore.setItemAsync("authToken", response.data.authToken);
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  const register = async (values: RegisterValues) => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/auth/register`,
        values
      );

      console.log(response.data);
    } catch (error) {
      console.error("Account register failed", error);
    }
  };

  const logout = async () => setAuthToken(null);

  const contextValue: AuthContextProps = {
    authToken,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
