import { defineComponent, ref, computed, toRef } from "vue";

import style from './index.module.scss'
import { Notify, Dialog } from 'vant'
import { useAnswerStorageStore } from '@/store'
import { Answers } from '@/store/answerStorage/type'


// interface ChordJsonProps {
//   show: boolean;
// }

export default defineComponent({
  name: 'ChordJson',
  props: {
    show: Boolean
  },
  emits: {
    import: () => {
      return true
    },
    'update:show': (val: boolean) => {
      return val !== undefined
    }
  },
  setup(props, context) {
    const show = toRef(props, 'show')
    const text = ref('')
    const tabActive = ref(0)
    const answerStorageStore = useAnswerStorageStore()
    const copyValue = computed(() => {
      const answers = answerStorageStore.answers // todo test
      return JSON.stringify(answers)
    })
    // const stopPropagation = (event: Event) => {
    //   debugger
    //   event.stopPropagation()
    // }
    const importJson = () => {
      const answers = JSON.parse(text.value) as Answers
      answerStorageStore.importAnswers(answers)
      context.emit('import')
    }
    const hideOverlay = () => {
      context.emit('update:show', false)
    }
    const init = () => {
      Dialog.confirm({
        title: '初始化',
        message: '确认要初始化为系统默认和弦吗'
      })
        .then(() => {
          answerStorageStore.initDefaultAnswers()
          Notify({ type: 'success', message: '初始化成功' })
          context.emit('update:show', false)
        })
    }
    const copy = (): void => {
      const transfer = document.createElement('input')
      transfer.style.position = 'fixed'
      transfer.style.visibility = 'hidden'
      document.body.appendChild(transfer)
      transfer.value = copyValue.value // 这里表示想要复制的内容
      transfer.focus()
      transfer.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      transfer.blur()
      document.body.removeChild(transfer)
      Notify({ type: 'success', message: '复制成功, 请妥善保存' })
    }
    return () => (
      <van-overlay show={show.value} onClickSelf={hideOverlay}>
        <div class={style.closed} onClick={hideOverlay}>
          <van-icon name="close" />
        </div>
        <div class={style.wrapper}>
          <van-tabs class={style.block} v-model:active={tabActive.value} onClickPreventStop={()=>('')}>
            <van-tab title="导入">
              <div class={style.wrapperContent}>
                <van-field
                  v-model={text.value}
                  label=""
                  placeholder="请输入导入数据"
                  autosize={true}
                  type="textarea"
                  rows="1"
                />
              </div>
              <div class={style.btnGroup}>
                <div class={style.btn} onClick={importJson}>确定</div>
              </div>
            </van-tab>
            <van-tab title="导出">
              <div class={style.wrapperContent}>
                <van-field
                  value={copyValue.value}
                  label=""
                  placeholder="请输入导入数据"
                  autosize={true}
                  type="textarea"
                  rows="1"
                  readonly={true}
                />
              </div>
              <div class={style.btnGroup}>
                <div class={style.btn} onClick={copy}>复制到剪贴板</div>
              </div>
            </van-tab>
            <van-tab title="初始化">
              <div class={[style.wrapperContent, style.wrapperContentText]}>
                <p>清除本地数据，并初始化为系统默认和弦</p>
                <p>进行本操作前，建议导出本地数据，以进行备份</p>
              </div>
              <div class={style.btnGroup}>
                <div class={style.btn} onClick={init}>确定</div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </van-overlay>
    )
  }
})
