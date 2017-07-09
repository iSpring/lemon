import * as constants from '../constants';

export const initialState = {
    posts: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case constants.ADD_NEW_POST:
            return {
                ...state,
                posts: [...state.posts, action.post]
            };
        default:
            return state;
    }
};