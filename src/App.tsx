import { defineComponent } from 'vue'
import CHeader from '@/components/CHeader'

export default defineComponent({
  render () {
    return (
      <div id="app" class="app">
        <CHeader class="app-header" />
        <router-view class="app-main" />
      </div>
    )
  }
})
