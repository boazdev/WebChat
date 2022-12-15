import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import chatReducer from './chatSlice'
//import storage from 'redux-persist/lib/storage/session'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    //whitelist:[reducer1]
}



const combReducers = combineReducers(
    {user: userReducer,
    chat: chatReducer}
)
/* const reducer1 ={collections: appReducer} */
const persistedReducer = persistReducer(persistConfig, combReducers)

export const store = configureStore(
    {
      reducer:  persistedReducer, 
      devTools: process.env.NODE_ENV !== 'production',
        middleware: [thunk]

    }
  )

export const persistor = persistStore(store)

/* 
export const store = configureStore(
    {
      reducer:  {
        collections: appReducer
      }
    }
  ) */