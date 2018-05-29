module.exports = `/* eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import Root from '../../pages/Root';
import configureStore from '../../store/configureStore';
import {rootReducer, routes} from '../../pages/@{App}';
import DEFAULT_STATE from '../../pages/@{App}/reducers/initialState';

const store = configureStore(rootReducer, {
  @{app}: {
    ...DEFAULT_STATE
  }
});
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history} routes={routes}/>,
  document.getElementById('react-content')
);
`;