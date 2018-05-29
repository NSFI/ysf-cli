module.exports = `import React, {Component} from 'react';
import {connect} from 'react-redux';
import @{App} from './@{App}';
import {bindActionCreators} from 'redux';
import * as actions from './actions';

const mapStateToProps = (state) => {
  return {
    ...state.@{app}
  };
};

const mapDispatchToProps = (dispatch) => {
  return Object.assign({},
    bindActionCreators(actions, dispatch),
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(@{App});
`;