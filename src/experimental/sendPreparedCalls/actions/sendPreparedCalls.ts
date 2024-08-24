import { parseAccount } from '../../../accounts/utils/parseAccount.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../../errors/account.js'
import type { BaseError } from '../../../errors/base.js'
import { ChainNotFoundError } from '../../../errors/chain.js'
import type { ErrorType } from '../../../errors/utils.js'
import type { Account, GetAccountParameter } from '../../../types/account.js'
import type { Chain, GetChainParameter } from '../../../types/chain.js'
import type { WalletSendCallsParameters } from '../../../types/eip1193.js'
import type { Hex } from '../../../types/misc.js'
import type { RequestErrorType } from '../../../utils/buildRequest.js'
import { getTransactionError } from '../../../utils/errors/getTransactionError.js'

type PermissionsSignatureData = {
  type: 'permissions'
  values: {
    signature: Hex
    context: string
  }
}

export type SendPreparedCallsParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
> = {
  preparedCalls: {
    type: string
    values: any
  }
  signatureData: PermissionsSignatureData
  version?: WalletSendCallsParameters[number]['version'] | undefined
} & GetAccountParameter<account> &
  GetChainParameter<chain, chainOverride>

export type SendPreparedCallsReturnType = string

export type SendPreparedCallsErrorType = RequestErrorType | ErrorType

export async function sendPreparedCalls<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendPreparedCallsParameters<chain, account, chainOverride>,
): Promise<SendPreparedCallsReturnType> {
  const {
    account: account_ = client.account,
    preparedCalls,
    signatureData,
    chain = client.chain,
    version = '1.0',
  } = parameters

  if (!account_)
    throw new AccountNotFoundError({
      docsPath: '/experimental/eip5792/sendCalls',
    })
  const account = parseAccount(account_)

  if (!chain) throw new ChainNotFoundError()

  try {
    return await client.request(
      {
        method: 'wallet_sendPreparedCalls',
        params: [
          {
            signatureData,
            preparedCalls,
            from: account.address,
            version,
          },
        ],
      },
      { retryCount: 0 },
    )
  } catch (err) {
    throw getTransactionError(err as BaseError, {
      ...parameters,
      account,
      chain: parameters.chain!,
    })
  }
}
