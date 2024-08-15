import type { Deck } from './deck.repository'
import { SyncDeckRepository } from './sync-deck.repository'

export class LocalStorageDeckRepository extends SyncDeckRepository {
  protected source(): Deck[] {
    return JSON.parse(<string>localStorage.getItem('decks')) || []
  }

  protected persist(decks: Deck[]) {
    localStorage.setItem('decks', JSON.stringify(decks))
  }
}
