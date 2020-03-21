import fs from 'fs'

export default class FileHandler {
    buffer = null
    offset = 0
    map = {}
   
    constructor(buffer) {
        if ('CcnK' !== buffer.slice(0, 4).toString()) {
            throw new Error('This is not a valid file')
        }
        this.buffer = buffer
    }

    static loadFile(path) {
        const buffer = fs.readFileSync(path)
        return new this(buffer)
    }

    get(field) {
        if (this[field] !== undefined) 
            return this[field]
        const conf = this.map[field]
        if (!conf)
            return null
        
        if (conf.getter !== undefined) {
            this[field] = conf.getter(this)
        } else {
            switch (conf.type) {
                case 'int':
                    this[field] = this.buffer.readInt32BE(conf.from)
                    break
                case 'string':
                    this[field] = this.buffer.slice(conf.from, conf.to).toString()
                    break
                default:
                    return null
            }
        }

        if (conf.filter !== undefined)
            this[field] = conf.filter(this[field])

        return this[field]
    }

    set(field, value) {
        const conf = this.map[field]
        if (!conf) {
            return null
        }

        if (conf.setter !== undefined) {
            conf.setter(value, this)
        } else {
            switch (conf.type) {
                case 'int':
                    this[field] = value
                    this.buffer.writeInt32BE(value, conf.from)
                    break
                case 'string':
                    this[field] = value
                    this.buffer.fill("\0", conf.from, conf.to)
                    this.buffer.write(value, conf.from, conf.to - conf.from)
                    break
                default:
                    return null
            }
        }
        
        // Write byteSize
        this.byteSize = this.buffer.length
        this.buffer.writeInt32BE(this.byteSize, 4)
    }

    write(path) {
        fs.writeFileSync(path, this.buffer)
    }
}