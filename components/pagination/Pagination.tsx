import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import PageSelection from './PageSelection'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { OrderType } from '@/types/orderType';
import { PaginationType } from '../Table/TableArea';
import { Table } from '@tanstack/react-table';

const Pagination = ({
    table,
    pagination,
    setPagination
}:{
    table: Table<OrderType>;
    pagination: PaginationType;
    setPagination: Dispatch<SetStateAction<PaginationType>>;
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    },[])

    if(!isClient) return null;  
  return (
    <div className='relative w-full h-[84px] max-sm:h-[210px] max-sm:pt-4 max-sm:pb-4 overflow-hidden flex justify-between items-center px-6 rounded-b-xl bg-light-background dark:bg-zinc-900 border-t max-sm:flex-col max-sm:gap-2'>
        <PageSelection pagination={pagination} setPagination={setPagination} />
        <div className='flex gap-6 items-center max-sm:flex-col max-sm:mt-4 max-sm:gap-2'>
            <span className='text-gray-500'>Page {pagination.pageIndex+1} of {table.getPageCount()}</span>
            <div className='flex items-center justify-end space-x-2'>

                {/* Starting Page */}
                <Button variant="outline" className='size-9 w-12' size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    <ChevronFirst />
                </Button>

                {/* Previous Page  */}
                <Button variant="outline" className='size-9 w-12' size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <ChevronLeft />
                </Button>

                {/* Next Page  */}
                <Button variant="outline" className='size-9 w-12' size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <ChevronRight />
                </Button>

                {/* Last Page  */}
                <Button variant="outline" className='size-9 w-12' size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    <ChevronLast  />
                </Button>
            </div>
        </div>  
    </div>
  )
}

export default Pagination