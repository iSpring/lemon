import { createStore, applyMiddleware } from 'redux';
import rootReducer, {initialState} from './rootReducer';

export default function configStore(){
    const store = createStore(rootReducer, initialState);
    return store;
}