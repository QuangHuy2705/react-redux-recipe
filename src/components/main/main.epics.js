import { filter} from 'rxjs/operators/filter'
import { mapTo } from 'rxjs/operators/mapTo'

export const testEpic = (action$, state) => {
    return action$.pipe(
        filter(action => action.type === 'test'),
        mapTo({type: 'test1'})
    )
}