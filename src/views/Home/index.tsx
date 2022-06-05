import { defineComponent, ref, nextTick } from "vue";
import { useAnswerStorageStore } from '@/store'
import { storeToRefs } from "pinia";

import ChordJson from '@/components/ChordJson'
import ChordCard from './ChordCard'
import Tool from './Tool'

import style from './index.module.scss'

export default defineComponent({
  name: 'VHome',
  setup() {
    const editing = ref(false)
    const showAnswer = ref(false)
    const showPopup = ref(false)
    const showTab = ref(false)
    const showOrder = ref(false)
    const sortCategory = ref(false)
    const answerStorageStore = useAnswerStorageStore()
    const { answers, currentCategory } = storeToRefs(answerStorageStore)
    const { addAnswer, delAnswer, modifyAnswer, changeAnswerOrder, changeCategory } = answerStorageStore
    const addChord = ({ name, keys }: { name: string; keys: number[]}) => {
      debugger
      addAnswer([{
        name: name,
        map: [keys],
        category: currentCategory.value || undefined
      }])
    }
  
    const delChord = (index: number) => {
      delAnswer(index)
    }
  
    const modifyChord = (index: number, { name, keys }: { name: string; keys: number[]}) => {
      modifyAnswer([index, { name, keys }])
    }
    return () => (
      <div class={style.home}>
        <div class={style.chordCardArea}>
          <div class={style.chordCardBox}>
            {
              answers.value.filter(answer => {
                if (currentCategory.value === '') {
                  return true
                } else {
                  return currentCategory.value === answer.category
                }
              }).map((answer, index) => (
                <ChordCard
                  index={index}
                  isEditing={editing.value}
                  showAnswer={showAnswer.value}
                  showOrder={showOrder.value}
                  sortCategory={sortCategory.value}
                  key={answer.name}
                  answer={answer.map[0]}
                  name={answer.name}
                  category={answer.category}
                  onAdd={addChord}
                  onDel={delChord.bind(this, index)}
                  onModify={(e: { name: string; keys: number[] }) => { modifyChord.bind(this, index, e) }}
                  onOrderChange={
                    (direction: 'up' | 'down') => {
                      const cardSplitDis = document.querySelectorAll('.' + style.chordCard)[0].getBoundingClientRect().height + 20
                      const scrollTop = document.documentElement.scrollTop
                      changeAnswerOrder([index + (direction === 'down' ? 1 : -1), index])
                      nextTick(() => { document.documentElement.scrollTop = scrollTop + (direction === 'down' ? cardSplitDis : -cardSplitDis) })
                    }
                  }
                  onCategoryChange={ (newCategory: string) => { changeCategory([index, newCategory]) } }
                  class={style.chordCard}
                />
              ))
            }
          </div>
          <div class={style.chordCreateBox} v-show={editing.value}>
            <ChordCard index={answers.value.length} class={style.chordCard} is-create-box={true} onAdd={addChord} key={answers.value.length + 1}/>
          </div>
        </div>
        <ChordJson show={showTab.value} onUpdate:show={(val: boolean) => { showTab.value = val }}/>
        <Tool
          show={showPopup.value}
          editing={editing.value}
          showAnswer={showAnswer.value}
          showOrder={showOrder.value}
          sortCategory={sortCategory.value}
          onReplayClick={() => { showPopup.value = false; showTab.value = true }}
          onUpdate:show={(val: boolean) => { showPopup.value = val }}
          onUpdate:editing={(val: boolean) => { editing.value = val }}
          onUpdate:showAnswer={(val: boolean) => { showAnswer.value = val }}
          onUpdate:showOrder={(val: boolean) => { showOrder.value = val }}
          onUpdate:sortCategory={(val: boolean) => { sortCategory.value = val }}
        />
        <div class={style.chordTabShow} onClick={() => { showPopup.value = !showPopup.value }}><van-icon name="ellipsis" class={style.chordTabShowIcon}/></div>
      </div>
    )
  }
})
