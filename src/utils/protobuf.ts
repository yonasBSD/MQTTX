import protobuf from 'protobufjs'
import { convertObject } from './schemaUtils'
import { transformPBJSError } from './protobufErrors'

export const printObjectAsString = (obj: any, indent = 2) => {
  const indentation = ' '.repeat(indent)
  let str = `{\n`
  const keys = Object.keys(obj)
  try {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = obj[key]
      str += `${indentation}  ${key}: `
      if (typeof value === 'object' && value !== null) {
        str += `${printObjectAsString(value, indent + 2)}`
      } else {
        str += `${JSON.stringify(value)}`
      }
      if (i < keys.length - 1) {
        str += `,`
      }
      str += `\n`
    }
  } catch (error) {
    throw new TypeError((error as Error).toString())
  }
  str += `}`
  return str
}

export const checkProtobufInput = (proto: string, input: string, name: string, format?: PayloadType): string => {
  try {
    const root = protobuf.parse(proto, { keepCase: true }).root
    const Message = root.lookupType(name)
    const content = JSON.parse(convertObject(input, format))
    const validationResult = Message.verify(content)
    if (validationResult) {
      throw new Error('Message Test Error: ' + validationResult)
    } else {
      const result = deserializeBufferToProtobuf(
        Buffer.from(Message.encode(Message.create(content)).finish()),
        proto,
        name,
      )
      if (!result) {
        return ''
      }
      return result.toString()
    }
  } catch (error) {
    throw new Error('Message Test Failed: ' + error)
  }
}

export const serializeProtobufToBuffer = (
  raw: string,
  proto: string,
  protobufMessageName: string,
  format?: PayloadType,
): Buffer => {
  let rawData: string = ''
  try {
    rawData = convertObject(raw, format)
  } catch (error) {
    throw new TypeError(`Message format type error : ${(error as Error).message.split('\n')[0]}`)
  }

  let bufferMessage = Buffer.from(rawData)
  try {
    const root = protobuf.parse(proto, { keepCase: true }).root
    const Message = root.lookupType(protobufMessageName)
    const err = Message.verify(JSON.parse(rawData))
    if (err) {
      throw new SyntaxError(`Message serialization error: ${err}`)
    }
    const data = Message.create(JSON.parse(rawData))
    const serializedMessage = Message.encode(data).finish()
    bufferMessage = Buffer.from(serializedMessage)
    return bufferMessage
  } catch (error) {
    throw new SyntaxError(`Message serialization error: ${(error as Error).message.split('\n')[0]}`)
  }
}

export const deserializeBufferToProtobuf = (
  payload: Buffer,
  proto: string,
  protobufMessageName: string,
  to?: PayloadType,
): Buffer | string => {
  try {
    const root = protobuf.parse(proto, { keepCase: true }).root
    const Message = root.lookupType(protobufMessageName)
    const MessageData = Message.decode(Buffer.from(payload))
    const err = Message.verify(MessageData)
    if (err) {
      throw new SyntaxError(`Message deserialization error: ${err}`)
    }
    if (to) {
      return Buffer.from(JSON.stringify(MessageData.toJSON()))
    }
    // return MessageData
    return protobufMessageName + ' ' + printObjectAsString(MessageData)
  } catch (error) {
    let err = transformPBJSError(error as Error)
    throw new SyntaxError(err.message.split('\n')[0])
  }
}
