import type { OneOf } from '../../../types/utils.js'
import type { Policy } from './policy.js'
import type { Signer } from './signer.js'

type Hex = `0x${string}`
type Address = Hex

/** @internal */
export type CustomPermission<data = unknown, type = { custom: string }> = {
  data: data
  type: type
}

/** @internal */
export type NativeTokenTransferPermission = {
  type: 'native-token-transfer'
  data: {
    /** Native token ticker (e.g. ETH). */
    ticker: string
  }
}

/** @internal */
export type Erc20TokenTransferPermission = {
  type: 'erc20-token-transfer'
  data: {
    /** ERC20 address. */
    address: Address
    /** Native token ticker (e.g. ETH). */
    ticker: string
  }
}

/** @internal */
export type ContractCallPermission = {
  type: 'contract-call'
  data: {
    /** Contract address. */
    address: Address
    /** Set of contract signatures to permit. */
    calls: string[]
  }
}

export type CallWithPermissionPermission = {
  type: 'call-with-permission'
  data: {
    /** Contract address. */
    allowedContract: Address
    /** Set of contract signatures to permit. */
    permissionArgs: Hex
  }
}

export type Permission<uint256 = bigint> = {
  permission: OneOf<
    | NativeTokenTransferPermission
    | Erc20TokenTransferPermission
    | ContractCallPermission
    | CallWithPermissionPermission
    | CustomPermission
  >
  /** Set of policies for the permission. */
  policies: readonly Policy<uint256>[]
  /** Whether or not the wallet must grant the permission. */
  required?: boolean | undefined
  account: Address
  chainId: number
  expiry: number
  signer: Signer
}
