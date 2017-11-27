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
    // // forEachContext这个参数用于绑定this用的
    // React.Children.forEach(this.props.children, (param, index) => {
    //   console.log('forEach child' + index, param);
    // });

    // // map test
    // const test = React.Children.map(this.props.children, function (param, index) {
    //   // console.log(this);
    //   console.log('map child' + index, param);
    //   // return [1, 2, 3];
    //   return [<span key="oldKey">1</span>, 2, null, [1, 2]]; // 多维数组会被平铺，null值会被忽略
    // }, this);

    // // toArray test
    // const test = React.Children.toArray([<span key="oldKey">1</span>, 2, null, [1, 2]]);
    // console.log(test);
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
    // const mapChildTest = new Map();
    // mapChildTest.set(1, <span key="child1">this is a child</span>);
    // mapChildTest.set(2, <span key="child2">this is a child</span>);
    const node = (
      <Test msg="hello props" key="qweqwe">
        {/* 像这种没有包裹的元素，会被babel转化成createElement('Test',{},123,<span></span>)这种形式 */}
        123
        <span key="child1">this is a child</span>
        {/**/}
        {/*
         {
         new Set([
         <span key="child1">this is a child</span>,
         <span key="child2">this is a child</span>,
         ])
         }
         */}
        {/*
         Map test
         {mapChildTest}
         */}
      </Test>
    );
    // console.log('react element', node);
    // console.log('this', this);
    return <div>{node}</div>;
  }
}

App.childContextTypes = {
  msg: PropTypes.string,
};

var getDisplayName = function(element) {

  var REACT_FRAGMENT_TYPE =
    (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.fragment')) ||
    0xeacb;
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else if (element.type === REACT_FRAGMENT_TYPE) { // ？
    return 'React.Fragment';
  } else { // 获取浏览器支持就函数名，否则Unknown
    return element.type.displayName || element.type.name || 'Unknown';
  }
};

const dom = <App msg="hello word"/>;
console.log('dom', dom);
console.log(getDisplayName(dom))


ReactDOM.render(dom, document.getElementById('root'));
