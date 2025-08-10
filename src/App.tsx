import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

import { themeBalham } from 'ag-grid-community';
export const agGridTheme = themeBalham.withParams({ accentColor: 'green' });

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
