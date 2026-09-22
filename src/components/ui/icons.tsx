/**
 * Icons: Phosphor, one family, one weight ("bold" at small sizes reads like the
 * mono labels). The SSR entry needs no context provider. Always decorative.
 */
import type { IconProps as PhosphorProps } from '@phosphor-icons/react'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  PlusIcon,
  SparkleIcon,
  UserIcon,
  XIcon,
} from '@phosphor-icons/react/ssr'
import type { ComponentType } from 'react'

type IconProps = { className?: string }

const make =
  (Icon: ComponentType<PhosphorProps>, fallback: string) =>
  ({ className = fallback }: IconProps) => <Icon weight="bold" aria-hidden="true" className={className} />

export const ArrowRight = make(ArrowRightIcon, 'size-4')
export const ArrowUpRight = make(ArrowUpRightIcon, 'size-3.5')
export const Check = make(CheckIcon, 'size-3.5')
export const Cross = make(XIcon, 'size-3.5')
export const Copy = make(CopyIcon, 'size-3.5')
export const Plus = make(PlusIcon, 'size-4')
export const Spark = make(SparkleIcon, 'size-3.5')
export const Person = make(UserIcon, 'size-3.5')
