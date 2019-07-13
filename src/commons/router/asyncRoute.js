import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isArray } from 'lodash'
import { Observable, of, zip, from } from 'rxjs'
import { Subject } from 'rxjs/Subject'
import { map, takeUntil } from 'rxjs/operators';

const moduleDefaultExport = module => module.default || module


function esModule(module, forceArray) {
  if (isArray(module)) {
    return module.map(moduleDefaultExport)
  }

  const defualted = moduleDefaultExport(module)
  return forceArray ? [defualted] : defualted
}

export default function asyncRoute(getComponent, getReducers, getEpics) {

  return class AsyncRoute extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired,
      registerEpics: PropTypes.func.isRequired,
      registerReducers: PropTypes.func.isRequired,
      // withRefreshedStore: PropTypes.func.isRequired,
    }

    static Component = null
    static ReducersLoaded = false
    static EpicsLoaded = false

    state = {
      Component: AsyncRoute.Component,
      ReducersLoaded: AsyncRoute.ReducersLoaded,
      EpicsLoaded: AsyncRoute.EpicsLoaded,
      error: null
    }

    componentDidMount() {
      console.log(Observable)

      const { Component, ReducersLoaded, EpicsLoaded } = this.state
      const shouldLoadReducers = !ReducersLoaded && getReducers
      const shouldLoadEpics = !EpicsLoaded && getEpics
      const { registerEpics, registerReducers } = this.context

      if (!Component || shouldLoadReducers || shouldLoadEpics) {
        this._componentWillUnmountSubject = new Subject()
        const streams = [
          Component
            ? of(Component)
              .pipe(
                takeUntil(this._componentWillUnmountSubject)
              )
            : from(getComponent)
              .pipe(
                map(esModule),
                map(Component => {
                  console.log(`LOADED`, Component)
                  AsyncRoute.Component = Component
                  return Component
                }),
                takeUntil(this._componentWillUnmountSubject)
              )
        ]

        if (shouldLoadReducers) {
          streams.push(
            from(getReducers)
              .pipe(
                map(module => esModule(module, true)),
                map(reducers => {
                  console.log(`newReducers`, reducers)
                  registerReducers(reducers)
                  AsyncRoute.ReducersLoaded = true
                }),
                takeUntil(this._componentWillUnmountSubject)
              )

          )
        }

        if (shouldLoadEpics) {
          streams.push(
            from(getEpics)
              .pipe(
                map(epics => {
                  console.log(`NEW EPICS`, epics)
                  registerEpics(epics)
                  AsyncRoute.EpicsLoaded = true
                }),
                takeUntil(this._componentWillUnmountSubject)
              )

          )
        }
        zip(...streams)
          .pipe(
            takeUntil(this._componentWillUnmountSubject),
          )
          .subscribe(
            ([AsyncComponent]) => {
              this.setState({ Component: AsyncComponent })
              this._componentWillUnmountSubject.unsubscribe()
            },
            error => {
              console.log(error)
              this.setState({ error })
            },
          )
      }
      this._mounted = true
    }


    componentWillUnmount() {
      if (this._componentWillUnmountSubject && !this._componentWillUnmountSubject.closed) {
        this._componentWillUnmountSubject.next()
        this._componentWillUnmountSubject.unsubscribe()
      }
    }

    render() {
      const { Component } = this.state
      return Component ? <Component {...this.props} /> : null
    }
  }
}