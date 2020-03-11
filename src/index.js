const fs = require('fs')

const chunkMagic = 'CcnK'
const fxMagicRegular = 'FxBk'
const fxMagicOpaque = 'FBCh'
const fxMagicProgram = 'FxCk'

export default class Fxb {
    static TYPE_REGULAR = 'regular';
    static TYPE_OPAQUE = 'opaque';
    static TYPE_PROGRAM = 'program';

    byteSize = null;
    fxMagic = null;
    version = null;
    fxId = null;
    fxVersion = null;
    numPrograms = null;
    content = null;

    constructor(buffer) {
        if (chunkMagic !== buffer.slice(0, 4).toString()) {
            throw new Error('This is not a FBX file');
        }

        this.byteSize = buffer.readInt32BE(4);
        const fxMagicString = buffer.slice(8, 12).toString()
        if (fxMagicRegular === fxMagicString) {
            this.fxMagic = Fxb.TYPE_REGULAR;
        }
        if (fxMagicOpaque === fxMagicString) {
            this.fxMagic = Fxb.TYPE_OPAQUE;
        }
        if (fxMagicProgram === fxMagicString) {
            this.fxMagic = Fxb.TYPE_PROGRAM;
        }
        if (this.fxMagic === null) {
            throw new Error(`Unknown fxMagic (${fxMagicString})`);
        }
        this.version = buffer.readInt32BE(12);
        this.fxId = buffer.readInt32BE(16);
        this.fxVersion = buffer.readInt32BE(20);
        this.fxVersion = buffer.readInt32BE(24);

        const offset = 128 + 7 * 4;
        this.content = buffer.slice(offset, offset + this.byteSize);
        console.log(this)
    }

    static loadFile(path) {
        const buffer = fs.readFileSync(path);
        return new Fxb(buffer)
    }
}