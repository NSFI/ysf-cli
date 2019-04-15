module.exports = `import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { header, login } from '../../../reducers/reducer';
import {{PageName}} from './reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  header,
  login,
  {{PageName}}
});

export default rootReducer;
`;

