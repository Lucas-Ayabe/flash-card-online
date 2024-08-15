import type { Card } from './card.repository'
import { SyncCardRepository } from './sync-card.repository'

export class InMemoryCardRepository extends SyncCardRepository {
  protected cards: Card[] = [
    {
      id: '1',
      question: 'What is 1 + 1?',
      answer: '2',
      deckId: '1'
    },
    {
      id: '2',
      question: 'What is 2 + 2?',
      answer: '4',
      deckId: '1'
    },
    {
      id: '3',
      question: 'What is 3 + 3?',
      answer: '6',
      deckId: '1'
    },
    {
      id: '4',
      question: 'What is 4 + 4?',
      answer: '8',
      deckId: '1'
    }
  ]

  protected source(): Card[] {
    return this.cards
  }

  protected persist(cards: Card[]) {
    this.cards = cards
  }
}
