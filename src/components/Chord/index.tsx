import style from './index.module.scss'
import Konva from 'konva'
import { defineComponent, ref, computed, toRef, PropType } from "vue";
import rightPng from '@/assets/right.png'

const _whiteKeyRect = {
  width: 20,
  height: 83,
  fill: 'white'
}
const _blackKeyRect = {
  width: 13,
  height: 47,
  fill: 'black'
}

export default defineComponent({
  name: 'VChord',
  props: {
    answer: {
      type: Array as PropType<number[]>,
      default: () => {
        return []
      },
      required: false
    },
  },
  expose: ['getKeys', 'showAnswer', 'clear'],
  setup(props, context) {
    const refStage = ref<Konva.Stage>()
    const configKonva = {
      width: _whiteKeyRect.width * 14 + 10,
      height: _whiteKeyRect.height + 5,
      offsetX: -5,
      offsetY: -2.5
    }
    const answer = toRef(props, 'answer')
    const keys = ref<number[]>(new Array(24).fill(0))
    const hoverIndex = ref<null | number>(null)
    const whiteKeyRect = _whiteKeyRect
    const blackKeyRect = _blackKeyRect
    const resultRight = computed(() => {
      if (props.answer) {
        return keys.value.toString() === answer.value.toString()
      }
      return false
    })
    const getKeyRect = (index: number, i: number, hoverIndex: number | null) => {
      const key = index % 12
      const part = Math.floor(index / 12)
      const rect: Konva.ShapeConfig = {
        stroke: 'black',
        strokeWidth: 2,
        fill: '#ffffff'
      }
      if (key < 7) {
        Object.assign(rect, whiteKeyRect)
        rect.x = key * whiteKeyRect.width + part * 7 * whiteKeyRect.width
        rect.y = 0
      } else {
        Object.assign(rect, blackKeyRect)
        rect.x = ((key - 7) < 2 ? (key - 7) : (key - 6)) * whiteKeyRect.width + whiteKeyRect.width - blackKeyRect.width / 2 + part * 7 * whiteKeyRect.width
        rect.y = 0
      }
      if (hoverIndex === index) rect.fill = 'gray'
      if (i !== 0) rect.fill = '#ffb8b8'
      return rect
    }

    const handleClick = (index: number) => {
      keys.value = keys.value.map((i, j) => {
        if (index === j) {
          return i === 0 ? 1 : 0
        } else {
          return i
        }
      })
      context.emit('change', keys.value)
    }

    const handleMouseEnter = (index: number) => {
      hoverIndex.value = index
      const stage = refStage?.value?.getStage()
      if (stage) stage.container().style.cursor = 'pointer'
    }

    const handleMouseLeave = () => {
      hoverIndex.value = null
      const stage = refStage?.value?.getStage()
      if (stage) stage.container().style.cursor = 'pointer'
    }

    const getKeys = (): number[] => {
      return keys.value
    }

    const showAnswer = (): void => {
      if (answer.value) {
        keys.value = answer.value
      }
    }

    const clear = () => {
      keys.value = new Array(24).fill(0)
    }

    // context.expose({
    //   getKeys,
    //   showAnswer,
    //   clear
    // })

    return {
      configKonva,
      whiteKeyRect,
      keys,
      hoverIndex,
      resultRight,
      refStage,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
      getKeyRect,
      getKeys,
      showAnswer,
      clear
    }
  },
  render() {
    return (<div class={style.chordItemCpn}>
      <konva-stage config={this.configKonva} ref="refStage" style={this.whiteKeyRect.width * 14 + 20}>
        <konva-layer>
          <konva-group>
            {
              this.keys.map((i, index) => {
                return <konva-rect
                  onMouseenter={this.handleMouseEnter.bind(this, index)}
                  onMouseleave={this.handleMouseLeave}
                  onClick={this.handleClick.bind(this, index)}
                  onTap={this.handleClick.bind(this, index)}
                  config={this.getKeyRect(index, i, this.hoverIndex)}
                  key={index} />
              })
            }
          </konva-group>
        </konva-layer>
      </konva-stage>
      <div class={style.chordItem__result}>
        <span><img style={{ visibility: this.resultRight ? 'visible' : 'hidden' }} width="24" height="24" src={rightPng} alt="right" /></span>
      </div>
    </div>)
  }
})
