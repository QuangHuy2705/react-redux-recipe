import asyncRoute from '../../commons/router/asyncRoute'

const container = asyncRoute(
    () => import('./main.container.js'),
    () => import('./main.reducers.js'),
    () => import('./main.epics.js'),
)

export default container