const fs = require('fs')

const chunkMagic = 'CcnK'
const fxMagicWithChunk = 'FPCh'

/*
// Preset (Program) (.fxp) with chunk (magic = 'FPCh')
typedef struct
{
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FPCh'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numPrograms;
    char name[28];
    long chunkSize;
    unsigned char chunkData[chunkSize];
} fxProgramSet;

// For Preset (Program) (.fxp) without chunk (magic = 'FxCk')
typedef struct {
    char chunkMagic[4];     // 'CcnK'
    long byteSize;          // of this chunk, excl. magic + byteSize
    char fxMagic[4];        // 'FxCk'
    long version;
    char fxID[4];           // fx unique id
    long fxVersion;
    long numParams;
    char prgName[28];
    float params[numParams];        // variable no. of parameters
} fxProgram;

    */

export default class Fxp {
    byteSize = null;
    withChunk = null;
    version = null;
    fxId = null;
    fxVersion = null;
    numPrograms = null;
    numParams = null;
    chunkSize = null;
    content = null;
    name = null;
    params = [];


    constructor(buffer) {
        if (chunkMagic !== buffer.slice(0, 4).toString()) {
            throw new Error('This is not a FBX file');
        }

        this.byteSize = buffer.readInt32BE(4);
        this.withChunk = fxMagicWithChunk === buffer.slice(8, 12).toString()
        this.version = buffer.readInt32BE(12);
        this.fxId = buffer.slice(16, 20).toString();
        this.fxVersion = buffer.readInt32BE(20);
        if (this.withChunk) {
            this.numPrograms = buffer.readInt32BE(24);
        } else {
            this.numParams = buffer.readInt32BE(24);
        }
        this.name = buffer.slice(28, 56).toString();
        if (this.withChunk) {
            this.chunkSize = buffer.readInt32BE(56);
            this.data = buffer.slice(60, 60 + this.chunkSize);
        } else {
            let offset = 56;
            for (let i = 0; i < this.numParams; i++) {
                this.params.push(buffer.readInt32BE(offset))
                offset += 4
            }
        }
    }

    static loadFile(path) {
        const buffer = fs.readFileSync(path);
        return new Fxp(buffer)
    }

    write(path) {
        
    }
}