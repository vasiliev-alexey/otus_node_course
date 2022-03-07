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
export const createNewCourse = createAsyncThunk<
  void,
  { course: Course; file: File }
>(
  `${rootActionName}/newCourse`,

  async (req: { course: Course; file: File }, thunkApi) => {
    try {
      const { course, file } = req;
      const _response = await CourseService.createNewCourse(course, file);
      return;
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export const getCourseById = createAsyncThunk<Course, string>(
  `${rootActionName}/getCourse`,

  async (id: string, thunkApi) => {
    try {
      const _response = await CourseService.getCourse(id);
      return _response.data;
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export interface CoursesStateType {
  courses: Course[];
  currentCourse?: Course;
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

    builder.addCase(getCourseById.pending, (state) => {
      state.courses = [];
    });
    builder.addCase(getCourseById.rejected, (state) => {
      state.courses = [];
    });
    builder.addCase(getCourseById.fulfilled, (state, action) => {
      state.currentCourse = action.payload;
    });
  },

  reducers: {},
});

export const { reducer: CourseReducer, actions } = authSlice;
