import { combineReducers } from 'redux';
import postListReducer, {initialState as postListInitialState} from 'features/postList/reducers';

export const initialState = {
    postList: postListInitialState
};

const reducerMap = {
    postList: postListReducer
};

export default combineReducers(reducerMap);