import fs from 'fs'
import FileHandler from './FileHandler'

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

export default class Fxp extends FileHandler {
    offset = 56

    map = {
        byteSize: {
            type: 'int',
            from: 4
        },
        withChunk: {
            type: 'string',
            from: 8,
            to: 12,
            filter: val => val === 'FPCh',
            setter(val) {
                this.withChunk = val
                this.buffer.write(val ? 'FPCh' : 'FxCk', 8, 4)
            }
        },
        version: {
            type: 'int',
            from: 12
        },
        fxId: {
            type: 'string',
            from: 16,
            to: 20
        },
        fxVersion: {
            type: 'int',
            from: 20
        },
        numPrograms: {
            type: 'int',
            from: 24
        },
        name: {
            type: 'string',
            from: 28,
            to: 56
        },
        data: {
            getter(obj) {
                if (obj.get('withChunk')) {
                    const chunkSize = obj.buffer.readInt32BE(obj.get('offset'))
                    return Buffer.from(obj.buffer.slice(obj.get('offset') + 4, obj.get('offset') + 4 + chunkSize))
                } else {
                    let ret = []
                    for (let i = 0; i < obj.get('numPrograms'); i++) {
                        ret.push(obj.buffer.readInt32BE(obj.get('offset') + i * 4))
                        offset += 4
                    }
                    return ret
                }
            },
            setter(val, obj) {
                obj.data = val
                if (obj.get('withChunk')) {
                    obj.buffer.writeInt32BE(val.length, obj.get('offset'))
                    const left = obj.buffer.slice(0, obj.get('offset') + 4)
                    obj.buffer = Buffer.concat([left, val])
                } else {
                    obj.set('numPrograms', val.length)
                    obj.buffer = Buffer.concat(Array.concat([
                        [obj.buffer.slice(0, obj.get('offset'))],
                        val.map(v => {
                            const buf = Buffer.alloc(4)
                            buf.writeInt32BE(v)
                            return buf
                        })
                    ]))
                }
            }
        }
    }
}