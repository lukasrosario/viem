import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import { numberToHex } from '../../../utils/index.js'
import type { Permission } from '../types/permission.js'

export type GrantPermissionsParameters = {
  /** Set of permissions to grant to the user. */
  permissions: readonly Permission[]
}

export type GrantPermissionsReturnType = {
  context: string
  permissions: readonly Permission[]
}

/**
 * Request permissions from a wallet to perform actions on behalf of a user.
 *
 * - Docs: https://viem.sh/experimental/erc7715/grantPermissions
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { grantPermissions } from 'viem/experimental'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const result = await grantPermissions(client, {
 *   expiry: 1716846083638,
 *   permissions: [
 *     {
 *       type: 'native-token-transfer',
 *       data: {
 *         ticker: 'ETH',
 *       },
 *       policies: [
 *         {
 *           type: 'token-allowance',
 *           data: {
 *             allowance: parseEther('1'),
 *           },
 *         }
 *       ],
 *       required: true,
 *     },
 *   ],
 * })
 */
export async function grantPermissions(
  client: Client<Transport>,
  parameters: GrantPermissionsParameters,
): Promise<GrantPermissionsReturnType> {
  const { permissions } = parameters
  const result = await client.request(
    {
      method: 'wallet_grantPermissions',
      params: formatParameters({ permissions } as any),
    },
    { retryCount: 0 },
  )
  return (result) as GrantPermissionsReturnType
}

function formatParameters(parameters: GrantPermissionsParameters) {
  const { permissions } = parameters

  return {
    permissions: permissions.map((permission) => ({
      ...permission,
      chainId: numberToHex(permission.chainId),
      policies: permission.policies.map((policy) => {
        const data = (() => {
          if (policy.type === 'token-allowance')
            return {
              allowance: numberToHex(policy.data.allowance),
            }
          if (policy.type === 'gas-limit')
            return {
              limit: numberToHex(policy.data.limit),
            }
          if (policy.type === 'native-token-spend-limit') {
            return {
              allowance: numberToHex(policy.data.allowance),
            
            }
          }
          return policy.data
        })()

        return {
          data,
          type:
            typeof policy.type === 'string' ? policy.type : policy.type.custom,
        }
      }),
    })),
  }
}
