import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    contract: null,
    events: [],
    buying: {
      isBuying: false,
      isSuccess: false,
      transactionHash: null
    },
    returning: {
      isBuying: false,
      isSuccess: false,
      transactionHash: null
    },
    canceling: {
      isBuying: false,
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
    buyRequest: (state, action) => {
      state.depositing.isDepositing = true
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },
    buySuccess: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = true
      state.depositing.transactionHash = action.payload
    },
    buyFail: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },

    retrunRequest: (state, action) => {
      state.withdrawing.isWithdrawing = true
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    returnSuccess: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = true
      state.withdrawing.transactionHash = action.payload
    },
    returnFail: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    cancelRequest: (state, action) => {
      state.swapping.isSwaping = true
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    },
    cancelSuccess: (state, action) => {
      state.swapping.isSwaping = false
      state.swapping.isSuccess = true
      state.swapping.transactionHash = action.payload
    },
    cancleFail: (state, action) => {
      state.swapping.isSwaping = false
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    }
  }
})

export const {
  setContract, eventsLoaded, buyRequest, buySuccess, buyFail, retrunRequest, 
  returnSuccess, returnFail, cancelRequest, cancelSuccess, cancleFail} = syberTickets.actions;

export default syberTickets.reducer;