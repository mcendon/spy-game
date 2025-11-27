<script setup>
import { useGame } from './composables/useGame'
import SetupScreen from './components/SetupScreen.vue'
import RoleRevealScreen from './components/RoleRevealScreen.vue'
import GameplayScreen from './components/GameplayScreen.vue'
import ResultScreen from './components/ResultScreen.vue'

const { state } = useGame()
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
    <transition name="fade" mode="out-in">
      <SetupScreen v-if="state.gameState === 'SETUP'" />
      <RoleRevealScreen v-else-if="state.gameState === 'REVEAL'" />
      <GameplayScreen v-else-if="state.gameState === 'PLAYING'" />
      <ResultScreen v-else-if="state.gameState === 'FINISHED'" />
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
