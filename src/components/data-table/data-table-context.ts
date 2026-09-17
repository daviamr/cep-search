import * as React from 'react'

import type { DataTableContextValue } from './@types/types'

export const DataTableContext = React.createContext<DataTableContextValue<unknown> | null>(null)
