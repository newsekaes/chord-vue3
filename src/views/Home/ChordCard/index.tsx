import { defineComponent, ref, computed, PropType, toRefs, watch, nextTick } from "vue";
import { Field } from 'vant'

import { useAnswerStorageStore } from '@/store'
import Chord from '@/components/Chord'

import style from './index.module.scss'

interface PickColumn {
  value: string;
  text: string;
}

export default defineComponent({
  name: 'ChordCard',
  props: {
    name: {
      type: String,
      default: '',
      require: true
    },
    answer: {
      type: Array as PropType<number[]>,
      default: () => [],
      require: true
    },
    isCreateBox: {
      type: Boolean,
      default: false,
      require: true
    },
    isEditing: {
      type: Boolean,
      default: false,
      require: true
    },
    showAnswer: {
      type: Boolean,
      default: false,
      require: true
    },
    sortCategory: {
      type: Boolean,
      default: false,
      require: true
    },
    showOrder: {
      type: Boolean,
      default: false,
      require: true
    },
    index: {
      type: Number,
      default: null,
      require: true
    },
    category: {
      type: String,
      default: '无',
      require: true
    },
  },
  emits: ['add', 'del', 'modify', 'orderChange', 'categoryChange', 'showAnswer'],
  setup (props, context) {
    const { name, showAnswer, answer } = toRefs(props)
    const answerStorageStore = useAnswerStorageStore()
    const editStatus = ref<0 | 1 | 2>(0) // 0: 不编辑；1：再编辑；2：删除
    const nameModel = ref('')
    const columns = computed((): PickColumn[] => {
      return [
        { text: '无', value: 'all' },
        ...answerStorageStore.categories.map(c => ({ text: c, value: c }))
      ]
    })

    const chordCreate = ref<InstanceType<typeof Chord>>()
    const chord =  ref<InstanceType<typeof Chord>>()
    const nameField = ref<typeof Field>()

    const addChord = () => {
      debugger
      context.emit('add', {
        name: nameModel.value,
        keys: chordCreate.value?.getKeys() || []
      })
    
    }

    const delChord = () => {
      context.emit('del', name.value)
    }

    const modifyChord = () => {
      context.emit('modify', {
        name: nameModel.value,
        keys: chord.value?.getKeys() || []
      })
    }

    const chordOrderChange = (direction: 'up' | 'down') => {
      context.emit('orderChange', direction)
    }

    const categorySelected = (val: string) => {
      context.emit('categoryChange', val)
    }

    watch(
      () => showAnswer.value,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          if (answer) {
            if (newVal) {
              chord.value?.showAnswer()
            } else {
              chord.value?.clear()
            }
          }
        }
      },
      {
        immediate: true
      }
    )

    const initEdit = async() => {
      editStatus.value = 1
      nameModel.value = name.value
      await nextTick();
      nameField.value?.focus()
    }
  
    const initDel = () => {
      editStatus.value = 2
    }
  
    const editDone = () => {
      if (editStatus.value === 1) {
        modifyChord()
      } else if (editStatus.value === 2) {
        delChord()
      }
      editClear()
    }
  
    const editClear = () => {
      editStatus.value = 0
      nameModel.value = ''
    }

    return {
      nameModel,
      editStatus,
      columns,
      chordCreate,
      chord,
      nameField,
      initDel,
      initEdit,
      addChord,
      editClear,
      editDone,
      chordOrderChange,
      categorySelected,
    }
  },
  render () {
    if (this.isCreateBox) {
      // 新建和弦的UI
      return (
        <div class={[style.chordCard, style.chordCardCreate]}>
          <h3 class={style.chordCreateTitle}>新建和弦</h3>
          <van-field class={style.chordNameField} v-model={this.nameModel} label="" placeholder="请输入和弦名(不可重复)" input-align="center" clearable />
          <div class={style.chordBox}>
            <Chord ref="chordCreate"/>
          </div>
          <div class={style.chordBtnGroup}>
            <div class={[style.chordBtnConfirm, style.chordBtn]} onClick={this.addChord}>
              <van-icon class={style.chordBtnIcon} name="success"/>
            </div>
          </div>
        </div>
      )
    }
    // 普通和弦的UI
    return (
      <div class={[style.chordCard, this.isEditing && style.chordCardEditing]}>
        { this.editStatus === 1
          ? <van-field class={style.chordNameField} v-model={this.nameModel} label="" placeholder="请输入和弦名(不可重复)" ref="nameField" input-align="center" clearable />
          : <h3 class={style.chordName}><span class={style.chordIndex}>{this.index + 1}: </span>{this.name}</h3>
        }
        <div class={style.chordBox}>
          <Chord answer={ this.answer } ref="chord"/>
        </div>
        {
          this.isEditing &&
          (this.editStatus === 0
            ? <div class={style.chordBtnGroup}>
              <div class={`${style.chordBtn} ${style.chordBtnDel}`} onClick={this.initDel}>
                <van-icon class={style.chordBtnIcon} name="delete"/>
              </div>
              <div class={`${style.chordBtn} ${style.chordBtnModify}`} onClick={this.initEdit}>
                <van-icon class={style.chordBtnIcon} name="edit"/>
              </div>
            </div>
            : <div class={style.chordBtnGroup}>
              <div class={`${style.chordBtn} ${style.chordBtnCancel}`} onClick={this.editClear}>
                <van-icon class={style.chordBtnIcon} name="cross"/>
              </div>
              {
                this.editStatus === 1
                  ? <div class={`${style.chordBtn} ${style.chordBtnConfirm}`} onClick={this.editDone}>
                    <van-icon class={style.chordBtnIcon} name="success" />
                  </div>
                  : <div class={`${style.chordBtn} ${style.chordBtnDel}`} onClick={this.editDone}>
                    <van-icon class={style.chordBtnIcon} name="delete" />
                  </div>
              }
            </div>)
        }
        <div class={[style.chordOrder, style.chordOrderUp]} onClick={() => this.chordOrderChange('up')} v-show={this.showOrder}>
          <van-icon class={style.chordArrow} name="down"/>
        </div>
        <div class={[style.chordOrder, style.chordOrderDown]} onClick={() => this.chordOrderChange('down')} v-show={this.showOrder}>
          <van-icon class={style.chordArrow} name="down"/>
        </div>
        <div class={[style.chordCategory]} v-show={this.sortCategory}>
          <van-picker
            title={`${this.name}：选择分类`}
            showToolbar={true}
            defaultIndex={this.columns.map(c => c.text).indexOf(this.category)}
            columns={this.columns}
            visibleItemCount={3}
            onConfirm={(column: PickColumn) => {
              this.categorySelected(column.value)
            }}/>
        </div>
      </div>
    )
  }
})
