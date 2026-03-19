import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import API_BASE_URL from './K-Beauty/config';
import '@iconscout/react-unicons'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './K-Beauty/Components/Navbar';
import Footer from './K-Beauty/Components/Footer';
import Routing from './K-Beauty/routes/Routing';
import { SearchProvider } from './K-Beauty/SearchContext';
import { WishlistProvider } from './K-Beauty/context/WishlistContext';
import { CartProvider } from './K-Beauty/context/CartContext';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './K-Beauty/ScrollToTop';
import AuthPopup from './K-Beauty/Components/AuthPopup';
import WhatsAppButton from './K-Beauty/Components/WhatsAppButton';
export const loginStatus = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initial Load: Try to restore session
    const storedToken = localStorage.getItem("usertoken");
    const storedRefreshToken = localStorage.getItem("refreshtoken");

    if (storedToken) {
      setToken(storedToken);
      setLogin(true);

      axios.get(`${API_BASE_URL}/api/auth/getuser`, {
        headers: { "x-token": storedToken }
      })
        .then(res => setUser(res.data))
        .catch(async (err) => {
          if (err.response?.status === 401 && storedRefreshToken) {
            // Token expired, attempt refresh immediately
            try {
              const refreshRes = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { refreshToken: storedRefreshToken });
              const { token: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data;
              setToken(newAccessToken);
              localStorage.setItem("usertoken", newAccessToken);
              localStorage.setItem("refreshtoken", newRefreshToken);

              const userRes = await axios.get(`${API_BASE_URL}/api/auth/getuser`, { headers: { "x-token": newAccessToken } });
              setUser(userRes.data);
            } catch (refreshErr) {
              console.error("Session restoration failed:", refreshErr);
              localStorage.removeItem("usertoken");
              localStorage.removeItem("refreshtoken");
              setLogin(false);
            }
          }
        });
    }

    // 2. Setup Axios Interceptors
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const activeToken = localStorage.getItem("usertoken");
        if (activeToken) {
          config.headers['x-token'] = activeToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const currentRefreshToken = localStorage.getItem("refreshtoken");
          if (currentRefreshToken) {
            try {
              const res = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { refreshToken: currentRefreshToken });
              const { token: newAccessToken, refreshToken: newRefreshToken } = res.data;

              localStorage.setItem("usertoken", newAccessToken);
              localStorage.setItem("refreshtoken", newRefreshToken);
              setToken(newAccessToken);

              originalRequest.headers['x-token'] = newAccessToken;
              return axios(originalRequest);
            } catch (refreshError) {
              // Refresh failed, logout
              localStorage.removeItem("usertoken");
              localStorage.removeItem("refreshtoken");
              setToken("");
              setLogin(false);
              return Promise.reject(refreshError);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Admin routes where Navbar and Footer should be hidden
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/dashboard') ||
    location.pathname.toLowerCase().startsWith('/checkin');

  return (
    <div className="App">
      <loginStatus.Provider value={{ token, setToken, login, setLogin, user, setUser }}>
        <SearchProvider>
          <WishlistProvider>
            <CartProvider>
              <ScrollToTop />
              <AuthPopup isLogin={login} />
              {!isAdminRoute && <Navbar />}
              <Routing />
              {!isAdminRoute && <Footer />}
              {!isAdminRoute && <WhatsAppButton />}
              <ToastContainer position="top-right" autoClose={1000} />
            </CartProvider>
          </WishlistProvider>
        </SearchProvider>
      </loginStatus.Provider>
    </div>
  );
}

export default App;
