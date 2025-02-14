import { BehaviorSubject } from 'rxjs';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { mergeMap } from 'rxjs/operators'
import { compose as recompose, defaultProps } from 'recompose'
import StoreContainer from './StoreContainer.js'
import { noop, functions, isEmpty } from 'lodash'

const reduceReducers = (reducers) => (state, action) =>
    reducers.reduce((result, reducer) => (
        reducer(result, action)
    ), state);

const getNameFunc = func =>
    func.displayName || func.name || func._name || ''

const normalizeEpic = (epic = noop, namespace = 'main') => {
    const name = getNameFunc(epic)
    epic.displayName =
        name.indexOf('___') === -1 ? `${namespace}___${name}` : name
    return epic
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

    // getReducers = () => {
    //     return combineReducers(this.reducerMap)
    // }

    registerReducers = reducerMap => {
        Object.entries(reducerMap).forEach(([name, reducer]) => {
            if (!this.reducerMap[reducer.name]) this.reducerMap[reducer.name] = [];
            this.reducerMap[reducer.name].push(reducer);
        });
        this.store.replaceReducer(this.createRootReducer());
    }

    // updateReducers() {
    //     const newReducers = this.getCombineReducers()
    //     this.store &&
    //         this.store.replaceReducer &&
    //         this.store.replaceReducer(newReducers)
    // }

    registerEpics = epic => {
        if (this.epicRegistry.indexOf(epic) === -1) {
            const epicFuncs = functions(epic)
            epicFuncs.forEach(epicName =>
                this.epic$.next(normalizeEpic(epic[`${epicName}`])),
            )
        }
    }

    createRootReducer = () => {
        if (isEmpty(this.reducerMap)) {
            return (state = {}) => state
        }
        return (
            combineReducers(Object.keys(this.reducerMap).reduce((result, key) => Object.assign(result, {
                [key]: reduceReducers(this.reducerMap[key]),
            }), {}))
        );
    }

    createStore = () => {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        const epicMiddleware = createEpicMiddleware()
        this.store = createStore(this.createRootReducer(), composeEnhancers(applyMiddleware(epicMiddleware)));
        epicMiddleware.run(this.rootEpic)
        return this
    }

    // refreshStore = () => {
    //     this.store.replaceReducer(this.createRootReducer());
    // }

    // withRefreshedStore = (importPromise) => {
    //     return importPromise
    //         .then(module => {
    //             this.refreshStore()
    //             return module
    //         })
    //         .catch(err => {
    //             throw (err)
    //         })
    // }

    createStoreProvider() {
        const enhance = recompose(
            defaultProps({
                store: this.store,
                registerEpics: this.registerEpics.bind(this),
                registerReducers: this.registerReducers.bind(this),
            }),
        )

        return enhance(StoreContainer)
    }

}

export default new StoreBuilder()