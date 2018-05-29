module.exports = `import {request} from '../../utils/';
import {
  SET_TOTAL_NUM,
  SET_LIST,
} from './actionTypes';

// 设置列表
const setList = (list, offset) => {
  return {
    type: SET_LIST,
    list,
    offset,
  };
};

// 设置总数
export const setTotalNum = (totalNum) => {
  return {
    type: SET_TOTAL_NUM,
    totalNum,
  };
};

`;