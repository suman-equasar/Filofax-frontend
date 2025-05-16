import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the user slice
};

// Create a persisted reducer from the combined root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["user.userDetails.profileImage"],
      },
    }),
});

export const persistor = persistStore(store);
