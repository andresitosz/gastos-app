import { createBrowserRouter } from 'react-router';
import { Dashboard } from './components/Dashboard';
import { AddTransactionPage } from './components/AddTransactionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/add',
    Component: AddTransactionPage,
  },
]);
