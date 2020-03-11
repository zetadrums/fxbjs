import Fxb from './index'

const base = Fxb.loadFile(__dirname + '/../test_files/light.fxb');
new Fxb(base.content)