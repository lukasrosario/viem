import type { OneOf } from '../../../types/utils.js'

/** @internal */
export type CustomPolicy<data = unknown> = {
  data: data
  type: { custom: string }
}

/** @internal */
export type TokenAllowancePolicy<uint256 = bigint> = {
  type: 'token-allowance'
  data: {
    /** Token allowance (in wei). */
    allowance: uint256
  }
}

/** @internal */
export type GasLimitPolicy<uint256 = bigint> = {
  type: 'gas-limit'
  data: {
    /** Gas limit (in wei). */
    limit: uint256
  }
}

/** @internal */
export type RateLimitPolicy = {
  type: 'rate-limit'
  data: {
    /** Number of times during each interval. */
    count: number
    /** Interval (in seconds). */
    interval: number
  }
}

/** internal */
export type NativeTokenSpendLimitPolicy<uint256 = bigint> = {
  type: 'native-token-spend-limit'
  data: {
    allowance: uint256
  }
}

export type Policy<amount = bigint> = OneOf<
  | TokenAllowancePolicy<amount>
  | GasLimitPolicy<amount>
  | RateLimitPolicy
  | NativeTokenSpendLimitPolicy<amount>
  | CustomPolicy
>
