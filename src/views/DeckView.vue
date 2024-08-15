<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { factories } from '@/di'
import type { Card } from '@/data/card'
import type { Deck } from '@/data/deck'
import { watch } from 'vue'

const props = defineProps({
  id: String
})

const router = useRouter()

const deckRepository = factories.deckRepository()
const cardRepository = factories.cardRepository()

const deck = ref<Deck>({
  id: props.id || '',
  name: ''
})

const cards = ref<Card[]>([])

async function addCard() {
  const newCard = {
    id: await cardRepository.nextId(),
    answer: '',
    question: '',
    deckId: props.id || ''
  }

  cardRepository
    .save(newCard)
    .then(() => cards.value.push(newCard))
    .catch(() => {})
}

async function removeCard(card: Card) {
  cardRepository
    .removeOfId(card.id)
    .then(() => {
      cards.value = cards.value.filter(({ id }) => id !== card.id)
    })
    .catch(() => {})
}

async function saveDeck() {
  cardRepository.save(...cards.value)
  deckRepository.save(deck.value)
}

watch(
  () => props.id || '',
  async () => {
    const deckId = props.id || ''
    console.log('view', deckId)

    if (!deckId) {
      router.push('/')
    }

    deck.value = await deckRepository.deckOfId(deckId)
    cards.value = await cardRepository.ofDeck(deckId)
  },
  { immediate: true }
)
</script>

<template>
  <form class="page flow">
    <h1>
      <input type="text" v-model="deck.name" /> <span class="sr-only">{{ deck.name }}</span>
    </h1>

    <section class="flow">
      <header>
        <h2>Cards</h2>
        <button class="button" name="add_card" :value="deck.id" @click.prevent="addCard">
          Novo Card
        </button>
      </header>

      <fieldset class="flow">
        <template v-for="card in cards" :key="card.id">
          <article :id="card.id">
            <label>
              <span>Pergunta</span>
              <textarea placeholder="Digite a pergunta..." v-model="card.question"></textarea>
            </label>

            <label>
              <span>Resposta</span>
              <textarea placeholder="Digite a resposta..." v-model="card.answer"></textarea>
            </label>

            <button
              class="button"
              data-variant="danger"
              name="remove_card"
              :value="card.id"
              @click.prevent="removeCard(card)"
            >
              <span class="gg-trash"></span>
            </button>
          </article>
        </template>
      </fieldset>
    </section>

    <button
      v-if="cards.length"
      @click.prevent="saveDeck"
      class="button"
      name="save_deck"
      :value="deck.id"
    >
      Salvar Deck
    </button>
  </form>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

input,
textarea {
  all: unset;
  cursor: pointer;
  min-width: 0;
}

section > div {
  display: grid;
  gap: 1em;
}

fieldset {
  border: none;
}

form > button {
  --flow: 2em;

  width: 100%;
}

article {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas: 'first last';
  grid-auto-flow: column;
}

article button {
  grid-area: last;
  place-self: start end;
  margin-top: 4px;
  margin-right: 4px;

  --button-font-size: 0.65;
}

label {
  flex: 1;
  display: grid;
  border: 4px solid;
  border-radius: 0.5em;
  padding: 1em;

  cursor: pointer;
}

label:first-child {
  grid-area: first;
  border-color: #ccc;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

label:last-of-type {
  grid-area: last;
  border-color: hsl(216, 87%, 55%);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

label span {
  font-size: 1em;
  color: #777;
}

label textarea {
  font-size: 1.5em;
  font-weight: bold;
  word-break: break-all;
  word-wrap: break-word;
  resize: vertical;
}
</style>
