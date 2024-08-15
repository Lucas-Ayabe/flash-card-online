import { LocalStorageCardRepository, type CardRepository } from './data/card'
import { LocalStorageDeckRepository, type DeckRepository } from './data/deck'

export const factories = {
  cardRepository: (): CardRepository => new LocalStorageCardRepository(),
  deckRepository: (): DeckRepository => new LocalStorageDeckRepository()
}
