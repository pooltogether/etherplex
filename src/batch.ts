import { Provider } from '@ethersproject/abstract-provider'
import { MulticallExecutor } from './MulticallExecutor'
import { Context } from './MulticallContract'

export function batch(provider: Provider, ...contexts: Context[]) {
  return new MulticallExecutor(provider).executeCallers(...contexts)
}
