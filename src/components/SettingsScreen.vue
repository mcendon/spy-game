<script setup>
import { ref, computed } from 'vue'
import { useGame } from '../composables/useGame'

const { state, saveSettings, getAllCategories, addCategory, removeCategory, updateCategory } = useGame()

const emit = defineEmits(['close'])

const spiesKnowEachOther = ref(state.settings.spiesKnowEachOther || false)
const showCategoryToSpies = ref(state.settings.showCategoryToSpies || false)

const allCategories = computed(() => getAllCategories())
const customCategoryNames = computed(() => Object.keys(state.customCategories))

// Editor State
const isEditing = ref(false)
const editingName = ref('')
const editingWords = ref('')
const originalName = ref('') // To track renames

const openEditor = (name = '', words = []) => {
  editingName.value = name
  originalName.value = name
  editingWords.value = words.join('\n')
  isEditing.value = true
}

const saveCategory = () => {
  if (!editingName.value.trim()) return
  
  const words = editingWords.value.split('\n').map(w => w.trim()).filter(w => w)
  if (words.length < 3) {
    alert('Necesitas al menos 3 palabras para una categoría.')
    return
  }

  if (originalName.value && originalName.value !== editingName.value) {
    removeCategory(originalName.value)
  }
  
  if (originalName.value) {
      updateCategory(editingName.value, words)
  } else {
      addCategory(editingName.value, words)
  }

  isEditing.value = false
}

const deleteCategory = (name) => {
  if (confirm(`¿Estás seguro de borrar la categoría "${name}"?`)) {
    removeCategory(name)
  }
}

const saveAndClose = () => {
  saveSettings({
    ...state.settings,
    spiesKnowEachOther: spiesKnowEachOther.value,
    showCategoryToSpies: showCategoryToSpies.value
  })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="p-4 flex items-center justify-between bg-gray-800 border-b border-gray-700 shrink-0">
      <h2 class="text-xl font-bold text-white">Configuración</h2>
      <button @click="saveAndClose" class="text-blue-400 font-medium hover:text-blue-300">Listo</button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      
      <!-- Game Options -->
      <section class="space-y-4">
        <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider">Opciones de Juego</h3>
        
        <div class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 divide-y divide-gray-700">
          <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors">
            <div class="space-y-1">
              <span class="text-white font-medium block">Espías se conocen</span>
              <span class="text-gray-400 text-xs block">Si hay varios espías, sabrán quiénes son sus aliados.</span>
            </div>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="spiesKnowEachOther" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>

          <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors">
            <div class="space-y-1">
              <span class="text-white font-medium block">Mostrar categoría al Espía</span>
              <span class="text-gray-400 text-xs block">El espía verá la categoría general, pero no el lugar específico.</span>
            </div>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="showCategoryToSpies" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>
      </section>

      <!-- Custom Categories -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-gray-400 text-sm font-bold uppercase tracking-wider">Categorías Personalizadas</h3>
          <button @click="openEditor()" class="text-blue-400 text-sm font-medium hover:text-blue-300">+ Nueva</button>
        </div>

        <div v-if="customCategoryNames.length === 0" class="text-center py-8 bg-gray-800/50 rounded-xl border border-gray-700/50 border-dashed">
          <p class="text-gray-500 text-sm">No tienes categorías personalizadas.</p>
        </div>

        <div class="space-y-2">
          <div 
            v-for="catName in customCategoryNames" 
            :key="catName"
            class="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between"
          >
            <div>
              <span class="text-white font-medium block">{{ catName }}</span>
              <span class="text-gray-500 text-xs">{{ allCategories[catName].length }} palabras</span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="openEditor(catName, allCategories[catName])" class="p-2 text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="deleteCategory(catName)" class="p-2 text-red-400 hover:text-red-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Editor Modal -->
    <div v-if="isEditing" class="absolute inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div class="bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 flex flex-col max-h-full">
        <div class="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">{{ originalName ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="isEditing = false" class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4 space-y-4 overflow-y-auto">
          <div class="space-y-2">
            <label class="text-gray-300 text-sm font-medium">Nombre</label>
            <input 
              v-model="editingName"
              class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Ej. Deportes"
            />
          </div>
          
          <div class="space-y-2">
            <label class="text-gray-300 text-sm font-medium">Palabras (una por línea)</label>
            <textarea 
              v-model="editingWords"
              rows="8"
              class="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
              placeholder="Fútbol&#10;Baloncesto&#10;Tenis..."
            ></textarea>
            <p class="text-xs text-gray-500">Mínimo 3 palabras.</p>
          </div>
        </div>

        <div class="p-4 border-t border-gray-700">
          <button 
            @click="saveCategory"
            class="w-full py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
