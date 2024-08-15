import type { Card } from '@/data/card'
import { ref, computed } from 'vue'

type FlashCard = Card

type FlashCardStats = {
  isSuccess: boolean
  fails: number
}

type InGameFlashCard = FlashCard & FlashCardStats & { isFlipped: boolean }

export const useGame = (source: FlashCard[] = []) => {
  const cards = ref<InGameFlashCard[]>(
    source.map((card) => ({
      ...card,
      isFlipped: false,
      fails: 0,
      isSuccess: false
    }))
  )

  const flashCards = computed(() =>
    cards.value.map((card) => ({
      ...card,
      text: card.isFlipped ? card.answer : card.question
    }))
  )

  const stats = computed(() => {
    return [...cards.value].sort((a, b) => b.fails - a.fails)
  })

  const inGameFlashCards = computed(() => flashCards.value.filter(({ isSuccess }) => !isSuccess))

  const currentCardIndex = ref(0)
  const currentCard = computed(() => inGameFlashCards.value[currentCardIndex.value])
  const isCompleted = computed(() => {
    return inGameFlashCards.value.length === 0
  })

  function start(withCards: Card[]) {
    currentCardIndex.value = 0
    cards.value = withCards
      .map((card) => ({
        ...card,
        isFlipped: false,
        fails: 0,
        isSuccess: false
      }))
      .sort(() => Math.random() - 0.5)
  }

  function sort() {
    cards.value = cards.value.sort(() => Math.random() - 0.5)
  }

  function select(cardId: string) {
    currentCardIndex.value = cards.value.findIndex((card) => card.id === cardId)
  }

  function flip(cardId: string) {
    const card = cards.value.find(({ id }) => cardId === id)

    if (card) {
      card.isFlipped = !card.isFlipped
    }
  }

  function next() {
    if (currentCardIndex.value === inGameFlashCards.value.length - 1) {
      sort()
    }

    currentCardIndex.value = (currentCardIndex.value + 1) % inGameFlashCards.value.length
  }

  function prev() {
    currentCardIndex.value = Math.min(currentCardIndex.value - 1, 0)
  }

  function markAsSuccess(cardId: string) {
    const card = cards.value.find(({ id }) => cardId === id)

    if (card) {
      card.isSuccess = true
      currentCardIndex.value--
      flip(card.id)
      next()
    }
  }

  function markAsFailure(cardId: string) {
    const card = cards.value.find(({ id }) => cardId === id)

    if (card) {
      card.isSuccess = false
      card.fails++
      flip(card.id)
      next()
    }
  }

  return {
    flashCards,
    inGameFlashCards,
    currentCard,
    currentCardIndex,
    isCompleted,
    stats,
    select,
    next,
    prev,
    flip,
    start,
    markAsSuccess,
    markAsFailure
  }
}
