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
// function A({children}) {
//   return React.createElement('div', {text: 123}, children);
// }
// const BasicNode = React.createElement(A, null, 'hello', 'child');
// console.log(BasicNode);
//

// 一个基本的测试
class Test extends Component {
  constructor(props) {
    super();
    this.state = {text: props.msg};
  }

  componentDidMount() {
    // forEachContext这个参数还真没注意过
    React.Children.forEach(this.props.children, (param) => {
      console.log('child', param);
    });
  }

  render() {
    const {msg} = this.context;
    return (
      <div>
        <p>data:{msg}</p>
        <p>child:</p>
        {this.props.children}
      </div>
    );
  }
}

Test.contextTypes = {
  msg: PropTypes.string,
};


// 查看继承类的实例
// const testComponent = new Test({msg: 'test'});
// console.log('testComponent', testComponent);


class App extends React.Component {
  getChildContext() {
    return {msg: 'hello context'};
  }

  render() {
    const node = <Test msg="hello props" key="qweqwe"><span>this is a child</span></Test>;
    console.log('react element', node);
    console.log('this', this);
    return <div>{node}</div>;
  }
}

App.childContextTypes = {
  msg: PropTypes.string,
};

ReactDOM.render(<App msg="hello word"/>, document.getElementById('root'));
