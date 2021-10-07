import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { StateTypes, Store } from "./interfaces";
import { mutations } from "./mutations";
import { state } from "./state";

export const key: InjectionKey<Store<StateTypes>> = Symbol()

export const store = createStore<StateTypes>({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
});

export function useStore(){
  return baseUseStore(key);
}
