'use client'
import { useEffect } from 'react'
import { captureTrackingParams } from '../lib/tracking'

// Mounted once in the root layout so gclid/gbraid/wbraid/UTM params are
// captured on whichever page a visitor lands on.
export default function TrackingCapture() {
  useEffect(() => {
    captureTrackingParams()
  }, [])
  return null
}
