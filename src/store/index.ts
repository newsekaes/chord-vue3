import { createPinia } from "pinia";
import { useAnswerStorageStore } from "./answerStorage";
import { useAppStore } from "./app";

export { useAnswerStorageStore, useAppStore }

export default createPinia()