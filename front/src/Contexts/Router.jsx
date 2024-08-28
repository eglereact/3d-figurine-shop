import { createContext, useCallback, useEffect, useState } from "react";
import Page404 from "../Components/Page404";
import Register from "../Components/Common/Register";
import Login from "../Components/Common/Login";
import * as l from "../Constants/urls";
import Home from "../Components/Web/Home";
import Dashboard from "../Components/Admin/Dashboard";
import UsersList from "../Components/Admin/UsersList";
import Sidebar from "../Components/Admin/Sidebar";
import UserEdit from "../Components/Admin/UserEdit";
import ProductsList from "../Components/Admin/ProductsList";
import ProductCreate from "../Components/Admin/ProductCreate";

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
    {
      path: l.SITE_DASHBOARD,
      pc: 1,
      p1: "dashboard",
      component: (
        <Sidebar>
          <Dashboard />
        </Sidebar>
      ),
    },
    {
      path: l.USERS_LIST,
      pc: 1,
      p1: "users",
      component: (
        <Sidebar>
          <UsersList />
        </Sidebar>
      ),
    },
    {
      path: l.USER_EDIT,
      pc: 2,
      p1: "user-edit",
      component: (
        <Sidebar>
          <UserEdit />
        </Sidebar>
      ),
    },
    {
      path: l.PRODUCTS_LIST,
      pc: 1,
      p1: "products",
      component: (
        <Sidebar>
          <ProductsList />
        </Sidebar>
      ),
    },
    {
      path: l.PRODUCT_ADD,
      pc: 1,
      p1: "product-add",
      component: (
        <Sidebar>
          <ProductCreate />
        </Sidebar>
      ),
    },
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
