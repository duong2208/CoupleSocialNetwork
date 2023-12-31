import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    persistReducer, persistStore, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import userSlice from "~/store/user/userSlice";
import coupleSlice from "~/store/couple/coupleSlice";
import todoSlice from "~/store/todo/todoSlice";
import anniversarySlice from "~/store/anniversary/anniversarySlice";
import postSlice from "~/store/post/postSlice";

const commonConfig = {
    key: 'web/user',
    storage
}

const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current'],     // whitelist - những trường muốn localstorage lưu 
}

const coupleConfig = {
    key: 'couple',
    storage
}

const todoConfig = {
    key: 'todo',
    storage
}

const anniversaryConfig = {
    key: 'anniversary',
    storage
}
const postConfig = {
    key: 'post',
    storage
}

export const store = configureStore({
    reducer: {
        post: persistReducer(postConfig, postSlice),
        anniversary: persistReducer(anniversaryConfig, anniversarySlice),
        todo: persistReducer(todoConfig, todoSlice),
        couple: persistReducer(coupleConfig, coupleSlice),
        user: persistReducer(userConfig, userSlice),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)