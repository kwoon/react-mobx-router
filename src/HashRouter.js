import React from 'react'
import PropTypes from 'react/lib/ReactPropTypes'
import Router from './Router'
import createHistory from 'mobx-history/createHashHistory'

export default class HashRouter extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(['hashbang', 'noslash', 'slash']),
    children: PropTypes.node
  };
  
  history = createHistory(this.props);
  
  render() {
    return <Router history={this.history} children={this.props.children}/>
  }
}