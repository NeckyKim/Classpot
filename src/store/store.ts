import { configureStore } from "@reduxjs/toolkit";

import isApplyingTest from "./isApplyingTestSlice";

export const store = configureStore({
    reducer: {
        isApplyingTest: isApplyingTest.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch