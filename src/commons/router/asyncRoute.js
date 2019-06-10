import React, { Component, PropTypes } from 'react'
import { isArray } from 'lodash'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/observable/zip'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/fromPromise'

const moduleDefaultExport = module => module.default || module

function esModule(module, forceArray) {
  if (isArray(module)) {
    return module.map(moduleDefaultExport)
  }

  const defualted = moduleDefaultExport(module)
  return forceArray ? [defualted] : defualted
}

export default function asyncRoute(getComponent, getReducers, getEpics, beforeMount = Promise.resolve()) {
  return class AsyncRoute extends Component {

    static Component = null
    static ReducersLoaded = false
    static EpicsLoaded = false

    state = {
      Component: AsyncRoute.Component,
      ReducersLoaded: AsyncRoute.ReducersLoaded,
      EpicsLoaded: AsyncRoute.EpicsLoaded
    }

    componentWillMount() {
      console.log(`COMPONENT WILL MOUNT`, this.context)
      const { Component, ReducersLoaded, EpicsLoaded } = this.state
      const shouldLoadReducers = !ReducersLoaded && getReducers
      const shouldLoadEpics = !EpicsLoaded && getEpics

      if (!Component || shouldLoadReducers || shouldLoadEpics) {
        this._componentWillUnmountSubject = new Subject()

        const streams = [
          Component
            ? Observable.of(Component)
                .takeUntil(this._componentWillUnmountSubject)
            : Observable.fromPromise(getComponent())
                .map(esModule)
                .map(Component => {
                  console.log(`LOADED`, Component)
                  AsyncRoute.Component = Component
                  return Component
                })
                .takeUntil(this._componentWillUnmountSubject)
        ]

        if (shouldLoadReducers) {
          streams.push(
            Observable.fromPromise(getReducers())
              .map(module => esModule(module, true))
              .map(reducers => {
                this.context.registerReducers(reducers)
                AsyncRoute.ReducersLoaded = true
              })
              .takeUntil(this._componentWillUnmountSubject)
          )
          console.log(this.state)
        }

        if (shouldLoadEpics) {
            streams.push(
                Observable.fromPromise(getEpics())
                .map(epics => {
                  this.context.registerEpics(epics)
                  AsyncRoute.EpicsLoaded = true
                })
                .takeUntil(this._componentWillUnmountSubject)
            )
            console.log(this.state)
        }

        Observable.zip(...streams)
          .takeUntil(this._componentWillUnmountSubject)
          .subscribe(([Component]) => {
            if (this._mounted) {
              this.setState({Component})
            } else {
              this.setState({Component})
            }

            this._componentWillUnmountSubject.unsubscribe()
          })
      }
    }

    componentDidMount() {
      this._mounted = true
    }

    componentWillUnmount() {
      if (this._componentWillUnmountSubject && !this._componentWillUnmountSubject.closed) {
        this._componentWillUnmountSubject.next()
        this._componentWillUnmountSubject.unsubscribe()
      }
    }

    render() {
      console.log(this.state)
      const { Component } = this.state
      return Component ? <Component {...this.props} /> : null
    }
  }
}