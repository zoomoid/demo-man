import { InjectionKey } from "vue";
import { createStore, useStore as VuexStore } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { StateTypes, Store } from "./interfaces";
import { mutations } from "./mutations";
import { state } from "./state";

export const key: InjectionKey<Store> = Symbol();

export const store = createStore<StateTypes>({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
});

export function useStore(): Store {
  return VuexStore(key) as Store;
}
