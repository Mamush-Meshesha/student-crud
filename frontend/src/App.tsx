import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/protected-route';
import PublicRoute from './components/public-route';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import Home from './pages/index';
import StudentDetailPage from './pages/student-detail';
import StudentEditPage from './pages/student-edit';
import { ToastNotifications } from './components/toast-notification';
import NotFoundPage from './pages/not-found';


function App() {
  return (
   <BrowserRouter>
      <ToastNotifications /> 
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/students/:id/edit" element={<StudentEditPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;