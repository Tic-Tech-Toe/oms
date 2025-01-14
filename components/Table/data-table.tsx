"use client"

import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
  }

const DataTable<TData,TValue> = ({columns, data}:DataTableProps<TData,TValue>) => {
  return (
    <div>DataTable</div>
  )
}

export default DataTable