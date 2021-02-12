import { combineReducers } from 'redux';
import callReducer from '../containers/call/callSlice';

const callApp = combineReducers({
  call: callReducer,
});

export default callApp;
