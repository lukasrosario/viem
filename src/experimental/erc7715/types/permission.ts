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

export type NativeTokenRecurringAllowancePermission = {
  type: 'native-token-recurring-allowance'
  data: {
    allowance: bigint
    cycleStart: number
    cycleDuration: number
  }
}

export type AllowedContractPermission = {
  type: 'allowed-contract'
  data: {
    contract: Address
  }
}

export type AllowedSelectorPermission = {
  type: 'allowed-selector'
  data: {
    selector: Hex
  }
}

export type PermissionRequest =
  | NativeTokenRecurringAllowancePermission
  | AllowedContractPermission
  | AllowedSelectorPermission

export type Permission = {
  permissions: readonly PermissionRequest[]
  account: Address
  chainId: number
  expiry: number
  signer: Signer
}
