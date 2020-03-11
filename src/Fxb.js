import fs from 'fs'
import Fxp from './Fxp'

const chunkMagic = 'CcnK'
const fxMagicWithChunk = 'FBCh'

/*
// Bank (.fxb) with chunk (magic = 'FBCh')
typedef struct
{
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FBCh'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char future[128];
    long chunkSize;
    unsigned char chunkData[chunkSize];
} fxChunkSet;


// For Bank (.fxb) without chunk (magic = 'FxBk')
typedef struct {
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FxBk'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char future[128];
    fxProgram programs[numPrograms];  // variable no. of programs
} fxSet;
    */

export default class Fxb {
    byteSize = null;
    withChunk = null;
    version = null;
    fxId = null;
    fxVersion = null;
    numPrograms = null;
    chunkSize = null;
    data = null;
    programs = [];

    constructor(buffer) {
        if (chunkMagic !== buffer.slice(0, 4).toString()) {
            throw new Error('This is not a FBX file');
        }

        this.byteSize = buffer.readInt32BE(4);
        this.withChunk = fxMagicWithChunk === buffer.slice(8, 12).toString()
        this.version = buffer.readInt32BE(12);
        this.fxId = buffer.slice(16, 20).toString();
        this.fxVersion = buffer.readInt32BE(20);
        this.numPrograms = buffer.readInt32BE(24);

        const offset = 128 + 7 * 4;
        if (this.withChunk) {
            this.chunkSize = buffer.readInt32BE(offset);
            this.data = buffer.slice(offset + 4, offset + 4 + this.chunkSize);
        } else {
            let chunkOffset = offset;
            let size = 0;
            for (let i = 0; i < this.numPrograms; i++) {
                size = buffer.readInt32BE(chunkOffset, 4);
                this.programs.push(new Fxp(buffer.slice(chunkOffset, chunkOffset + size + 8)));
                chunkOffset += size + 8;
            }
        }
    }

    static loadFile(path) {
        const buffer = fs.readFileSync(path);
        return new Fxb(buffer)
    }

    write(path) {
        
    }
}