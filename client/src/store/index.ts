import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { StateTypes } from "./interfaces";
import { mutations } from "./mutations";
import { state } from "./state";

export const key: InjectionKey<Store<StateTypes>> = Symbol();

export const store = createStore<StateTypes>({
  strict: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {}
});

export function useStore(): Store<StateTypes> {
  return baseUseStore(key);
}
