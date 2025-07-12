import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { MainPage } from '../containers/MainPage';
import { NoAccessPage } from '../containers/NoAccessPage';
import { SearchResults } from '../containers/SearchResults';
import { AbbreviationProfile } from '../containers/abbreviation/AbbreviationProfile';
import { AccessControl } from '../containers/admin/AccessControl';
import { AdminDashboard } from '../containers/admin/AdminDashboard';
import { EntityConsole } from '../containers/admin/EntityConsole';
import { BookProfile } from '../containers/book/BookProfile';
import { CountryProfile } from '../containers/country/CountryProfile';
import { CreateCountryForm } from '../containers/forms/countries/CreateCountryForm';
import { CreateMapForm } from '../containers/forms/map/CreateMapForm';
import { CreateReportForm } from '../containers/forms/report/CreateReportForm';
import { MapProfile } from '../containers/map/MapProfile';
import { PersonProfile } from '../containers/person/PersonProfile';
import { CountryRequestsView } from '../containers/requests/CountryRequestsView';
import { MapRequestsView } from '../containers/requests/MapRequestsView';
import { ReportRequestsView } from '../containers/requests/ReportRequestsView';

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
      </Routes>
    </MainLayout>
  );
}
