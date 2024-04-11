import { h } from './dom/h'
import { render } from './fiber/reconciler'
// import { createElement } from './dom/dom'
import {
  useState,
  useEffect,
  useLayout,
  useReducer,
  useCallback,
  useMemo,
  useRef,
} from './fiber/hooks'

const _react = {
  h,
  render,
  useState,
  useEffect,
  useLayout,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  createElement: h,
}

export default _react

export {
  h,
  render,
  useState,
  useEffect,
  useLayout,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  h as createElement,
}
