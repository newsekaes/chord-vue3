import { defineStore } from "pinia";
import { AppState } from "./type";

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
        isMobile: 'ontouchstart' in window
    })
})
