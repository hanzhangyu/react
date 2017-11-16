/**
 * @file
 * @author PaulHan
 * @date 2017/11/13
 */
import React, {Component, unstable_AsyncComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


// 查看类及实例
// console.log('React.Component', Component);
// const reactComponent = new Component({msg: 'test'}, {contextMsg: 'contextMsg'});
// console.log('reactComponent', reactComponent);
//
// console.log('React.AsyncComponent', unstable_AsyncComponent);
// const reactAsyncComponent = new unstable_AsyncComponent({msg: 'test'}, {contextMsg: 'contextMsg'});
// console.log('AsyncComponent', reactAsyncComponent);
//
// console.log(React.createElement('div'));


// 一个基本的测试
class Test extends Component {
  constructor(props) {
    super();
    this.state = {text: props.msg};
  }

  render() {
    const {msg} = this.props;
    return (
      <div>{msg}</div>
    );
  }
}

Test.propTypes = {
  msg: PropTypes.string,
};

// 查看继承类的实例
// const testComponent = new Test({msg: 'test'});
// console.log('testComponent', testComponent);


class App extends React.Component {
  render() {
    const node = <Test msg="hello word"/>;
    console.log('react element', node);
    console.log('this', this);
    return <div>{node}</div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
