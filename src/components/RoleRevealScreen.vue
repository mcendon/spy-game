<script setup>
import { ref, computed } from 'vue'
import { useGame } from '../composables/useGame'

const { state, nextPlayer } = useGame()

const isRevealed = ref(false)

const currentPlayer = computed(() => state.players[state.currentPlayerIndex])

const otherSpies = computed(() => {
  if (!state.settings.spiesKnowEachOther || currentPlayer.value.role !== 'Espía') return []
  return state.players
    .filter(p => p.role === 'Espía' && p.id !== currentPlayer.value.id)
    .map(p => p.name)
})

const handleReveal = () => {
  isRevealed.value = true
}

const handleNext = () => {
  isRevealed.value = false
  nextPlayer()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-6 text-center space-y-8">
    
    <div v-if="!isRevealed" class="space-y-8 animate-fade-in">
      <div class="space-y-4">
        <h2 class="text-2xl text-gray-400 font-medium">Pasa el dispositivo a</h2>
        <h1 class="text-5xl font-bold text-white">{{ currentPlayer.name }}</h1>
      </div>
      
      <div class="w-40 h-40 mx-auto bg-gray-800 rounded-full flex items-center justify-center shadow-inner border-4 border-gray-700 overflow-hidden">
        <img :src="currentPlayer.avatar" class="w-full h-full object-cover" alt="Avatar" />
      </div>

      <button 
        @click="handleReveal"
        class="w-full py-4 bg-blue-600 rounded-2xl text-white text-xl font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 glow-blue glow-blue-hover"
      >
        Toca para Revelar Rol
      </button>
    </div>

    <div v-else class="space-y-8 w-full animate-fade-in-up">
      <div class="space-y-2">
        <h2 class="text-xl text-gray-400">Eres...</h2>
        <h1 
          class="text-4xl font-black tracking-wider"
          :class="currentPlayer.role === 'Espía' ? 'text-red-500' : 'text-green-400'"
        >
          {{ currentPlayer.role === 'Espía' ? 'EL ESPÍA' : 'CIUDADANO' }}
        </h1>
      </div>

      <div v-if="currentPlayer.role === 'Ciudadano'" class="p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
        <p class="text-gray-400 text-sm mb-2 uppercase tracking-widest">Palabra Secreta</p>
        <p class="text-4xl font-bold text-white">{{ state.secretWord }}</p>
      </div>

      <div v-else class="p-6 bg-gray-800 rounded-2xl border border-red-900/30 shadow-xl space-y-4">
        <p class="text-red-300 text-lg">¡Intenta pasar desapercibido y adivina la palabra!</p>
        
        <div v-if="state.settings.showCategoryToSpies" class="pt-4 border-t border-gray-700">
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-1">Pista de Categoría</p>
          <p class="text-xl font-bold text-white">{{ state.settings.category }}</p>
        </div>

        <div v-if="state.settings.spiesKnowEachOther && otherSpies.length > 0" class="pt-4 border-t border-gray-700">
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-1">Otros Espías</p>
          <p class="text-xl font-bold text-red-400">{{ otherSpies.join(', ') }}</p>
        </div>
      </div>

      <button 
        @click="handleNext"
        class="w-full py-4 bg-gray-700 rounded-2xl text-white text-xl font-bold shadow-lg hover:bg-gray-600 transition-all active:scale-95 glow-gray glow-gray-hover"
      >
        {{ state.currentPlayerIndex < state.players.length - 1 ? 'Siguiente Jugador' : 'Comenzar Juego' }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
