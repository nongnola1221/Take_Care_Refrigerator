import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useAuthStore from './store/authStore';
import { subscribeToPush } from './utils/push';

const AuthenticatedApp = () => {
  const { logout } = useAuthStore();
  return (
    <div className="min-h-screen w-full main-bg-gradient">
      <div className="relative min-h-screen w-full bg-background/80 backdrop-blur-xl">
        <header className="p-4 text-white sticky top-0 z-10 bg-glass shadow-lg">
          <nav className="container mx-auto flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="text-2xl font-bold tracking-wider">냉장고를 부탁해</Link>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="hover:text-gray-200 transition-colors">레시피 추천</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/inventory" className="hover:text-gray-200 transition-colors">재고 관리</Link>
              </motion.div>
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
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <HashRouter>
      {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </HashRouter>
  );
}

export default App;