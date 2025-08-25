'use client'

import { Suspense } from 'react'
import { RouteLoading } from './route-loading'

export function RouteLoadingWrapper() {
  return (
    <Suspense fallback={null}>
      <RouteLoading />
    </Suspense>
  )
}