import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/AppLayout';
import { RequireAuth } from './components/RequireAuth';
import { HomePage } from './pages/HomePage';
import { EditRacePage } from './pages/EditRacePage';
import { LoginPage } from './pages/LoginPage';
import { NewRacePage } from './pages/NewRacePage';
import { RaceRegistrationPage } from './pages/RaceRegistrationPage';
import { RaceResultsPage } from './pages/RaceResultsPage';
import { RegistrationSuccessPage } from './pages/RegistrationSuccessPage';
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
  TrainingCampPage,
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
          <Route element={<RacesPage />} path="/calendar" />
          <Route element={<RaceDetailPage />} path="/calendar/:slug" />
          <Route element={<RaceRegistrationPage />} path="/calendar/:slug/register" />
          <Route element={<RegistrationSuccessPage />} path="/registration-success" />
          <Route
            element={
              <RequireAuth>
                <NewRacePage />
              </RequireAuth>
            }
            path="/races/new"
          />
          <Route
            element={
              <RequireAuth>
                <EditRacePage />
              </RequireAuth>
            }
            path="/races/:raceId/edit"
          />
          <Route
            element={
              <RequireAuth>
                <RaceResultsPage />
              </RequireAuth>
            }
            path="/races/:raceId/results"
          />
          <Route element={<LoginPage />} path="/login" />
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
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
