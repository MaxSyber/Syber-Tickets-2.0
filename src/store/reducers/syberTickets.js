import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  contract: null,
  events: [],
  ticketsRemaining: {},
  userBalances: {},
  buying: {
    isBuying: false,
    isSuccess: false,
    transactionHash: null
  },
  returning: {
    isReturning: false,
    isSuccess: false,
    transactionHash: null
  },
  canceling: {
    isCanceling: false,
    isSuccess: false,
    transactionHash: null
  }
}

export const syberTickets = createSlice({
  name: 'syberTickets',
  initialState,
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },

    eventsLoaded: (state, action) => {
        state.events = action.payload
    },

    ticketsRemainingLoaded: (state, action) => {
      const { eventId, value } = action.payload
      state.ticketsRemaining[eventId] = value
    },

    userBalancesLoaded: (state, action) => {
      const { eventId, value } = action.payload
      state.userBalances[eventId] = value
    },

    buyRequest: (state, action) => {
      state.buying.isBuying = true
      state.buying.isSuccess = false
      state.buying.transactionHash = null
    },
    buySuccess: (state, action) => {
      state.buying.isBuying = false
      state.buying.isSuccess = true
      state.buying.transactionHash = action.payload
    },
    buyFail: (state, action) => {
      state.buying.isBuying = false
      state.buying.isSuccess = false
      state.buying.transactionHash = null
    },

    returnRequest: (state, action) => {
      state.returning.isReturning = true
      state.returning.isSuccess = false
      state.returning.transactionHash = null
    },
    returnSuccess: (state, action) => {
      state.returning.isReturning = false
      state.returning.isSuccess = true
      state.returning.transactionHash = action.payload
    },
    returnFail: (state, action) => {
      state.returning.isReturning = false
      state.returning.isSuccess = false
      state.returning.transactionHash = null
    },
    cancelRequest: (state, action) => {
      state.canceling.isCanceling = true
      state.canceling.isSuccess = false
      state.canceling.transactionHash = null
    },
    cancelSuccess: (state, action) => {
      state.canceling.isCanceling = false
      state.canceling.isSuccess = true
      state.swapping.transactionHash = action.payload
    },
    cancleFail: (state, action) => {
      state.canceling.isCanceling = false
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    }
  }
})

export const {
  setContract, eventsLoaded, buyRequest, buySuccess, buyFail, ticketsRemainingLoaded, userBalancesLoaded, returnRequest,
  returnSuccess, returnFail, cancelRequest, cancelSuccess, cancleFail} = syberTickets.actions;

export default syberTickets.reducer;