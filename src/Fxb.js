import Fxp from './Fxp'
import FileHandler from './FileHandler'

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

export default class Fxb extends FileHandler {
    offset = 128 + 7 * 4

    map = {
        byteSize: {
            type: 'int',
            from: 4
        },
        withChunk: {
            type: 'string',
            from: 8,
            to: 12,
            filter: val => val === 'FBCh',
            setter(val) {
                this.withChunk = val
                this.buffer.write(val ? 'FBCh' : 'FxBk', 8, 4)
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
        data: {
            getter(obj) {
                if (obj.get('withChunk')) {
                    const chunkSize = obj.buffer.readInt32BE(obj.get('offset'))
                    return Buffer.from(obj.buffer.slice(obj.get('offset') + 4, obj.get('offset') + 4 + chunkSize))
                } else {
                    let ret = []
                    let chunkOffset = obj.get('offset')
                    let size = 0
                    for (let i = 0; i < obj.get('numPrograms'); i++) {
                        size = obj.buffer.readInt32BE(chunkOffset)
                        ret.push(new Fxp(Buffer.from(obj.buffer.slice(chunkOffset, chunkOffset + size + 8))))
                        chunkOffset += size + 8
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
                        val.map(v => v.buffer)
                    ]))
                }
            }
        }
    }
}