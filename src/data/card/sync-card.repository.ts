import type { Card, CardRepository } from './card.repository'

export abstract class SyncCardRepository implements CardRepository {
  protected abstract source(): Card[]
  protected abstract persist(cards: Card[]): void

  async ofDeck(deckId: string): Promise<Card[]> {
    return this.source().filter((card) => card.deckId === deckId)
  }

  protected async saveOne(card: Card): Promise<void> {
    const map = new Map(this.source().map((card) => [card.id, card]))
    map.set(card.id, card)

    this.persist(Array.from(map.values()))
  }

  async save(...cards: Card[]): Promise<void> {
    await Promise.all(cards.map((card) => this.saveOne(card)))
  }

  async removeOfId(cardId: string): Promise<void> {
    this.persist(this.source().filter((card) => card.id !== cardId))
  }

  async nextId(): Promise<string> {
    const [uint32] = window.crypto.getRandomValues(new Uint32Array(1))
    return uint32.toString(16)
  }
}
