/**
 * @file
 * @author PaulHan
 * @date 2017/11/13
 */
import React, {PropTypes} from 'react';

class Test extends React.Component {
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

export default React.renderDOM(<Test msg="hello word"/>, document.getElementById('root'));
