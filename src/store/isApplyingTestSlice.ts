import { createSlice } from "@reduxjs/toolkit";

let isApplyingTest = createSlice({
    name: "isApplyingTest",
    initialState: false,
    reducers: {
        setIsApplyingTest(state) {
            return !state
        }
    }
})

export let { setIsApplyingTest } = isApplyingTest.actions;

export default isApplyingTest;