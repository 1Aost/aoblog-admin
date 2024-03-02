import { configureStore } from "@reduxjs/toolkit";
import articleSlice from "./reducers/articleSlice";
import userSlice from "./reducers/userSlice"
// configureStore创建一个redux数据
const store=configureStore({
    // 合并多个slice
    reducer:{
        user:userSlice,
        article:articleSlice
    }
})
export default store;