import React, { Suspense, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import HomePage from "./pages/homePage";
// import AuthPage from "./pages/authPage";
// import ProfilePage from "./pages/profilePage";

const HomePage = React.lazy(() => import("./pages/homePage"));
const AuthPage = React.lazy(() => import("./pages/authPage"));
const ProfilePage = React.lazy(() => import("./pages/profilePage"));
const SettingPage = React.lazy(() => import("./pages/settingPage"));

import Navbar from "./components/navbar";
import Loading from "./components/loading";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const auth = Boolean(useSelector((state) => state.user.token));

  return (
    <div className="app">
      <Router>
        <ThemeProvider theme={theme}>
          <Navbar />
          <CssBaseline />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/"
                element={!auth ? <AuthPage /> : <Navigate to="/home" />}
              />
              <Route
                path="/home"
                element={auth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={auth ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/settings"
                element={auth ? <SettingPage /> : <Navigate to="/" />}
              />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
