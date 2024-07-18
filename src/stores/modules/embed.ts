import { defineStore } from 'pinia';
import { EmbedState } from '../interface';

export const useEmbedStore = defineStore({
  id: 'cyber-embed',
  state: (): EmbedState => ({
    isEmbed: false
  }),
  actions: {
    toggleEmbed(val: boolean) {
      this.isEmbed = val;
    }
  }
});
