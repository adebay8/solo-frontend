import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";

import PageLoader from "../components/PageLoader";
import Layout from "../components/Layout";
const Login = lazy(() => import("../pages/Login/Login"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const Home = lazy(() => import("../pages/Home/Home"));
const Page404 = lazy(() => import("../pages/404/NotFound"));
const Profile = lazy(() => import("../pages/Profile/Profile"));

const router = (props) => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/login"
          component={() => (
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/signup"
          component={() => (
            <Suspense fallback={<PageLoader />}>
              <Signup />
            </Suspense>
          )}
        />
        <Route
          exact
          path="/profile"
          component={() => (
            <Suspense fallback={<PageLoader />}>
              <Layout {...props}>
                <Profile />
              </Layout>
            </Suspense>
          )}
        />
        <Route
          exact
          path="/"
          component={(props) => (
            <Suspense fallback={<PageLoader />}>
              <Layout {...props}>
                <Home />
              </Layout>
            </Suspense>
          )}
        />
        <Route
          component={() => (
            <Suspense fallback={<PageLoader />}>
              <Page404 />
            </Suspense>
          )}
        />
      </Switch>
    </Router>
  );
};

router.propTypes = {};

export default router;
