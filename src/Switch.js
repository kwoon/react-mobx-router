import React, {PropTypes} from "react";
import {resolve, matchPath} from "./utils";
import {observer, inject} from "mobx-react";
/**
 * The public API for rendering the first <Route> that matches.
 */
@inject('history', 'match')
@observer
export default class Switch extends React.Component {
  render() {
    const {children, history:{location:{pathname}}, match:{url}, ...props} = this.props;
    const routes = React.Children.toArray(children);
    let route, match;
    for (let i = 0, length = routes.length; i < length; ++i) {
      route = routes[i];
      match = matchPath(pathname, resolve(url, route.props.path), route.props);
      if (match) {
        return React.cloneElement(route, {computedMatch: match, ...props});
      }
    }
    return null
  }
}