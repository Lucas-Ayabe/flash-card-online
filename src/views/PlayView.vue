<script setup lang="ts">
import { useGame } from '@/composables/use-game'
import type { Card } from '@/data/card'
import type { Deck } from '@/data/deck'
import { factories } from '@/di'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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
const game = useGame(
  cards.value.map((card) => ({
    ...card,
    deck: card.deckId
  }))
)
const card = game.currentCard
const stats = game.stats

function reset() {
  router.go(0)
}

watch(
  () => props.id || '',
  async () => {
    const deckId = props.id || ''
    if (!deckId) {
      router.push('/')
    }

    deck.value = await deckRepository.deckOfId(deckId)
    cards.value = await cardRepository.ofDeck(deckId)
    game.start(cards.value)
  },
  { immediate: true }
)
</script>

<template>
  <main>
    <article
      :class="{ 'flip-card': true, 'is-flipped': card?.isFlipped }"
      v-if="!game.isCompleted.value && card"
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div>
            <h2>Pergunta</h2>
            <p>{{ card.question }}</p>
          </div>
          <footer>
            <button class="button" @click="game.flip(card.id)">Mostrar Resposta</button>
          </footer>
        </div>
        <div class="flip-card-back">
          <div>
            <h2>Resposta</h2>
            <p>{{ card.answer }}</p>
          </div>
          <footer>
            <button class="button" @click="game.markAsSuccess(card.id)">Acertou</button>
            <button class="button" data-variant="danger" @click="game.markAsFailure(card.id)">
              Errou
            </button>
          </footer>
        </div>
      </div>
    </article>

    <section class="stats flow" v-if="game.isCompleted.value">
      <h1>Resultados</h1>
      <template v-for="card of stats" :key="card.id">
        <article class="stat">
          <h2>{{ card.question }}</h2>

          <footer>
            <span>Erros: {{ card.fails }}</span>
          </footer>
        </article>
      </template>

      <button class="button" @click="reset">Jogar Novamente</button>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  align-items: start;
  gap: 1em;
}

article:not(.flip-card) {
  border: 1px solid #ccc;
  border-radius: 0.25em;
  padding: 1.5em;
}

.flip-card {
  background-color: transparent;
  perspective: 1000px;
  width: 100%;
  height: 300px;
}

.flip-card-front,
.flip-card-back {
  display: grid;
  gap: 1em;

  border: 4px solid #ccc;
  border-radius: 0.25ch;
  padding: 1.5em;

  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-back {
  border-color: hsl(216, 87%, 55%);
  transform: rotateY(180deg);
}

div h2 {
  font-weight: normal;
  font-size: 1em;
  color: #777;
}

div p {
  font-weight: bold;
  font-size: 1.5em;
}

article footer {
  display: flex;
  align-items: flex-end;
  gap: 1em;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s; /* Animation for the flip effect */
  transform-style: preserve-3d; /* Ensures children are positioned in 3D space */
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg); /* Flips the card on hover */
}

.stats {
  display: grid;
  gap: 1em;
}
</style>
