import AsynRoute from '../../commons/router/asyncRoute'

export default AsynRoute(
    () => import('./main_container'),
    () => import('./main_reducers'),
    () =>import('./main_epics')
)