import type { Card } from './card.repository'
import { SyncCardRepository } from './sync-card.repository'

export class LocalStorageCardRepository extends SyncCardRepository {
  protected source(): Card[] {
    return JSON.parse(<string>localStorage.getItem('cards')) || []
  }

  protected persist(cards: Card[]) {
    localStorage.setItem('cards', JSON.stringify(cards))
  }
}
