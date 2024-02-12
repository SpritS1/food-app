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
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  authToken: string | null;
  login: (values: LoginValues) => Promise<boolean>;
  register: (values: RegisterValues) => Promise<boolean>;
  logout: () => Promise<void>;
  userData: AuthTokenPayload | null;
  initialized: boolean;
  accountType: AccountType | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export interface LoginValues {
  email: string;
  password: string;
  accountType: AccountType;
}

export interface RegisterValues {
  email: string;
  password: string;
  name: string;
  accountType?: AccountType;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<AuthTokenPayload | null>(null);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const setTokenStates = (token: string) => {
    setAuthToken(token);
    setUserData(jwtDecode<AuthTokenPayload>(token));
  };

  const clearTokenStates = () => {
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

  const saveAccountType = async (accountType: AccountType) => {
    try {
      await AsyncStorage.setItem("accountType", accountType);
      setAccountType(accountType);
    } catch (error) {
      console.error("Error saving account type:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenFromStorage = await SecureStore.getItemAsync("authToken");
        const accountTypeFromStorage = await AsyncStorage.getItem(
          "accountType"
        );

        if (tokenFromStorage) {
          setTokenStates(tokenFromStorage);
          await saveAccountType(accountTypeFromStorage as AccountType);
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

  const login: (values: LoginValues) => Promise<boolean> = async (
    values: LoginValues
  ) => {
    try {
      const response = await axios.post<AuthResponse>(`/auth/login`, values);

      if (response.status !== HttpStatusCode.Ok) {
        alert("Sign-in failed. Please try again.");
        return false;
      }

      setTokenStates(response.data.accessToken);
      await saveAuthToken(response.data.accessToken);
      await saveAccountType(values.accountType);

      return true;
    } catch (error) {
      console.error("Sign-in failed", error);
      alert("Sign-in failed. Please try again.");
      return false;
    }
  };

  const register: (values: RegisterValues) => Promise<boolean> = async (
    values
  ) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        values
      );

      if (response.status === HttpStatusCode.Created) {
        await saveAuthToken(response.data.accessToken);
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
    accountType,
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
