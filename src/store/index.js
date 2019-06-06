import { BehaviorSubject } from 'rxjs';
import { combineEpics, createEpicMiddleware  } from 'redux-observable';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { mergeMap } from 'rxjs/operators'
import { epic1, epic2 } from './epics/index'
import { recompose } from 'recompose'

const reduceReducers = (reducers) => (state, action) =>
  reducers.reduce((result, reducer) => (
    reducer(result, action)
  ), state);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class StoreBuilder {
    constructor() {
        this.store = null
        this.epicRegistry = [epic1, epic2]
        this.epic$ = new BehaviorSubject(combineEpics(...this.epicRegistry))
        this.epic$.subscribe((epic) => {
            console.log(`ADDED NEW EPIC`)
        })
        this.rootEpic = (action$, state$) => {
            return this.epic$.pipe(
                mergeMap(epic => {
                    console.log(epic)
                    return epic(action$, state$)
                })
            )
        }

        this.reducerMap = {}
    }

    registerReducers = reducerMap => {
        Object.entries(reducerMap).forEach(([name, reducer]) => {
            if (!this.reducerMap[name]) this.reducerMap[name] = [];
    
            this.reducerMap[name].push(reducer);
        });
    }
    registerEpics = epic => {
        if (this.epicRegistry.indexOf(epic) === -1) {
            this.epicRegistry.push(epic);
            this.epic$.next(epic);
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
        console.log(this.rootEpic)
        const epicMiddleware = createEpicMiddleware();
        this.store = createStore(this.createRootReducer(), composeEnhancers(applyMiddleware(epicMiddleware)));
        epicMiddleware.run(this.rootEpic);
    }

    refreshStore = () => {
        this.store.replaceReducer(this.createRootReducer());
    }

    withRefreshedStore = importPromise => {
        return importPromise
            .then(module => {
                this.refreshStore()
                return module
            })
            .catch(err => {
                throw(err)
            })
    }

    createStoreProvider(store) {
        const enhance = 
    }

}

export default StoreBuilder