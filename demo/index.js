/**
 * @file
 * @author PaulHan
 * @date 2017/11/13
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

console.log('React.Component', Component);
const reactComponent = new Component({msg: 'test'}, {contextMsg: 'contextMsg'});
console.log('reactComponent', reactComponent);

// 一个基本的测试
class Test extends Component {
  constructor(props) {
    super();
    this.state = {text: props.msg}
  }

  render() {
    const {msg} = this.props;
    return (
      <div>{msg}</div>
    )
  }
}

Test.propTypes = {
  msg: PropTypes.string,
};

const testComponent = new Test({msg: 'test'});
console.log('testComponent', testComponent);

class App extends React.Component {
  render() {
    const node = <Test msg="hello word"/>;
    console.log(node);
    return <div>{node}</div>;
  }
}

export default ReactDOM.render(<App/>, document.getElementById('root'));
