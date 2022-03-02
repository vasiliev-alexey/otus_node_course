import { RootState } from "@store/store";

export const authSelector = (state: RootState) => state.auth;

export const coursesSelector = (state: RootState) => state.courses.courses;
export const courseSelector = (state: RootState) => state.courses.currentCourse;
