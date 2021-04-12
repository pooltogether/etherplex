import { BaseProvider } from '@ethersproject/providers'
import { MulticallExecutor } from './MulticallExecutor'
import { Context } from './MulticallContract'

export function batch(provider: BaseProvider, ...contexts: Context[]) {
  return new MulticallExecutor(provider).executeCallers(...contexts)
}
