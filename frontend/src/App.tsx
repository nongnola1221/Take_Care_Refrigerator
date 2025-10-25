import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <HashRouter>
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto flex justify-between">
          <Link to="/" className="hover:text-gray-300">냉장고 요리사</Link>
          <div>
            <Link to="/inventory" className="mr-4 hover:text-gray-300">재고 관리</Link>
            <Link to="/login" className="hover:text-gray-300">로그인</Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;