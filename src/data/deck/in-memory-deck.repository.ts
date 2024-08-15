import type { Deck } from './deck.repository'
import { SyncDeckRepository } from './sync-deck.repository'

export class InMemoryDeckRepository extends SyncDeckRepository {
  protected decks: Deck[] = [
    {
      id: '1',
      name: 'Deck 1'
    },
    {
      id: '2',
      name: 'Deck 2'
    },
    {
      id: '3',
      name: 'Deck 3'
    }
  ]

  protected source(): Deck[] {
    return this.decks
  }

  protected persist(decks: Deck[]): void {
    this.decks = decks
  }
}
