import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function PaginationSkeleton() {
  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Label htmlFor='rows-per-page'>Lignes par page</Label>
          <Select disabled value='20'>
            <SelectTrigger className='w-20' id='rows-per-page'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align='start'>
              <SelectGroup>
                <SelectItem value='20'>20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Skeleton className='h-4 w-48' />
      </div>

      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem>
            <Skeleton className='h-10 w-20' />
          </PaginationItem>
          <PaginationItem>
            <Skeleton className='h-10 w-10' />
          </PaginationItem>
          <PaginationItem>
            <Skeleton className='h-10 w-10' />
          </PaginationItem>
          <PaginationItem>
            <Skeleton className='h-10 w-20' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
