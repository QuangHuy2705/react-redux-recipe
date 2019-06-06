import { pipe, mergeMap, mapTo, filter } from 'rxjs/operators'

export const epic1 = (action$, state) => {
    return action$.pipe(
        filter(action => action.type === 'test'),
        mapTo({ type: 'TEST' })
    )
}

export const epic2 = (action$, state) => {
    return action$.pipe(
        filter(action => action.type === 'test'),
        mapTo({ type: 'TEST' })
    )
}