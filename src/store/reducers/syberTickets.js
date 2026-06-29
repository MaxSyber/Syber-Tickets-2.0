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
  },
  creating: {
    isCreating: false,
    isSuccess: false,
    transactionHash: null
  },
}

export const syberTickets = createSlice({
  name: 'syberTickets',
  initialState,
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },

    eventsLoaded: (state, action) => {
      const incoming = action.payload
      const merged = [...state.events]
      for (let event of incoming) {
        const exists = merged.find(e => e.eventId === event.eventId)
        if (!exists) {
          merged.push(event)
        }
      }
      merged.sort((a, b) => b.eventId - a.eventId)
      state.events = merged
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
      state.canceling.transactionHash = action.payload
    },
    cancelFail: (state, action) => {
      state.canceling.isCanceling = false
      state.canceling.isSuccess = false
      state.canceling.transactionHash = null
    },
    eventRequest: (state, action) => {
      state.creating.isCreating = true
      state.creating.isSuccess = false
      state.creating.transactionHash = null
    },
    eventSuccess: (state, action) => {
      state.creating.isCreating = false
      state.creating.isSuccess = true
      state.creating.transactionHash = action.payload
    },
    eventFail: (state, action) => {
      state.creating.isCreating = false
      state.creating.isSuccess = false
      state.creating.transactionHash = null
    },
  }
})

export const {
  setContract, eventsLoaded, buyRequest, buySuccess, buyFail, ticketsRemainingLoaded, userBalancesLoaded, returnRequest,
  returnSuccess, returnFail, cancelRequest, cancelSuccess, cancelFail, eventRequest, eventSuccess, eventFail} = syberTickets.actions;

export default syberTickets.reducer;
