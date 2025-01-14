import React, { lazy } from "react";
import { Navigate } from "react-router-dom"
import ArticlesLike from "@/pages/ArticlesLike";
const Home = lazy(() => import("@/pages/Home"))

const Login = lazy(() => import("@/pages/Login"));
const Customer = lazy(() => import("@/pages/Customer"));
const Manager = lazy(() => import("@/pages/Manager"));
const ArticlesList = lazy(() => import("@/pages/articlesList"));
const NewArticles = lazy(() => import("@/pages/NewArticles"));
const ArticlesType = lazy(() => import("@/pages/ArticlesType"));
const Main = lazy(() => import("@/pages/Main"));
const Note = lazy(() => import("@/pages/Note"));
const NotFound = lazy(() => import("@/components/NotFound"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Ownmessage = lazy(() => import("@/pages/Ownmessage"));
const routes = [
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: 'articles',
        children: [
          {
            path: "articlesList",
            element: <ArticlesList />
          },
          {
            path: "newArticles",
            element: <NewArticles />
          },
          {
            path: "ArticlesType",
            element: <ArticlesType />
          },
          {
            path: "articlesLike",
            element: <ArticlesLike />
          },
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: "customer",
            element: <Customer />
          },
          {
            path: "manager",
            element: <Manager />
          },
        ]
      },
      {
        path: "notes",
        element: <Note />
      },
      {
        path: "reviews",
        element: <Reviews />
      },
      {
        path: "mine",
        element: <Ownmessage />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/*",
    element: <NotFound />
  },
]
export default routes;