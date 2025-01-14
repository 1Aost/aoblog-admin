import { createSlice } from "@reduxjs/toolkit"; 
import { timestampToTime } from "@/api/utils";
export interface UserState {
    time:string
}
const initialState:UserState={
    time:""
}
// 创建一个Slice
export const userSlice=createSlice({
    name:"user",
    initialState,
    // 定义reducers并生成关联的操作
    reducers:{
        // 定义一个改变isLogined并存储用户信息的方法
        change:(state)=>{
            state.time=timestampToTime(Date.now(),true);
        }
    }
})
// 导出方法
export const {change}=userSlice.actions;
export default userSlice.reducer;