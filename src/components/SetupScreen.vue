<script setup>
import { ref, watch } from 'vue'
import { useGame } from '../composables/useGame'
import SettingsScreen from './SettingsScreen.vue'

const { categories, startGame, state, saveSettings, getAvatarUrl } = useGame()

const showSettings = ref(false)

const playerCount = ref(state.settings.playerCount)
const spyCount = ref(state.settings.spyCount)
const selectedCategory = ref(state.settings.category)
const randomCategory = ref(state.settings.randomCategory ?? true)
const playerNames = ref(state.settings.playerNames.length === state.settings.playerCount 
  ? [...state.settings.playerNames] 
  : Array.from({ length: state.settings.playerCount }, (_, i) => `Jugador ${i + 1}`))

// Ensure spy count is valid and update player names array
watch(playerCount, (newVal) => {
  if (spyCount.value >= newVal) {
    spyCount.value = Math.max(1, newVal - 1)
  }
  
  // Adjust player names array size
  if (newVal > playerNames.value.length) {
    for (let i = playerNames.value.length; i < newVal; i++) {
      playerNames.value.push(`Jugador ${i + 1}`)
    }
  } else {
    playerNames.value = playerNames.value.slice(0, newVal)
  }
})

// Save settings whenever they change
watch([playerCount, spyCount, selectedCategory, playerNames, randomCategory], () => {
  saveSettings({
    playerCount: playerCount.value,
    spyCount: spyCount.value,
    category: selectedCategory.value,
    playerNames: playerNames.value,
    randomCategory: randomCategory.value
  })
}, { deep: true })

const draggedIndex = ref(null)

const onDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  // Add a ghost class or style if needed, but browser default is usually okay
}

const onDrop = (index) => {
  const fromIndex = draggedIndex.value
  const toIndex = index
  
  if (fromIndex === null || fromIndex === toIndex) return
  
  const item = playerNames.value[fromIndex]
  playerNames.value.splice(fromIndex, 1)
  playerNames.value.splice(toIndex, 0, item)
  
  draggedIndex.value = null
}

const handleStart = () => {
  startGame({
    playerCount: playerCount.value,
    spyCount: spyCount.value,
    category: selectedCategory.value,
    playerNames: playerNames.value,
    randomCategory: randomCategory.value
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto p-6 space-y-8 overflow-y-auto">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-tight shrink-0">
        Juego de Espías
      </h1>
      <button @click="showSettings = true" class="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <div class="w-full space-y-6 grow">
      <!-- Player Count -->
      <div class="space-y-2">
        <label class="text-gray-300 font-medium text-lg">Jugadores</label>
        <div class="flex items-center justify-between bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <button 
            @click="playerCount = Math.max(3, playerCount - 1)"
            class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl transition-colors"
          >-</button>
          <span class="text-3xl font-bold text-white">{{ playerCount }}</span>
          <button 
            @click="playerCount++"
            class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl transition-all glow-blue glow-blue-hover"
          >+</button>
        </div>
      </div>

      <!-- Player Names -->
      <div class="space-y-2">
        <label class="text-gray-300 font-medium text-lg">Nombres</label>
        <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="(name, index) in playerNames" 
            :key="index" 
            class="flex items-center space-x-2 group"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragover.prevent
            @drop="onDrop(index)"
          >
            <div class="cursor-move text-gray-500 hover:text-gray-300 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
            </div>
            <img :src="getAvatarUrl(name)" class="w-10 h-10 rounded-full bg-gray-700 border border-gray-600" alt="Avatar" />
            <span class="text-gray-500 w-6 text-sm select-none">{{ index + 1 }}.</span>
            <input 
              v-model="playerNames[index]"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Nombre"
            />
          </div>
        </div>
      </div>

      <!-- Spy Count -->
      <div class="space-y-2">
        <label class="text-gray-300 font-medium text-lg">Espías</label>
        <div class="flex items-center justify-between bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <button 
            @click="spyCount = Math.max(1, spyCount - 1)"
            class="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-xl transition-colors"
          >-</button>
          <span class="text-3xl font-bold text-red-400">{{ spyCount }}</span>
          <button 
            @click="spyCount = Math.min(playerCount - 1, spyCount + 1)"
            class="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xl transition-all glow-red glow-red-hover"
          >+</button>
        </div>
      </div>

      <!-- Category -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-gray-300 font-medium text-lg">Categoría</label>
          <button 
            @click="randomCategory = !randomCategory"
            class="flex items-center space-x-3 group focus:outline-none"
          >
            <span class="text-sm font-medium transition-colors duration-200" :class="randomCategory ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'">Aleatoria</span>
            <div class="relative inline-block w-12 h-7 transition duration-200 ease-in-out rounded-full border-2 border-transparent"
                 :class="randomCategory ? 'bg-blue-600' : 'bg-gray-700'">
              <span class="absolute left-0 top-0 inline-block w-6 h-6 bg-white rounded-full shadow transform transition duration-200 ease-in-out"
                    :class="randomCategory ? 'translate-x-5' : 'translate-x-0'"></span>
            </div>
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2" :class="{ 'opacity-50 pointer-events-none': randomCategory }">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat; randomCategory = false"
            :class="[
              'py-2 px-1 rounded-lg text-sm font-semibold transition-all duration-200',
              selectedCategory === cat && !randomCategory
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <button 
      @click="handleStart"
      class="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 glow-gradient-blue-purple glow-gradient-blue-purple-hover"
    >
      Comenzar
    </button>

    <SettingsScreen v-if="showSettings" @close="showSettings = false" />
  </div>
</template>
