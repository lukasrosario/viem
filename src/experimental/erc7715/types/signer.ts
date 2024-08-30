import type { Address } from 'abitype'
import type { OneOf } from '../../../types/utils.js'

/** @internal */
export type AccountSigner = {
  type: 'account'
  data: {
    id: Address
  }
}

/** @internal */
export type KeySigner = {
  type: 'key'
  data: {
    type: 'secp256r1' | 'secp256k1'
    publicKey: `0x${string}`
  }
}

/** @internal */
export type MultiKeySigner = {
  type: 'keys'
  data: {
    ids: string[]
  }
}

/** @internal */
export type WalletSigner = {
  type: 'wallet'
}

/** @internal */
export type P256Signer = {
  type: 'p256'
  data: {
    publicKey: `0x${string}`
  }
}

export type Signer = OneOf<
  AccountSigner | KeySigner | MultiKeySigner | WalletSigner | P256Signer
>
