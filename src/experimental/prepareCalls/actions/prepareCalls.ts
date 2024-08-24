import type { Address } from 'abitype'
import { parseAccount } from '../../../accounts/utils/parseAccount.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../../errors/account.js'
import type { BaseError } from '../../../errors/base.js'
import { ChainNotFoundError } from '../../../errors/chain.js'
import type { ErrorType } from '../../../errors/utils.js'
import type { Account } from '../../../types/account.js'
import type { Chain } from '../../../types/chain.js'
import type { Hex } from '../../../types/misc.js'
import { numberToHex } from '../../../utils/encoding/toHex.js'
import { getTransactionError } from '../../../utils/errors/getTransactionError.js'
import type { SendCallsParameters } from '../../eip5792/actions/sendCalls.js'

export type PrepareCallsParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = SendCallsParameters<chain, account, chainOverride>

export type PrepareCallsReturnType = [
  {
    preparedCalls: {
      type: string
      values: {
        sender: Address
        nonce: Hex
        initCode: Hex
        callData: Hex
        callGasLimit: Hex
        verificationGasLimit: Hex
        preVerificationGas: Hex
        maxFeePerGas: Hex
        maxPriorityFeePerGas: Hex
        paymasterAndData: Hex
        signature: Hex
      }[]
    }
    signatureRequest: {
      hash: Hex
      wrapper?: Record<string, any>
    }
  },
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
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: PrepareCallsParameters<chain, account, chainOverride>,
): Promise<PrepareCallsReturnType> {
  const {
    account: account_ = client.account,
    chain = client.chain,
    calls,
    capabilities,
    version = '1.0',
  } = parameters

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/experimental/eip5792/sendCalls',
    })
  const account = parseAccount(account_)

  if (!chain) throw new ChainNotFoundError()

  try {
    return await client.request({
      method: 'wallet_prepareCalls',
      params: [
        {
          from: account.address,
          calls: calls.map((call) => ({
            ...call,
            value: call.value ? numberToHex(call.value) : undefined,
          })) as any,
          chainId: numberToHex(chain!.id),
          capabilities,
          version,
        },
      ],
    })
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...parameters,
      account,
      chain: parameters.chain!,
    })
  }
}
