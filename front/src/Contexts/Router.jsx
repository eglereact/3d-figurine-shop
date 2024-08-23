import { createContext, useCallback, useEffect, useState } from "react";
import Page404 from "../Components/Page404";
import Register from "../Components/Common/Register";
import Login from "../Components/Common/Login";
import * as l from "../Constants/urls";
import Home from "../Components/Web/Home";

const RouterContext = createContext([]);

const Router = () => {
  const [route, setRoute] = useState("");
  const [params, setParams] = useState([]);

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.split("/");
    hash[0] || (hash[0] = "#");
    setRoute(hash.shift());
    setParams(hash);
  }, [setRoute, setParams]);

  useEffect(() => {
    const hash = window.location.hash.split("/");
    hash[0] || (hash[0] = "#");
    setRoute(hash.shift());
    setParams(hash);

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const routes = [
    { path: "", pc: 0, component: null },
    { path: l.SITE_HOME, pc: 0, component: <Home /> },

    { path: l.SITE_REGISTER, pc: 0, component: <Register /> },
    { path: l.SITE_LOGIN, pc: 0, component: <Login /> },
  ];

  const findRoute = () => {
    return routes.find((r) => {
      const realPath = r.path.split("/");
      if (realPath.length === 1) {
        return realPath[0] === route && r.pc === params.length;
      }
      if (realPath.length === 2) {
        return (
          realPath[0] === route && r.pc === params.length && r.p1 === params[0]
        );
      }
      return false;
    });
  };

  const routeComponent = findRoute()?.component ?? <Page404 />;
  return (
    <RouterContext.Provider value={{ params }}>
      {routeComponent}
    </RouterContext.Provider>
  );
};

export { RouterContext, Router };
