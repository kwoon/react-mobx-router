#                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Route

The `<Router />` component is a middleware component that renders its descendent component when its `path` match the URL and pass match URL params to its children component. Components rendered in `<Router />` can also contain its own `<Router />`, which will render components for nested paths. 

```jsx
<Route path='/users'> // matches `/users`, or `/users/a/`, but not `/users1`
  <div>
    <h1>Users</h1>
    <Route path=':name'> // matches `/users/1`, `/users/alice`, but not `/users`
      <UserDetail /> // will be render as <UserDetail name='alice' /> if URL is `/user/alice`
    </Route>
    <Route path='/alice'> // will matches `/alice` but not `/users/alice` since prefixed with '/' means that it's an absolute path.
    // you may want to set path as `./alice` or just `alice`.
      <AliceDetail /> 
    </Route>   
  </div>
</Route>
```

## Props

- **path**
  - type: `string`
  - default: `""`
  - example: `/author` `/author/:id` `../book`

Any valid URL path that [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) understands. Relative path would be resolved as [`path.resolve`](https://nodejs.org/dist/latest-v6.x/docs/api/path.html#path_path_resolve_paths) does with parent `Route`'s `path` as base directory.

```jsx
<Route path='/author/:id' component='div'>
  <div> Author name </div>
  <Route path='./books'>
    <Books />
  </Route>
</Route>
```

equivalents to 
```jsx
<Route path='/author/:id' component='div'>
  <div> Author name </div>
  <Route path='/author/:id/books'>
    <Books />
  </Route>
</Route>
```

- **exact**
  - type: `bool`
  - default: `false`

When `true`, will only match if the path matches the `history.location.pathname` exactly.

```jsx
<Route exact path='/author' component='div'>
  It would NOT show when pathname is `/author/123`.
</Route> 
<Route path='/author' component='div'>
  It would show when pathname is `/author/123`.
</Route>
```

- **strict**
  - type: `bool`
  - default: `false`

When `true`, a path that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the `location.pathname`.

path| pathname | matches
---|---|---
/one/|/one|`false`
/one/|/one/| `true`
/one/|/one/two|`true`

`strict` can be used to enforce that a `location.pathname` has no trailing slash, but in order to do this both `strict` and `exact` must be `true`.

path| pathname | matches
---|---|---
/one|/one|`true`
/one|/one/| `false`
/one|/one/two|`false`



- **component**
  - type: `string` | `Component` | `node`
  - default: `null`
  - example: `'div'` `UserDetail` `<UserDetail />` `({name})=><div>{name}</div>`

Component to render when route matches. When `component` is `node`, `children` of `<Route />` would be ignored, only `component` would be return. Otherwise, `<Router component={Compnont} {...props}>{children}</Router>`  would render `<Component {...props}>{children}</Component>`.

```jsx
<Route component='div'> // component is `string`
  name
</Route> 
// would render <div>name</div>
<Route component={UserDetail}> // component is `Component`
  name
</Route> 
// would render <UserDetail>name</div>

<Route component={<UserDetail>alice</UserDetail>}> // component is `node`
  name
</Route> 
// would render <UserDetail>alice</UserDetail>

<Route> // no component, returns `children`
  <div>name</div>
</Route>
// would render <div>name</div>
```

- **mapping**

 - type: `object` | `function`
 - default: only return each match `params` and rest props.
```js
({match:{params}, path, exact, strict, mappings, component, render, ...props) => ({...params,...props})
```

`mapping` defines how props of `Route` pass to its rendered element. By default, only match `params` in URL would pass since it is the most wanted behavior. you might want to change it to conform children `propTypes` definitions.

```jsx
let myMapping = ({match:{params}) => ({promise
server.getUserbyId(params.id)})

<Route path=`/user/:id` mapping={myMapping}>
  <Resolve name='user'>
    <User />
  </Resolve>
</Route>
// when URL is `/user/123`, it would render
<Resolve name='user' promise={server.getUserbyId(params.id)}>
  <User />
</Resolve>
// After successfully fetching from server with {name:"alice",id:"123"}, it would render
<User user={{name:"alice",id:"123"}}/>

```

- **render**
  - type: `function`
  - default: `null`
  
`render` would take place of original `render` function of `Route` after `match` computed , it takes the same set of arguments as `mapping`, but would call whether `match` or not.
Useful when you want to render something no matter its wrapper `Route` matches or not.

- **match** (computed props)
  - type: `object`
 
`match` is computed by `Route` based on URL. Check [`match`](../Concepts/match.md) in `Concept` section for more detail.


## Behaviour

When a `Route` matches current URL, the default behaviour is pass matching URL `params` to its children. This behavior can be changed via `mapping` properties.

```jsx

<Route path='/user/:userId'>
  <User />
</Route>
// when URL is `/user/alice`, it would render
// <User userId='alice' />

<Route path='/user/:userId'> 
  <Route path='./friend/:userId'>
    <User />
  </Route>
</Route>
// when URL is `/user/alice/friend/bob`, it would render
// <User userId='bob' />
```