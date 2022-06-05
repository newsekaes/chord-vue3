import { Field, Icon, Switch, Overlay, Tab, Tabs, Popup, TreeSelect, Picker, Button, Dialog } from "vant";
import VueKonva from 'vue-konva';
import { App } from "vue";
import CHeader from "./CHeader";
import Chord from "./Chord";
import ChordJson from "./ChordJson";
import CMenu from "./CMenu";

export { CHeader, Chord, ChordJson, CMenu }

export default function<T extends App>(app: T) {
    app
    .use(Field)
    .use(Icon)
    .use(Switch)
    .use(Overlay)
    .use(Tab)
    .use(Tabs)
    .use(Popup)
    .use(TreeSelect)
    .use(Picker)
    .use(Button)
    .use(Dialog)
    .use(VueKonva, { prefix: 'Konva'})
}
