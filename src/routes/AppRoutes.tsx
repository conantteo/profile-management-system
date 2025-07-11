import { Routes, Route } from 'react-router-dom';
import { MainPage } from '../containers/MainPage';
import { SearchResults } from '../containers/SearchResults';
import { NoAccessPage } from '../containers/NoAccessPage';
import { AdminDashboard } from '../containers/admin/AdminDashboard';
import { EntityConsole } from '../containers/admin/EntityConsole';
import { AccessControl } from '../containers/admin/AccessControl';
import { AbbreviationProfile } from '../containers/abbreviation/AbbreviationProfile';
import { BookProfile } from '../containers/book/BookProfile';
import { CountryProfile } from '../containers/country/CountryProfile';
import { MapProfile } from '../containers/map/MapProfile';
import { PersonProfile } from '../containers/person/PersonProfile';
import { MainLayout } from '../components/Layout/MainLayout';

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
        <Route path="/profile/abbreviation/:id" element={<AbbreviationProfile />} />
      </Routes>
    </MainLayout>
  );
}
