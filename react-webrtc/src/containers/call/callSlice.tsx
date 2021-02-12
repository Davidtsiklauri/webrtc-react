import { createSlice } from '@reduxjs/toolkit';
import { IStatusState } from '../../models/activeUsers.interface';

export const StatusState: IStatusState = {
  status: 'START',
};

const callSlice = createSlice({
  name: 'call',
  initialState: StatusState,
  reducers: {
    updateStatus(state, action) {
      const { status } = action.payload as IStatusState;
      state.status = status;
    },
  },
});

export const { updateStatus } = callSlice.actions;

export default callSlice.reducer;
