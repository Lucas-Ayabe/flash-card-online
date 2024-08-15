import type { Deck, DeckRepository } from './deck.repository'

export abstract class SyncDeckRepository implements DeckRepository {
  protected abstract source(): Deck[]
  protected abstract persist(decks: Deck[]): void

  async deckOfId(id: string): Promise<Deck> {
    const deck = this.source().find((deck) => deck.id === id)

    if (!deck) {
      throw new Error('Deck not found')
    }

    return deck
  }

  async all(): Promise<Deck[]> {
    return this.source()
  }

  async save(deck: Deck): Promise<void> {
    const map = new Map(this.source().map((deck) => [deck.id, deck]))
    map.set(deck.id, deck)

    this.persist(Array.from(map.values()))
  }

  async removeOfId(id: string): Promise<void> {
    this.persist(this.source().filter((deck) => deck.id !== id))
  }

  async nextId(): Promise<string> {
    const [uint32] = window.crypto.getRandomValues(new Uint32Array(1))
    return uint32.toString(16)
  }
}
