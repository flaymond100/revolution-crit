import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { RaceRegistrationPage } from './pages/RaceRegistrationPage';
import {
  AboutPage,
  CategoriesPage,
  ContactPage,
  FaqPage,
  GalleryPage,
  GalleryRacePage,
  GallerySeasonPage,
  ImprintPage,
  PartnersPage,
  PrivacyPage,
  RaceDetailPage,
  RacesPage,
  ResultsPage,
  ResultsRacePage,
  ResultsSeasonPage,
  TermsPage,
  TrainingCampPage,
  WithdrawalPage,
} from './pages/RoutePages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<HomePage />} path="/" />
          <Route element={<RacesPage />} path="/races" />
          <Route element={<RaceDetailPage />} path="/races/:slug" />
          <Route
            element={<RaceRegistrationPage />}
            path="/races/:slug/register"
          />
          <Route element={<ResultsPage />} path="/results" />
          <Route element={<ResultsSeasonPage />} path="/results/:season" />
          <Route
            element={<ResultsRacePage />}
            path="/results/:season/:raceSlug"
          />
          <Route element={<CategoriesPage />} path="/categories" />
          <Route element={<GalleryPage />} path="/gallery" />
          <Route element={<GallerySeasonPage />} path="/gallery/:season" />
          <Route
            element={<GalleryRacePage />}
            path="/gallery/:season/:raceSlug"
          />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<TrainingCampPage />} path="/training-camp" />
          <Route element={<PartnersPage />} path="/partners" />
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<FaqPage />} path="/faq" />
          <Route element={<ImprintPage />} path="/imprint" />
          <Route element={<PrivacyPage />} path="/privacy" />
          <Route element={<TermsPage />} path="/terms" />
          <Route element={<WithdrawalPage />} path="/withdrawal" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
