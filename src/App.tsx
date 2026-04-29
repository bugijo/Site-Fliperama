import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage';
import { RankingPage } from './pages/RankingPage';
import { PrizesPage } from './pages/PrizesPage';
import { HowItWorks } from './pages/HowItWorks';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="ranking" element={<RankingPage />} />
          <Route path="premios" element={<PrizesPage />} />
          <Route path="como-funciona" element={<HowItWorks />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
