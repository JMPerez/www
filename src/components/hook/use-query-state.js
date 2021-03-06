import stringify from 'fast-safe-stringify'
import { useState, useEffect } from 'react'
import { decode, encode } from 'qss'
import { navigate } from 'gatsby'
import { isSSR } from 'helpers'

const eq = (str1, str2) => stringify(str1) === stringify(str2)

const fromLocation = isSSR
  ? () => ({})
  : () => decode(window.location.search.substring(1))

const condition = isSSR ? [] : [window.location.search]

export const useQueryState = () => {
  const [query, setQuery] = useState(fromLocation())

  useEffect(() => {
    const newQuery = fromLocation()
    if (!eq(query, newQuery)) setQuery(fromLocation())
  }, condition)

  const set = (obj = {}, { navigate: isNavigate = true } = {}) => {
    const newQuery = { ...query, ...obj }
    if (isNavigate) navigate(`${window.location.pathname}?${encode(newQuery)}`)
  }

  return [query, set]
}
