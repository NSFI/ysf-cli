module.exports = `import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {{PageName}} from './view';

export default (
  <Route path="/{{PageName}}" component={{{PageName}}} />
);
`;
