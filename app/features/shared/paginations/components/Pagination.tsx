'use client';

import { Icon } from '@iconify/react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  Pagination as PaginationRoot,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 25, 50, 100];

export interface PaginationProps {
  className?: string;
  currentPage: number;
  itemLabel?: string;
  itemLabelPlural?: string;
  ofLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  pageSizeOptions?: number[];
  rowsPerPageLabel?: string;
  siblingCount?: number;
  totalCount: number;
  totalPages: number;
}

export function Pagination({
  className,
  currentPage,
  itemLabel = 'élément',
  itemLabelPlural,
  ofLabel = 'sur',
  onPageChange,
  onPageSizeChange,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  rowsPerPageLabel = 'Lignes par page',
  siblingCount = 1,
  totalCount,
  totalPages,
}: PaginationProps) {
  const range = React.useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const plural = itemLabelPlural ?? `${itemLabel}s`;
  const countText = `${totalCount} ${totalCount !== 1 ? plural : itemLabel}`;
  const pageInfo = `Page ${currentPage} ${ofLabel} ${totalPages} (${countText})`;

  const options = React.useMemo(
    () =>
      Array.from(new Set([pageSize, ...pageSizeOptions])).sort((a, b) => a - b),
    [pageSize, pageSizeOptions]
  );

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4',
        className
      )}
    >
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Label htmlFor='rows-per-page'>{rowsPerPageLabel}</Label>
          <Select
            onValueChange={v => onPageSizeChange(Number(v))}
            value={String(pageSize)}
          >
            <SelectTrigger className='w-20' id='rows-per-page'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align='start'>
              <SelectGroup>
                {options.map(n => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className='text-sm text-muted-foreground'>{pageInfo}</p>
      </div>

      <PaginationRoot className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem>
            <Button
              aria-label='Aller à la page précédente'
              className='gap-1 px-2.5 sm:pl-2.5'
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              size='default'
              variant='ghost'
            >
              <Icon icon='mdi:chevron-left' />
              <span className='hidden sm:inline'>Précédent</span>
            </Button>
          </PaginationItem>

          {range.map((item, i) =>
            item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  aria-current={currentPage === item ? 'page' : undefined}
                  onClick={() => onPageChange(item)}
                  size='icon'
                  variant={currentPage === item ? 'outline' : 'ghost'}
                >
                  {item}
                </Button>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <Button
              aria-label='Aller à la page suivante'
              className='gap-1 px-2.5 sm:pr-2.5'
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              size='default'
              variant='ghost'
            >
              <span className='hidden sm:inline'>Suivant</span>
              <Icon icon='mdi:chevron-right' />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    </div>
  );
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): ('ellipsis' | number)[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);
  const items: ('ellipsis' | number)[] = [1];

  if (left > 2) items.push('ellipsis');
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push('ellipsis');
  if (totalPages > 1) items.push(totalPages);

  return items;
}
