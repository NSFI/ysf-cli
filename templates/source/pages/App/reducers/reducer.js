module.exports = `import DEFAULT_STATE from './initialState';
import {
  SET_TOTAL_NUM,
  SET_LIST,
} from '../actionTypes';

const @{App} = (state = DEFAULT_STATE, action) => {
  switch (action.type) {

    case SET_TOTAL_NUM:
      return Object.assign({}, state, {
        totalNum: action.totalNum,
      });

    case SET_LIST:
      return Object.assign({}, state, {
        list: [...state.list, ...action.list],
        offset: state.offset + action.offset
      });

    default:
      return state;
  }
};

export default @{App};
`;