import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type FlashCard = {
  id: number
  question: string
  answer: string
  deck: string
}

type FlashCardStats = {
  isSuccess: boolean
  fails: number
}

type InGameFlashCard = FlashCard & FlashCardStats & { isFlipped: boolean }

export const useGameStore = defineStore('game', () => {
  const cards = ref<InGameFlashCard[]>([])

  const flashCards = computed(() =>
    cards.value.map((card) => ({
      ...card,
      text: card.isFlipped ? card.answer : card.question
    }))
  )

  const inGameFlashCards = computed(() => flashCards.value.filter(({ isSuccess }) => !isSuccess))

  const stats = computed(() => [...cards.value].sort((a, b) => a.id - b.id))

  const currentCardIndex = ref(0)
  const currentCard = computed(() => inGameFlashCards.value[currentCardIndex.value])
  const isCompleted = computed(() => {
    return inGameFlashCards.value.length === 0
  })

  function sort() {
    cards.value = cards.value.sort(() => Math.random() - 0.5)
  }

  function select(cardId: number) {
    currentCardIndex.value = cards.value.findIndex((card) => card.id === cardId)
  }

  function flip(cardId: number) {
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

  function markAsSuccess(cardId: number) {
    const card = cards.value.find(({ id }) => cardId === id)

    if (card) {
      card.isSuccess = true
      currentCardIndex.value--
      flip(card.id)
      next()
    }
  }

  function markAsFailure(cardId: number) {
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
    stats,
    currentCard,
    currentCardIndex,
    isCompleted,
    select,
    next,
    prev,
    flip,
    markAsSuccess,
    markAsFailure
  }
})
