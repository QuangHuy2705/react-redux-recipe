// import { createStore, combineReducers, compose, applyMiddleware  } from 'redux';
// import { createEpicMiddleware } from 'redux-observable';
// import { BehaviorSubject } from 'rxjs'
// import { combineEpics } from 'redux-observable'
// import { mergeMap } from 'rxjs/operators'
// import { epic1, epic2 } from './epics/index'

// const reduceReducers = (reducers) => (state, action) =>
//   reducers.reduce((result, reducer) => (
//     reducer(result, action)
//   ), state);

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const storeManager = {
//   store: null,

//   epicRegistry: [epic1, epic2],

//   epic$: new BehaviorSubject(combineEpics(epic1, epic2)),

//   rootEpic(action$, state$)  {
//         this.epic$.pipe(
//         mergeMap(epic => epic(action$, state$))
//     )
//   },

//   reducerMap: {},

//   registerReducers(reducerMap) {
//     Object.entries(reducerMap).forEach(([name, reducer]) => {
//       if (!this.reducerMap[name]) this.reducerMap[name] = [];

//       this.reducerMap[name].push(reducer);
//     });
//   },

//   registerEpics(epic) {
//     if (this.epicRegistry.indexOf(epic) === -1) {
//         this.epicRegistry.push(epic);
//         this.epic$.next(epic);
//       }
//   },

//   createRootReducer() {
//     return (
//       combineReducers(Object.keys(this.reducerMap).reduce((result, key) => Object.assign(result, {
//         [key]: reduceReducers(this.reducerMap[key]),
//       }), {}))
//     );
//   },

//   createStore(...args) {
//     const epicMiddleware = createEpicMiddleware();
//     this.store = createStore(this.createRootReducer(), composeEnhancers(applyMiddleware(epicMiddleware)));
//     epicMiddleware.run(this.rootEpic);
//     return this.store;
//   },

//   refreshStore() {
//     this.store.replaceReducer(this.createRootReducer());
//   },
// };

// export const withRefreshedStore = (importPromise) => (
//   importPromise
//     .then((module) => {
//       this.refreshStore();
//       return module;
//     },
//     (error) => {
//       throw error;
//     })
// );

// export default storeManager;