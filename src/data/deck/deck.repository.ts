export type Deck = {
  id: string
  name: string
}

export interface DeckRepository {
  save(deck: Deck): Promise<void>
  deckOfId(id: string): Promise<Deck>
  all(): Promise<Deck[]>
  removeOfId(id: string): Promise<void>
  nextId(): Promise<string>
}
