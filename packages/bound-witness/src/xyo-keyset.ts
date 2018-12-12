/*
 * @Author: XY | The Findables Company <ryanxyo>
 * @Date:   Monday, 10th December 2018 10:08:31 am
 * @Email:  developer@xyfindables.com
 * @Filename: xyo-keyset.ts
 * @Last modified by: ryanxyo
 * @Last modified time: Wednesday, 12th December 2018 11:26:25 am
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import { XyoBaseSerializable, IXyoSerializableObject, IXyoDeserializer, IXyoSerializationService, parse, ParseQuery } from "@xyo-network/serialization"
import { schema } from '@xyo-network/serialization-schema'
import { IXyoPublicKey } from "@xyo-network/signing"

export class XyoKeySet extends XyoBaseSerializable {
  public static deserializer: IXyoDeserializer<XyoKeySet>
  public schemaObjectId = schema.keySet.id

  constructor (public readonly keys: IXyoPublicKey[]) {
    super(schema)
  }

  public getData(): IXyoSerializableObject[] {
    return this.keys
  }

}

// tslint:disable-next-line:max-classes-per-file
class XyoKeySetDeserializer implements IXyoDeserializer<XyoKeySet> {
  public schemaObjectId = schema.keySet.id

  public deserialize(data: Buffer, serializationService: IXyoSerializationService): XyoKeySet {
    const parseResult = parse(data, serializationService.schema)
    const query = new ParseQuery(parseResult)
    const keys = query.mapChildren(key => serializationService.deserialize(key.readData(true))
      .hydrate<IXyoPublicKey>(serializationService))
    return new XyoKeySet(keys)
  }
}

XyoKeySet.deserializer = new XyoKeySetDeserializer()
