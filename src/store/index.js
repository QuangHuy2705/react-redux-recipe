import { BehaviorSubject } from 'rxjs';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { mergeMap, filter, mapTo } from 'rxjs/operators'
import { epic1, epic2 } from './epics/index'
import { compose as recompose, defaultProps } from 'recompose'
import StoreContainer from './store_provider'
import { noop, functions, isObject } from 'lodash'

const reduceReducers = (reducers) => (state, action) =>
    reducers.reduce((result, reducer) => (
        reducer(result, action)
    ), state);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const getNameFunc = func =>
  func.displayName || func.name || func._name || ''

const normalizeEpic = (epic = noop, namespace = 'main') => {
  const name = getNameFunc(epic)
  epic.displayName =
    name.indexOf('___') === -1 ? `${namespace}___${name}` : name
  return epic
}

const setFnName = (fn, name) =>
  Object.defineProperty(fn, 'name', { value: name })

const normalizeReducer = (key, reducer) => {
    const temp = reducer || noop
    return setFnName(temp, key)
  }

class StoreBuilder {
    constructor() {
        this.store = null
        this.epicRegistry = []
        this.epic$ = new BehaviorSubject(combineEpics(...this.epicRegistry))
        this.epic$.subscribe((epic) => {
            console.log(`ADDED NEW EPIC`)
        })
        this.rootEpic = (action$, state$) => this.epic$.pipe(
            mergeMap(epic => epic(action$, state$))
          )

        this.reducerMap = {}
    }

    getReducers = () => {
        return combineReducers(this.reducerMap)
    }
 
    registerReducers = reducerMap => {
        // Object.entries(reducerMap).forEach(([name, reducer]) => {
        //     if (!this.reducerMap[name]) this.reducerMap[name] = [];

        //     this.reducerMap[name].push(reducer);
        // });
        // this.store.replaceReducer(this.createRootReducer());
        if (isObject(reducerMap)) {
            let appendedReducer = Map()
            functions(reducerMap).forEach(reducerKey => {
              if (this.reducerRegistry.has(reducerKey)) {
                return this
              } else {
                const reducer = normalizeReducer(
                  reducerKey,
                  reducerMap[`${reducerKey}`],
                )
                appendedReducer = appendedReducer.set(reducerKey, reducer)
              }
            })
            this.reducerRegistry = this.reducerRegistry.merge(appendedReducer)
            this.updateReducers()
            return this
          }
    }

    updateReducers() {
        const newReducers = this.getCombineReducers()
        this.store &&
          this.store.replaceReducer &&
          this.store.replaceReducer(newReducers)
      }

    registerEpics = epic => {
        if (this.epicRegistry.indexOf(epic) === -1) {
            // this.epicRegistry.push(epic);
            // console.log(this.epicRegistry)
            // this.epic$.next(
            //     epic
            // );
            const epicFuncs = functions(epic)
            epicFuncs.forEach(epicName =>
              this.epic$.next(normalizeEpic(epic[`${epicName}`])),
            )
        }
    }

    createRootReducer = () => {
        return (
            combineReducers(Object.keys(this.reducerMap).reduce((result, key) => Object.assign(result, {
                [key]: reduceReducers(this.reducerMap[key]),
            }), {}))
        );
    }

    createStore = () => {
        const epicMiddleware = createEpicMiddleware()
        this.store = createStore(this.getReducers(), composeEnhancers(applyMiddleware(epicMiddleware)));
        epicMiddleware.run(this.rootEpic)
        return this
    }

    refreshStore = () => {
        this.store.replaceReducer(this.createRootReducer());
    }

    withRefreshedStore = (importPromise) => {
        return importPromise
            .then(module => {
                this.refreshStore()
                return module
            })
            .catch(err => {
                throw (err)
            })
    }

    createStoreProvider() {
        const enhance = recompose(
            defaultProps({
                store: this.store,
                registerEpics: this.registerEpics.bind(this),
                registerReducers: this.registerReducers.bind(this),
                withRefreshedStore: this.withRefreshedStore.bind(this),
            }),
        )

        return enhance(StoreContainer)
    }

}

export default new StoreBuilder()