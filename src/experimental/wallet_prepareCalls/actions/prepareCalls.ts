import type { Hex } from '../../../types/misc.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import type { Account, GetAccountParameter } from '../../../types/account.js'
import type { OneOf } from '../../../types/utils.js'
import type { ErrorType } from '../../../errors/utils.js'
import { AccountNotFoundError } from '~viem/errors/account.js'
import { parseAccount } from '../../../accounts/utils/parseAccount.js'
import type { Chain } from '../../../types/chain.js'
import { getTransactionError } from '../../../utils/errors/getTransactionError.js'
import type { BaseError } from '../../../errors/base.js'

export type PrepareCallsParameters<
  account extends Account | undefined = Account | undefined,
> = {
  from?: Hex
  calls: {
    to: Hex
    data: Hex
    value: Hex
    chainId?: Hex
  }[]
  capabilities: {
    paymasterService: {
      url: string
    }
    permissions: {
      context: string
    }
  }
} & GetAccountParameter<account>
  
export type PrepareCallsReturnType = [
  {
    data: {
      type: string
      values: OneOf<
        | {
            to: Hex
            data?: Hex | undefined
            value?: bigint | undefined
          }
        | {
            data: Hex
          }
      >[]
    }
    hash: Hex
    wrapper?: Record<string, any>
  }
]

export type PrepareCallsErrorType = ErrorType

/**
 * Requests the connected wallet to prepare a batch of calls.
 *
 * - Docs: https://viem.sh/experimental/wallet_prepareCalls
 * - JSON-RPC Methods: [`wallet_prepareCalls`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Transaction identifier. {@link PrepareCallsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { prepareCalls } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const id = await prepareCalls(client, {
 *   calls: [
 *     {
 *       to: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
 *       data: '0x1234567890abcdef',
 *       value: '0x1234567890abcdef',
 *       chainId: '0x1a2b3c4d',
 *     },
 *   ],
 *   capabilities: {
 *     paymasterService: {
 *       url: 'https://paymaster.example.com',
 *     },
 *     permissions: {
 *       context: 'https://context.example.com',
 *     },
 *   },
 * })
 */
export async function prepareCalls<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: PrepareCallsParameters<account>,
): Promise<PrepareCallsReturnType> {
  const {
    from: account_ = client.account,
    calls,
    capabilities,
  } = parameters

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/experimental/eip5792/sendCalls',
    })
  const account = parseAccount(account_)

  try {
    return await client.request(
      {
        method: 'wallet_prepareCalls',
        params: [
          {
            from: account.address,
            calls,
            capabilities,
          },
        ],
      }
    )
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...parameters,
      account,
    })
  }
}