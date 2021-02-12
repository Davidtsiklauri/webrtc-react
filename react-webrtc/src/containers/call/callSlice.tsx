import { createSlice } from '@reduxjs/toolkit';

const callSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {},
});

// export const { addTodo, toggleTodo } = todosSlice.actions

export default callSlice.reducer;
