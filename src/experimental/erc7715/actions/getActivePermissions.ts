import { parseAccount } from '../../../accounts/utils/parseAccount.js'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { AccountNotFoundError } from '../../../errors/account.js'
import type { Account, GetAccountParameter } from '../../../types/account.js'
import type { Chain } from '../../../types/chain.js'
import type { WalletGetActivePermissionsReturnType } from '../../../types/eip1193.js'
import type { Permission } from '../types/permission.js'

export type GetActivePermissionsParameters<
  account extends Account | undefined = Account | undefined,
> = GetAccountParameter<account>

export type GetActivePermissionsReturnType = Omit<
  WalletGetActivePermissionsReturnType,
  'permissions'
> & {
  permissions: Permission[]
}

export async function getActivePermissions<
  chain extends Chain | undefined,
  account extends Account | undefined = undefined,
>(
  ...parameters: account extends Account
    ?
        | [client: Client<Transport, chain, account>]
        | [
            client: Client<Transport, chain, account>,
            parameters: GetActivePermissionsParameters<account>,
          ]
    : [
        client: Client<Transport, chain, account>,
        parameters: GetActivePermissionsParameters<account>,
      ]
): Promise<GetActivePermissionsReturnType> {
  const [client, args] = parameters
  const account_raw = args?.account ?? client.account

  if (!account_raw) throw new AccountNotFoundError()
  const account = parseAccount(account_raw)

  const activePermissions = await client.request({
    method: 'wallet_getActivePermissions',
    params: [account.address],
  })

  return activePermissions as GetActivePermissionsReturnType
}
