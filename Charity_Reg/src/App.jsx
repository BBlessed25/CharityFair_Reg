import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './components/SEO';
import RegistrationForm from './pages/RegistrationForm';

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
