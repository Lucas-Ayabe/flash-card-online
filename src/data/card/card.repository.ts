export type Card = {
  id: string
  question: string
  answer: string
  deckId: string
}

export interface CardRepository {
  ofDeck(deckId: string): Promise<Card[]>
  save(...cards: Card[]): Promise<void>
  removeOfId(cardId: string): Promise<void>
  nextId(): Promise<string>
}
