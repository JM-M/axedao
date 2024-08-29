'use client';

import useGroupsList from '@/hooks/useGroupList';
import { Input } from '@nextui-org/input';
import { Search } from 'lucide-react';
import GroupsGrid from './GroupsGrid';

const Groups = () => {
  const { groups, isLoading, query, setQuery, totalGroups, isInitialized } = useGroupsList();
  const { searchTerm } = query;
  const setSearchTerm = (searchTerm: string) => setQuery({ searchTerm });

  return (
    <div className="flex flex-col gap-4 pt-5">
      <div className="flex h-fit items-center justify-between gap-3">
        <Input
          isClearable
          onClear={() => setSearchTerm('')}
          className="w-full md:max-w-sm"
          placeholder="Search by name"
          startContent={<Search className="h-4 w-4" />}
          labelPlacement="outside"
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        {typeof totalGroups === 'number' && (
          <span className="ml-auto text-small text-default-400">Total number of groups: {totalGroups}</span>
        )}
      </div>
      <GroupsGrid groups={groups} isLoading={isLoading || !isInitialized} />
    </div>
  );
};
export default Groups;
