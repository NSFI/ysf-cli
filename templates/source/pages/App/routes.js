module.exports = `import React from 'react';
import { Route, IndexRoute } from 'react-router';
import @{App} from './view';

export default (
  <Route path="/@{app}" component={@{App}} />
);
`;