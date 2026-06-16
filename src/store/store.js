import { configureStore } from '@reduxjs/toolkit'

import provider from './reducers/provider'
import syberTickets from './reducers/syberTickets'

export const store = configureStore({
  reducer: {
    provider,
    syberTickets,
    
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
