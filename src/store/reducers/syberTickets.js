import { createSlice } from '@reduxjs/toolkit'

export const syberTickets = createSlice({
  name: 'syberTickets',
  initialState: {
    contract: null,
    events: []
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },

    eventsLoaded: (state, action) => {
        state.events = action.payload
    }
  }
})

export const {
  setContract, eventsLoaded
} = syberTickets.actions;

export default syberTickets.reducer;