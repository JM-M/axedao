import { GroupsQueryParams } from '@/hooks/useGroupList';
import { Group } from '@/types/model';
import { generateErrorMessage } from '@/utils';
import axios from 'axios';
import { isNil, omitBy } from 'lodash';
import { Values } from 'nuqs';
import { create } from 'zustand';

type FetchGroupsQuery = Partial<Values<GroupsQueryParams>>;

export type GroupsState = {
  searchResults: Group[];
  totalGroups: number | null;
  pageSize: number;
  hasMoreResults: boolean; // flag indicating there are more search results that can be retrieved for the current filter settings
  isInitialized: boolean;
  isLoading: boolean;
  loadGroupsError?: string;
  query?: FetchGroupsQuery;
};

type GroupsActions = {
  initialize: (query?: FetchGroupsQuery) => Promise<void>;
  search: (query?: FetchGroupsQuery) => Promise<void>;
  loadNextPage: () => Promise<void>;
};

export type GroupsStore = GroupsState & { actions: GroupsActions };

const DEFAULT_PROPS: GroupsState = {
  searchResults: [],
  totalGroups: null,
  pageSize: 20,
  hasMoreResults: false,
  isInitialized: false,
  isLoading: false,
};

const useGroupsStore = create<GroupsStore>()((set, get) => ({
  ...DEFAULT_PROPS,
  actions: {
    initialize: async (query): Promise<void> => {
      const { actions, isInitialized, isLoading } = get();
      if (isInitialized || isLoading) return;
      set({ ...DEFAULT_PROPS, query });
      actions.loadNextPage();
    },
    search: async (query): Promise<void> => {
      const { actions, isLoading } = get();
      if (isLoading) return;
      set({ ...DEFAULT_PROPS, query });
      actions.loadNextPage();
    },
    loadNextPage: async (): Promise<void> => {
      const { isLoading } = get();
      if (isLoading) return;
      set({ isLoading: true });
      try {
        const { pageSize, searchResults, query } = get();
        const offset = searchResults.length;
        const params = omitBy(
          {
            offset: offset,
            limit: pageSize,
            ...query,
          },
          isNil,
        );

        const { data } = await axios.get('/api/groups', { params });
        if (data?.error) {
          throw new Error(data?.message);
        }

        if (Array.isArray(data?.groups)) {
          // If a full pageSize of results was retrieved, there are likely more results, so setting true.
          // The exception is if the total result size % pageSize === 0
          // in which case the user receives the correct feedback on the next invocation of this function.
          set((state) => ({
            searchResults: [...state.searchResults, ...data.groups],
            totalGroups: data.count,
            hasMoreResults: data.length === state.pageSize,
            isInitialized: true,
          }));
        }
      } catch (error) {
        const message = generateErrorMessage(error, 'An error occured while fetching groups');
        set({ loadGroupsError: message });
      }
      set({ isLoading: false });
    },
  },
}));

export default useGroupsStore;

export const useGroupsActions = (): GroupsActions => useGroupsStore((state) => state.actions);

export const useGroups = (): Group[] => useGroupsStore((state) => state.searchResults);

export const useTotalGroups = (): number | null => useGroupsStore((state) => state.totalGroups);

export const useGroupsHasMoreResults = (): boolean => useGroupsStore((state) => state.hasMoreResults);

export const useGroupsPageSize = (): number => useGroupsStore((state) => state.pageSize);

export const useGroupsIsInitialized = (): boolean => useGroupsStore((state) => state.isInitialized);

export const useIsLoadingGroups = (): boolean => useGroupsStore((state) => state.isLoading);

export const useLoadGroupsError = (): string | undefined => useGroupsStore((state) => state.loadGroupsError);
