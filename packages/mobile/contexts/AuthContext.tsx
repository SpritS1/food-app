import axios, { HttpStatusCode } from "axios";
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
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  checkEmail: (email: string, accountType: AccountType) => Promise<boolean>;
  getUserData: () => AuthTokenPayload | null;
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

  const getUserData = () => {
    if (!authToken) return null;
    return jwtDecode<AuthTokenPayload>(authToken);
  };

  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const tokenFromStorage = await SecureStore.getItemAsync("authToken");
        setAuthToken(tokenFromStorage);
        console.log(`Token from storage: ${tokenFromStorage}`);
      } catch (error) {
        console.error("Error retrieving auth token:", error);
      }
    };

    getAuthToken();
  }, []);

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

  const saveAuthToken = async (token: string) => {
    try {
      setAuthToken(token);
      await SecureStore.setItemAsync("authToken", token);
    } catch (error) {
      console.error("Error saving auth token:", error);
    }
  };

  const login: (values: LoginValues) => Promise<Boolean> = async (
    values: LoginValues
  ) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        values
      );

      if (response.status !== HttpStatusCode.Ok) {
        alert("Sign-in failed. Please try again.");
        return false;
      }

      saveAuthToken(response.data.token);
      return true;
    } catch (error) {
      console.error("Sign-in failed", error);
      alert("Sign-in failed. Please try again.");
      return false;
    }
  };

  const register = async (values: RegisterValues) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        values
      );

      if (response.status === HttpStatusCode.Created) {
        saveAuthToken(response.data.accessToken);
      }
    } catch (error) {
      console.error("Account register failed", error);
      alert("Account register failed. Please try again.");
    }
  };

  const logout = async () => setAuthToken(null);

  const contextValue: AuthContextProps = {
    authToken,
    login,
    logout,
    register,
    checkEmail,
    getUserData,
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
