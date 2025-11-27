import { reactive, computed } from 'vue'

const STORAGE_KEY = 'spy-game-settings'
const CATEGORIES_STORAGE_KEY = 'spy-game-categories'

const defaultSettings = {
  playerCount: 3,
  spyCount: 1,
  category: 'Lugares',
  timer: 0,
  playerNames: [],
  spiesKnowEachOther: false,
  showCategoryToSpies: false,
  randomCategory: true
}

const defaultCategories = {
  Lugares: ['Escuela', 'Hospital', 'Playa', 'Estación Espacial', 'Supermercado', 'Cine', 'Biblioteca', 'Restaurante', 'Avión', 'Estación de Tren'],
  Animales: ['León', 'Pingüino', 'Elefante', 'Jirafa', 'Canguro', 'Delfín', 'Águila', 'Tiburón', 'Oso', 'Mono'],
  Comida: ['Pizza', 'Sushi', 'Hamburguesa', 'Helado', 'Tacos', 'Tortitas', 'Ensalada', 'Espaguetis', 'Donut', 'Filete'],
  Personajes: ['Spiderman', 'Batman', 'Superman', 'Flash', 'Wonder Woman', 'Hulk', 'Thor', 'Iron Man', 'Capitan America', 'Black Widow'],
  Peliculas: ['Star Wars', 'Star Trek', 'Matrix', 'Jurassic Park', 'Avatar', 'Inception', 'Interstellar', 'The Matrix', 'The Terminator', 'The Avengers'],
}

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  } catch (e) {
    console.error("Failed to load settings:", e);
    return defaultSettings
  }
}

const loadCustomCategories = () => {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {
    console.error("Failed to load custom categories:", e);
    return {}
  }
}

const state = reactive({
  gameState: 'SETUP', // SETUP, REVEAL, PLAYING, FINISHED
  players: [],
  settings: loadSettings(),
  customCategories: loadCustomCategories(),
  secretWord: '',
  spyIndices: [],
  currentPlayerIndex: 0, // For the reveal phase
})

const saveCustomCategories = () => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(state.customCategories))
}

export function useGame() {
  const allCategories = () => ({
    ...defaultCategories,
    ...state.customCategories
  })

  const startGame = (settings) => {
    state.settings = { ...state.settings, ...settings }

    // Use provided names or generate default ones
    const names = settings.playerNames && settings.playerNames.length === settings.playerCount
      ? settings.playerNames
      : Array.from({ length: settings.playerCount }, (_, i) => `Jugador ${i + 1}`)

    state.players = names.map((name, i) => ({
      id: i,
      name: name,
      role: 'Ciudadano',
      isRevealed: false,
      avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    }))

    // Assign Spies
    let spiesAssigned = 0
    state.spyIndices = []
    while (spiesAssigned < state.settings.spyCount) {
      const randomIndex = Math.floor(Math.random() * state.settings.playerCount)
      if (state.players[randomIndex].role !== 'Espía') {
        state.players[randomIndex].role = 'Espía'
        state.spyIndices.push(randomIndex)
        spiesAssigned++
      }
    }

    // Select Word
    const allCategories = { ...defaultCategories, ...state.customCategories }

    if (state.settings.randomCategory) {
      const keys = Object.keys(allCategories)
      const randomKey = keys[Math.floor(Math.random() * keys.length)]
      state.settings.category = randomKey
    }

    const words = allCategories[state.settings.category] || allCategories['Lugares'] || defaultCategories['Lugares']
    state.secretWord = words[Math.floor(Math.random() * words.length)]

    state.currentPlayerIndex = 0
    state.gameState = 'REVEAL'
  }

  const nextPlayer = () => {
    if (state.currentPlayerIndex < state.players.length - 1) {
      state.currentPlayerIndex++
    } else {
      state.gameState = 'PLAYING'
    }
  }

  const revealSpies = () => {
    state.gameState = 'FINISHED'
  }

  const resetGame = () => {
    state.gameState = 'SETUP'
    state.players = []
    state.secretWord = ''
    state.spyIndices = []
    state.currentPlayerIndex = 0
  }

  return {
    state,
    categories: computed(() => Object.keys({ ...defaultCategories, ...state.customCategories })),
    startGame,
    nextPlayer,
    revealSpies,
    resetGame,
    getAvatarUrl: (seed) => `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}`,
    saveSettings: (newSettings) => {
      state.settings = { ...state.settings, ...newSettings }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings))
    },
    // Category Management
    getAllCategories: () => ({ ...defaultCategories, ...state.customCategories }),
    addCategory: (name, words) => {
      state.customCategories[name] = words
      localStorage.setItem(STORAGE_KEY + '-categories', JSON.stringify(state.customCategories))
    },
    removeCategory: (name) => {
      delete state.customCategories[name]
      localStorage.setItem(STORAGE_KEY + '-categories', JSON.stringify(state.customCategories))
    },
    updateCategory: (name, words) => {
      state.customCategories[name] = words
      localStorage.setItem(STORAGE_KEY + '-categories', JSON.stringify(state.customCategories))
    }
  }
}
