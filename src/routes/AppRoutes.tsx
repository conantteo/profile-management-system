import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import { MainPage } from '../containers/MainPage';
import { NoAccessPage } from '../containers/NoAccessPage';
import { SearchResults } from '../containers/SearchResults';
import { AccessControl } from '../containers/admin/AccessControl';
import { AdminDashboard } from '../containers/admin/AdminDashboard';
import { EntityConsole } from '../containers/admin/EntityConsole';
import { CreateCountryForm } from '../containers/forms/CreateCountryForm';
import { CreateMapForm } from '../containers/forms/CreateMapForm';
import { CreateReportForm } from '../containers/forms/CreateReportForm';
import { AbbreviationProfile } from '../containers/profile/AbbreviationProfile';
import { BookProfile } from '../containers/profile/BookProfile';
import { CountryProfile } from '../containers/profile/CountryProfile';
import { MapProfile } from '../containers/profile/MapProfile';
import { PersonProfile } from '../containers/profile/PersonProfile';
import { CountryRequestsView } from '../containers/requests/CountryRequestsView';
import { MapRequestsView } from '../containers/requests/MapRequestsView';
import { ReportRequestsView } from '../containers/requests/ReportRequestsView';
import { MapStatistics } from '../containers/statistics/MapStatistics';
import { PersonStatistics } from '../containers/statistics/PersonStatistics';

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/forbidden-access" element={<NoAccessPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/entity-console" element={<EntityConsole />} />
        <Route path="/admin/access-control" element={<AccessControl />} />
        <Route path="/profile/person/:id" element={<PersonProfile />} />
        <Route path="/profile/map/:id" element={<MapProfile />} />
        <Route path="/profile/book/:id" element={<BookProfile />} />
        <Route path="/profile/country/:id" element={<CountryProfile />} />
        <Route
          path="/profile/abbreviation/:id"
          element={<AbbreviationProfile />}
        />
        {/* Form Routes */}
        <Route path="/forms/map/create" element={<CreateMapForm />} />
        <Route path="/forms/report/create" element={<CreateReportForm />} />
        <Route path="/forms/countries/create" element={<CreateCountryForm />} />

        {/* Request Routes */}
        <Route path="/requests/map" element={<MapRequestsView />} />
        <Route path="/requests/report" element={<ReportRequestsView />} />
        <Route path="/requests/country" element={<CountryRequestsView />} />

        {/* Statisc Routes */}
        <Route path="/statistics/person" element={<PersonStatistics />} />
        <Route path="/statistics/map" element={<MapStatistics />} />
      </Routes>
    </MainLayout>
  );
}
