// src/app/routes.ts
import { createBrowserRouter } from 'react-router';
import { Dashboard } from './components/Dashboard';
import { AddTransactionPage } from './components/AddTransactionPage';
import { History } from './components/History';  // ← CORREGIDO

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/add',
    Component: AddTransactionPage,
  },
  {
    path: '/history',
    Component: History,
  },
]);