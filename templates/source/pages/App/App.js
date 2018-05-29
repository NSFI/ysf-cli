module.exports = `import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../MainLayout';
import { Button } from 'antd';
import './@{App}.less';

class App extends Component {

  static propTypes = {
    totalNum: PropTypes.number,
    list: PropTypes.array,
    offset: PropTypes.number,
  };

  static defaultProps = {
    totalNum: 0,
    list: [],
    offset: 0,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MainLayout>
        <Button>@{app}</Button>
      </MainLayout>
    );
  }
}

export default App;

`;