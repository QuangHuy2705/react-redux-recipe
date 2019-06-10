import { pipe, mergeMap, mapTo, filter } from 'rxjs/operators'

export default function epic1(action$, state) {
    return action$.pipe(
        filter(action => action.type === 'test'),
        mapTo({ type: 'TEST' })
    )
}