import { GroupProfile } from '@/types/model';
import { generateErrorMessage } from '@/utils';
import axios from 'axios';
import { create } from 'zustand';

export type GroupProfileState = {
  groupProfile: GroupProfile;
  isGroupAdmin: boolean;
  isInitializingGroupProfile: boolean;
  isGroupProfileInitialized: boolean;
  initializeGroupError?: string;
};

type GroupProfileActions = {
  initialize: (id: string) => Promise<void>;
};

export type GroupStore = GroupProfileState & { actions: GroupProfileActions };

const now = new Date();
const DEFAULT_PROPS: GroupProfileState = {
  groupProfile: {
    id: '',
    createdAt: now,
    name: '',
    updatedAt: now,
    description: null,
    logo: null,
    banner: null,
    leader: null,
    founder: null,
    verified: false,
    links: [],
  },
  isGroupAdmin: false,
  isGroupProfileInitialized: false,
  isInitializingGroupProfile: false,
};

const useGroupProfileStore = create<GroupStore>()((set, get) => ({
  ...DEFAULT_PROPS,
  actions: {
    initialize: async (id: string) => {
      const { isInitializingGroupProfile } = get();
      if (isInitializingGroupProfile) return;
      set({ isInitializingGroupProfile: true });
      try {
        const { data } = await axios.get(`/api/groups/${id}`);
        if (!data?.groupProfile) throw new Error();
        const { groupProfile, isAdmin } = data || {};
        set({ groupProfile, isGroupAdmin: isAdmin, isGroupProfileInitialized: true });
      } catch (error: unknown) {
        console.log(error);
        const message = generateErrorMessage(error, 'An error occured while fetching group');
        set({ initializeGroupError: message });
      }
      set({ isInitializingGroupProfile: false });
    },
  },
}));

export default useGroupProfileStore;

export const useGroupProfileActions = (): GroupProfileActions => useGroupProfileStore((state) => state.actions);

export const useGroupProfile = (): GroupProfile => useGroupProfileStore((state) => state.groupProfile);

export const useIsInitializingGroupProfile = (): boolean =>
  useGroupProfileStore((state) => state.isInitializingGroupProfile);

export const useIsGroupProfileInitialized = (): boolean =>
  useGroupProfileStore((state) => state.isGroupProfileInitialized);

export const useInitializeGroupError = (): string | undefined =>
  useGroupProfileStore((state) => state.initializeGroupError);

export const useIsGroupAdmin = (): boolean => useGroupProfileStore((state) => state.isGroupAdmin);
