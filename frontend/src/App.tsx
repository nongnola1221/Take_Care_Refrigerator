import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useAuthStore from './store/authStore';
import { subscribeToPush } from './utils/push';

function App() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <HashRouter>
      <div className="min-h-screen w-full main-bg-gradient">
        <div className="relative min-h-screen w-full bg-background/80 backdrop-blur-xl">
          <header className="p-4 text-white sticky top-0 z-10 bg-glass shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="text-2xl font-bold tracking-wider">냉장고를 부탁해</Link>
              </motion.div>
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/inventory" className="hover:text-gray-200 transition-colors">재고 관리</Link>
                </motion.div>
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={subscribeToPush}
                      className="hover:text-gray-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      알림 구독
                    </motion.button>
                    <motion.button
                      onClick={logout}
                      className="hover:text-gray-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      로그아웃
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        className="hover:text-gray-200 transition-colors"
                      >
                        로그인
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/register"
                        className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                      >
                        회원가입
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </nav>
          </header>
          <main className="container mx-auto p-4 sm:p-6 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;