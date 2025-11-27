<script setup>
import { useGame } from '../composables/useGame'

const { state, resetGame } = useGame()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-6 space-y-8 text-center">
    
    <h1 class="text-4xl font-bold text-white">Juego Terminado</h1>

    <div class="space-y-2">
      <p class="text-gray-400 text-sm uppercase tracking-widest">La Palabra Secreta Era</p>
      <p class="text-5xl font-black text-blue-400">{{ state.secretWord }}</p>
    </div>

    <div class="w-full space-y-4">
      <h2 class="text-xl text-red-400 font-bold border-b border-gray-700 pb-2">Los Espías Eran</h2>
      <div 
        v-for="index in state.spyIndices" 
        :key="index"
        class="bg-red-900/20 p-4 rounded-xl border border-red-500/30 flex items-center space-x-4"
      >
        <img :src="state.players[index].avatar" class="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-500" alt="Avatar" />
        <span class="text-2xl font-bold text-white">{{ state.players[index].name }}</span>
      </div>
    </div>

    <button 
      @click="resetGame"
      class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-8 glow-gradient-green-emerald glow-gradient-green-emerald-hover"
    >
      Jugar de Nuevo
    </button>

  </div>
</template>
