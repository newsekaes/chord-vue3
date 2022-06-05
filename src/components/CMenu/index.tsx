import { defineComponent, ref, computed, toRef } from "vue";
import { useAnswerStorageStore } from '@/store'
import style from './index.module.scss'


// const AnswerStorageModule = namespace('answerStorage')

// interface CMenuProps {
//   show?: boolean;
// }

interface CMenuItem {
  text: string;
  // 导航名称右上角徽标，2.5.6 版本开始支持
  badge?: number;
  // 是否在导航名称右上角显示小红点
  dot?: boolean;
  // 导航节点额外类名
  className?: string;
  id?: number | string;
  disabled?: boolean;
  children?: CMenuItem[];
}


export default defineComponent({
  name: 'CMenu',
  props: {
    show: Boolean
  },
  emits: {
    'update:show' (payload?: boolean) {
      return payload !== undefined
    }
  },
  setup(props, context) {
    const activeIndex = ref(0)
    const activeId = ref('all')
    const dialogShow = ref(false)
    const newCategory = ref('')
    const answerStorageStore = useAnswerStorageStore()
    const navItem = computed<CMenuItem[]>(() => ([
      {
        text: '分组',
        className: style.menuTreeDeep1,
        children: [
          { text: '全部', id: 'all', className: style.menuTreeDeep2 },
          ...answerStorageStore.categories.map(name => ({ text: name, id: name, className: style.menuTreeDeep2 }))
        ]
      }
    ]))
    const modelShow = computed({
      get () {
        return toRef(props, 'show').value
      },
      set(val: boolean) {
        context.emit('update:show', val)
      }
    })
    return () => (
      <van-popup
        class={style.chordMenuCpn}
        v-model:show={modelShow.value}
        get-container="#app"
        position="left">
        <van-tree-select
          class={style.menuTree}
          items={navItem.value}
          activeId={activeId.value}
          mainActiveIndex={activeIndex.value}
          height="100%"
          onUpdate:active-id={(val: string) => { activeId.value = val }}
          onUpdate:main-active-index={(val: number) => { activeIndex.value = val }}
          onClickItem={() => { answerStorageStore.setCurrentCategory(activeId.value === 'all' ? '' : activeId.value) }}
        />
        <van-button size="mini" icon="plus" type="primary" class={style.addCategory}
          onClick={() => { dialogShow.value = true }}
        />
        <van-dialog v-model:show={dialogShow.value} title="添加新组" show-cancel-button
          onClick={() => { answerStorageStore.addCategory(newCategory.value) }}
        >
          <van-field v-model={newCategory.value} label="" placeholder="请输入新组名(不可重复)" input-align="center" clearable />
        </van-dialog>
      </van-popup>
    )
  }
})
