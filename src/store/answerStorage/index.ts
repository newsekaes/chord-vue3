import { defineStore } from "pinia";
import { AnswerStorageState, Answer, Answers, Errno } from "./type";
import { Notify } from 'vant'
import { getKeyMaps } from '@/const'

const storageKey = 'chordAnswer'
const storage = window.localStorage
const errMap: { [key in Errno]?: string } = {
    10001: '和弦名称不能为空',
    10002: '和弦名称不能有重复',
    20001: '和弦琴键不能为空'
}

// Def help function
function checkAnswer(this: Answers, answer: Answer, index: number, needNotice = true): { errno: Errno } | boolean {
    let errno: Errno = '0'
    if (answer.name === '') {
        errno = '10001'
    } else if (!(this[index] && this[index].name === answer.name) &&
        this.some(ans => ans.name === answer.name)) {
        errno = '10002'
    } else if (answer.map[0].every(i => i === 0)) {
        errno = '20001'
    }
    if (needNotice) {
        if (errno === '0') return true
        Notify({ type: 'warning', message: errMap[errno] })
        return false
    } else {
        return { errno }
    }
}

function syncStorage(data: Answers) {
    storage.setItem('chordAnswer', JSON.stringify(data))
}

function getStorage(): Answers {
    return JSON.parse('' + storage.getItem(storageKey)) as unknown as Answers
}

function validate(answers: Answers): boolean {
    const nameArray = answers.map(answer => answer.name)
    // 通过 Set 去重
    return nameArray.length === Array.from(new Set(nameArray)).length
}

function initStorage(): Answers {
    let storageAnswers = getStorage()
    if (!(storageAnswers && storageAnswers.length > 0)) storageAnswers = getKeyMaps()
    return storageAnswers
}

export const useAnswerStorageStore = defineStore(
    'answerStorage',
    {
        state: (): AnswerStorageState => ({
            answers: initStorage(),
            categories: ['C'],
            currentCategory: ''
        }),
        actions: {
            setAnswers(answers: Answers) {
                this.answers = answers
            },
            setCategories(categories: string[]) {
                this.categories = categories
            },
            addCategory(category: string) {
                this.categories.push(category)
            },
            setCurrentCategory(currentCategory: string) {
                this.currentCategory = currentCategory
            },
            addAnswer([answer, index]: [Answer, number?]): boolean {
                if (index === undefined) {
                    index = this.answers.length
                }
                if (checkAnswer.call(this.answers, answer, index)) {
                    this.answers.splice(index, 0, answer)
                    syncStorage(this.answers)
                    Notify({ type: 'success', message: '保存成功' })
                    return true
                }
                return false
            },

            delAnswer(index: number): void {
                this.answers.splice(index, 1)
                syncStorage(this.answers)
                Notify({ type: 'success', message: '删除成功' })
            },

            modifyAnswer([index, { name, keys }]: [number, { name: string; keys: number[] }]): boolean {
                const answer = { name, map: [keys] }
                if (checkAnswer.call(this.answers, answer, index)) {
                    const chordData = this.answers[index]
                    chordData.name = name
                    chordData.map = [keys]
                    Notify({ type: 'success', message: '修改成功' })
                    return true
                }
                return false
            },

            changeAnswerOrder([newOrder, oldOrder]: [number, number]) {
                const answer = this.answers.splice(oldOrder, 1)[0]
                this.answers.splice(newOrder, 0, answer)
            },

            loadAnswer(newAnswers: Answers): boolean {
                if (validate(newAnswers)) {
                    this.answers = newAnswers
                    syncStorage(this.answers)
                    return true
                } else {
                    return false
                }
            },
            async importAnswers(answers: Answers) {
                if (await this.loadAnswer(answers)) {
                    Notify({ type: 'success', message: '导入成功' })
                } else {
                    Notify({ type: 'warning', message: '和弦名称不能有重复' })
                }
            },

            changeCategory([index, newCategory]: [number, string]) {
                const chordData = this.answers[index]
                if (newCategory === 'all') {
                    delete chordData.category
                } else {
                    chordData.category = newCategory
                }
                this.setAnswers(this.answers)
                syncStorage(this.answers)
            },

            clearStorage() {
                syncStorage([])
            },
            initDefaultAnswers() {
                return this.loadAnswer(getKeyMaps())
            }
        }
    }
)
