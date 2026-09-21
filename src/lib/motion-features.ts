// Loaded lazily by <LazyMotion> in the root route, so Motion's animation
// engine stays out of the critical bundle; `m.*` components render their
// static state until it arrives.
export { domAnimation as default } from 'motion/react'
