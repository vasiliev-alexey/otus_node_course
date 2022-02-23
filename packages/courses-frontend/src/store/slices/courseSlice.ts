import { Course } from "@course/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CourseService from "@services/CourseService";
const rootActionName = "courses";
export const getAllCourses = createAsyncThunk<Course[]>(
  `${rootActionName}/all`,

  async (_, thunkApi) => {
    try {
      const response = await CourseService.getAll();
      return response.data;
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export interface CoursesStateType {
  courses: Course[];
}

const initialState: CoursesStateType = {
  courses: [],
};

const authSlice = createSlice({
  name: rootActionName,
  initialState,

  extraReducers: (builder) => {
    builder.addCase(getAllCourses.pending, (state) => {
      state.courses = [];
    });
    builder.addCase(getAllCourses.rejected, (state) => {
      state.courses = [];
    });
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
  },

  reducers: {},
});

export const { reducer: CourseReducer, actions } = authSlice;
