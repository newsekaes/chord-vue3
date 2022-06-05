import { defineComponent, computed, toRefs } from "vue";
import style from './index.module.scss'

export default defineComponent({
  name: 'VTool',
  props: {
    editing: {
      type: Boolean,
      default: false,
      require: true
    },
    showAnswer: {
      type: Boolean,
      default: false,
      require: true
    },
    show: {
      type: Boolean,
      default: false,
      require: true
    },
    showOrder: {
      type: Boolean,
      default: false,
      require: true
    },
    sortCategory: {
      type: Boolean,
      default: false,
      require: true
    },
  },
  emits: ['replayClick', 'update:show', 'update:editing', 'update:showAnswer', 'update:sortCategory', 'update:showOrder'],
  setup (props, context) {
    const { show, editing, showAnswer, sortCategory, showOrder } = toRefs(props)
    const __show = computed({
      get () {
        return show.value
      },
      set (val: boolean) {
        context.emit('update:show', val)
      }
    })
    const __editing = computed({
      get () {
        return editing.value
      },
      set (val: boolean) {
        context.emit('update:editing', val)
      }
    })
    const __showAnswer = computed({
      get () {
        return showAnswer.value
      },
      set (val: boolean) {
        context.emit('update:showAnswer', val)
      }
    })
    const __sortCategory = computed({
      get () {
        return sortCategory.value
      },
      set (val: boolean) {
        context.emit('update:sortCategory', val)
      }
    })
    const __showOrder = computed({
      get () {
        return showOrder.value
      },
      set (val: boolean) {
        context.emit('update:showOrder', val)
      }
    })
    const replayClick = () => {
      context.emit('replayClick', true)
    }
    return () => (
      <van-popup v-model:show={__show.value} position="bottom">
        <div class={style.editSwitchArea}>
          {/* <img class={style.logo} src={`${this.BASE_URL}favicon.ico`} alt=""/> */}
          <div class={style.editSwitchItem}>
            <van-icon
              class={{ [style.switchItemIcon]: true, [style.iconActive]: __showAnswer.value }}
              onClick={() => {
                __showAnswer.value = !__showAnswer.value
              }}
              name={__showAnswer.value ? 'eye-o' : 'closed-eye'}/>
            {/* <span>: </span> */}
            {/* <van-switch inactive-color="gray" class={style.switchItemField} v-model={this.__showAnswer}/> */}
          </div>
          <div class={style.editSwitchItem}>
            <van-icon
              class={{ [style.switchItemIcon]: true, [style.iconActive]: __showOrder.value }}
              onClick={() => {
                __showOrder.value = !__showOrder.value
              }}
              name="exchange"/>
            {/* <span>: </span> */}
            {/* <van-switch inactive-color="gray" class={style.switchItemField} v-model={this.__showAnswer}/> */}
          </div>
          <div class={style.editSwitchItem}>
            <van-icon
              class={{ [style.switchItemIcon]: true, [style.iconActive]: __sortCategory.value }}
              onClick={() => {
                __sortCategory.value = !__sortCategory.value
              }}
              name="bar-chart-o"/>
            {/* <span>: </span> */}
            {/* <van-switch inactive-color="gray" class={style.switchItemField} v-model={this.__showAnswer}/> */}
          </div>
          <div class={style.editSwitchItem}>
            <van-icon
              class={{ [style.switchItemIcon]: true, [style.iconActive]: __editing.value }}
              onClick={ () => { __editing.value = !__editing.value } }
              name="edit"/>
            {/* <span>: </span> */}
            {/* <van-switch inactive-color="gray" class={style.switchItemField} v-model={this.__editing}/> */}
          </div>
          <div class={style.editSwitchItem}>
            <van-icon class={style.switchItemIcon} name="replay" onClick={replayClick}/>
          </div>
        </div>
      </van-popup>
    )
  }
})
