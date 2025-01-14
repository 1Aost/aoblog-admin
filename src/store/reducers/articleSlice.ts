import { createSlice } from "@reduxjs/toolkit";

const initialState: never[] = []
export const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    // 定义一个改变所有文章的方法
    all: (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = []
    }
  }
})
export const { all } = articleSlice.actions;
export default articleSlice.reducer;