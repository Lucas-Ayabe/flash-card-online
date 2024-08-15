<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { factories } from '@/di'
import type { Deck } from '@/data/deck'
import type { Card } from '@/data/card'

const deckRepository = factories.deckRepository()
const cardRepository = factories.cardRepository()
const decks = ref<(Deck & { cards: Card[] })[]>([])
const deckName = ref('')

async function addDeck() {
  if (!deckName.value) return

  const newDeck: Deck = {
    id: await deckRepository.nextId(),
    name: deckName.value
  }

  deckRepository
    .save(newDeck)
    .then(() => {
      decks.value.push({ ...newDeck, cards: [] })
      deckName.value = ''
    })
    .catch(() => {})
}

async function removeDeck(deckId: string) {
  deckRepository
    .removeOfId(deckId)
    .then(() => (decks.value = decks.value.filter(({ id }) => id !== deckId)))
    .catch(() => {})
}

onMounted(async () => {
  const allDecks = await deckRepository.all()
  decks.value = await Promise.all(
    allDecks.map(async (deck) => {
      const cards = await cardRepository.ofDeck(deck.id)
      return { ...deck, cards }
    })
  )
})
</script>

<template>
  <div class="page flow">
    <header class="line justify-between items-baseline">
      <h1>Decks</h1>

      <form @submit.prevent="addDeck">
        <input type="text" v-model="deckName" placeholder="Novo deck..." />
        <button class="button">Adicionar</button>
      </form>
    </header>

    <section>
      <template v-for="deck in decks" :key="deck.id">
        <article>
          <div class="content flow">
            <h2>{{ deck.name }}</h2>
            <p>Contém {{ deck.cards.length }} cartas</p>
            <RouterLink :to="`/decks/${deck.id}/play`" class="button" data-size="small"
              >Jogar Deck</RouterLink
            >
          </div>

          <div class="actions">
            <RouterLink :to="`/decks/${deck.id}`" class="button" name="edit_card" :value="deck.id">
              <span class="gg-pen"></span>
            </RouterLink>
            <button
              class="button"
              data-variant="danger"
              name="remove_card"
              :value="deck.id"
              @click.prevent="removeDeck(deck.id)"
            >
              <span class="gg-trash"></span>
            </button>
          </div>
        </article>
      </template>
    </section>
  </div>
</template>

<style scoped>
.page {
  --flow: 1.5em;
}

form {
  display: flex;
}

form > .button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

form > input {
  border: 1px solid #ccc;
  border-radius: 0.25em;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  font: inherit;
  padding: 0.5em;
}

section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5em;
}

article {
  display: grid;
  border: 1px solid #ccc;
  border-radius: 0.25em;
}

article > * {
  grid-column: 1/-1;
  grid-row: 1/-1;
}

article > .content {
  padding: 1.5em;
}

article > .actions {
  place-self: start end;
  display: flex;
}

.actions > .button {
  --button-font-size: 0.75;
  border-radius: 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

.actions > .button:first-child {
  border-bottom-left-radius: 0.25em;
}

.actions > .button:last-child {
  border-top-right-radius: 0.25em;
}
</style>
