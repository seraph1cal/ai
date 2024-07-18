import { defineStore } from 'pinia';
import { UserState } from '@/stores/interface';
import piniaPersistConfig from '@/stores/persist';

export const useUserStore = defineStore({
  id: 'cyber-user',
  state: (): UserState => ({
    token: '',
    userInfo: { name: 'Cyber' }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig('cyber-user')
});
