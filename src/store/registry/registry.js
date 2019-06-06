import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export default class Registry {
    constructor(baseReducers) {
        this._reducers = baseReducers
        this._epic$ = new BehaviorSubject()
        this.epics$.subscribe(() => console.log(`ADDED NEW EPIC`))
        this.middleware = []
    }

    store = null

    injectReducers(reducers) {
        Object.assign(
        this._reducers,
        reducers.reduce((acc, reducer) => {
            acc[reducer.reducer] = reducer
            return acc
        }, {})
        )

        this.store.replaceReducer(combineReducers(this._reducers))
    }

    injectEpics(epic) {
        if (this._epic$.indexOf(epic) === -1) {
            this._epic$.push(epic);
            epic.next(epic);
        }
        this.store()
    }

    get initialEpics() {
        return combineEpics(this._epic$)
    }

    get initialReducers() {
        return combineReducers(this._reducers)
    }
}