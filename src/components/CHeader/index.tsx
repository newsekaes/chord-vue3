import { defineComponent, ref } from "vue";
import style from './index.module.scss'
import CMenu from '@/components/CMenu'

export default defineComponent({
  name: 'CHeader',
  setup () {
    const showMenu = ref(false)
    const menuToggle = () => {
      showMenu.value = !showMenu.value
    }
    return () => (
      <header class={style.chordHeaderCpn}>
        <div class={style.headerLeftBox}>
          <van-icon class={style.headerIcon} name="wap-nav" onClick={menuToggle} />
        </div>
        <div class={style.headerMiddleBox}>
          <span>和弦练习图</span>
        </div>
        <div class={style.headerRightBox}>
          <van-icon class={style.headerIcon} name="share" />
        </div>
        <CMenu v-model:show={showMenu.value} />
      </header>
    )
  }
})
