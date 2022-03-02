import Login from "@src/components/auth/login/Login";
import { LogOut } from "@src/components/auth/logout/LogOut";
import SignUp from "@src/components/auth/signup/SignUp";
import { CourseList } from "@src/components/courses/course-list/CourseList";
import CourseCard from "@src/components/courses/CourseCard/CourseCard";
import React from "react";
import { Route, Routes } from "react-router-dom";
import CourseEdit from "@src/components/courses/courseEdit/CourseEdit";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/course/:id" element={<CourseEdit />} />

        <Route path="/course/new" element={<CourseCard />} />
        <Route path="/" element={<CourseList />} />
      </Routes>
    </>
  );
};

export default AppRouter;
