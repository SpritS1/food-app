import axios, { AxiosError, HttpStatusCode } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { AccountType, AuthResponse } from "../../shared/dist/src/types";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import AuthTokenPayload from "../../shared/dist/src/types/AuthTokenPayload";

interface AuthContextProps {
  authToken: string | null;
  login: (values: LoginValues) => Promise<boolean>;
  register: (values: RegisterValues) => Promise<boolean>;
  logout: () => Promise<void>;
  checkEmail: (email: string, accountType: AccountType) => Promise<boolean>;
  userData: AuthTokenPayload | null;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export interface LoginValues {
  email: string;
  password: string;
  accountType?: AccountType;
}

export interface RegisterValues {
  email: string;
  password: string;
  accountType?: AccountType;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthTokenPayload | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const setTokenStates = (token: string) => {
    console.log(`Setting token states to ${token}`);
    setAuthToken(token);
    setUserData(jwtDecode<AuthTokenPayload>(token));
  };

  const clearTokenStates = () => {
    console.log("Clearing token states");
    setAuthToken(null);
    setUserData(null);
  };
  const saveAuthToken = async (token: string) => {
    try {
      setTokenStates(token);
      await SecureStore.setItemAsync("authToken", token);
    } catch (error) {
      console.error("Error saving auth token:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenFromStorage = await SecureStore.getItemAsync("authToken");
        if (tokenFromStorage) {
          setTokenStates(tokenFromStorage);
        }
      } catch (error) {
        console.error("Error initializing auth token:", error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Set the Authorization header for all requests
  axios.interceptors.request.use(
    (config) => {
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  const checkEmail: (
    email: string,
    accountType: AccountType
  ) => Promise<boolean> = async (email: string, accountType: AccountType) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/check-email`,
        {
          params: {
            email,
            accountType,
          },
        }
      );

      const isAccountCreated = response.data;

      return isAccountCreated;
    } catch (error) {
      console.error("Email check failed", error);

      alert(
        "An error occurred while checking the email. Please try again later."
      );

      return false;
    }
  };

  const login: (values: LoginValues) => Promise<boolean> = async (
    values: LoginValues
  ) => {
    try {
      const response = await axios.post<AuthResponse>(`/auth/login`, values);
      console.log(response);
      if (response.status !== HttpStatusCode.Ok) {
        alert("Sign-in failed. Please try again.");
        return false;
      }

      setTokenStates(response.data.access_token);
      saveAuthToken(response.data.access_token);
      return true;
    } catch (error) {
      console.error("Sign-in failed", error);
      alert("Sign-in failed. Please try again.");
      return false;
    }
  };

  // Dodać zwracanie wartosci boolean i obsluzyc bledy na froncie
  const register: (values: RegisterValues) => Promise<boolean> = async (
    values
  ) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        values
      );

      if (response.status === HttpStatusCode.Created) {
        saveAuthToken(response.data.access_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Account register failed", error);
      alert(`Account register failed. Please try again`);
      return false;
    }
  };

  const logout = async () => {
    clearTokenStates();
    await SecureStore.deleteItemAsync("authToken");
  };

  const contextValue: AuthContextProps = {
    authToken,
    userData,
    initialized,
    login,
    logout,
    register,
    checkEmail,
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
