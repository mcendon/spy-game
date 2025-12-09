import { reactive, computed } from 'vue'

const STORAGE_KEY = 'spy-game-settings'
const CATEGORIES_STORAGE_KEY = 'spy-game-categories'

const defaultSettings = {
  playerCount: 3,
  spyCount: 1,
  categories: ['Lugares'],
  timer: 0,
  playerNames: [],
  spiesKnowEachOther: false,
  showCategoryToSpies: false,
  randomCategory: true
}

const defaultCategories = {
  'Lugares': [
    'Escuela', 'Hospital', 'Playa', 'Estación Espacial', 'Supermercado', 'Cine', 'Biblioteca', 'Restaurante', 'Avión', 'Estación de Tren',
    'Zoo', 'Gimnasio', 'Teatro', 'Museo', 'Parque de Atracciones', 'Acuario', 'Desierto', 'Taller Mecánico', 'Comisaría', 'Universidad'
  ],
  'Animales': [
    'León', 'Pingüino', 'Elefante', 'Jirafa', 'Canguro', 'Delfín', 'Águila', 'Tiburón', 'Oso', 'Mono',
    'Serpiente', 'Cebra', 'Rinoceronte', 'Murciélago', 'Búho', 'Koala', 'Pez Payaso', 'Hipopótamo', 'Gorila', 'Lobo'
  ],
  'Comida': [
    'Pizza', 'Sushi', 'Hamburguesa', 'Helado', 'Tacos', 'Tortitas', 'Ensalada', 'Espaguetis', 'Donut', 'Filete',
    'Croissant', 'Sopa', 'Patatas Fritas', 'Bocadillo', 'Lentejas', 'Zumo', 'Tarta', 'Salchicha', 'Galletas', 'Nuggets'
  ],
  'Personajes': [
    'Spiderman', 'Batman', 'Superman', 'Flash', 'Wonder Woman', 'Hulk', 'Thor', 'Iron Man', 'Capitan America', 'Black Widow',
    'Joker', 'Voldemort', 'Gandalf', 'Harry Potter', 'Pikachu', 'Darth Vader', 'Bella', 'Sherlock Holmes', 'Drácula', 'El Zorro'
  ],
  'Peliculas': [
    'Star Wars', 'Star Trek', 'Matrix', 'Jurassic Park', 'Avatar', 'Inception', 'Interstellar', 'The Matrix', 'The Terminator', 'The Avengers',
    'Titanic', 'El Padrino', 'Pulp Fiction', 'Alien', 'E.T.', 'Toy Story', 'Braveheart', 'Gladiator', 'El Señor de los Anillos', 'Forrest Gump'
  ],
  'Oficios': [
    'Fontanero', 'Opositor', 'Albañil', 'Dependiente', 'Cajero', 'Abogado', 'Panadero', 'Barrendero', 'Auxiliar', 'Crítico de cine',
    'Opositora', 'Dependienta', 'Cajera', 'Abogada', 'Panadera', 'Barrendera', 'Azafata', 'Maestra', 'Enfermera', 'Actriz'
  ],
  'Fiesta': [
    'San Fermín', 'La Tomatina', 'Nochevieja', 'Reyes Magos', 'Feria de Abril', 'Fallas', 'Botellón', 'Churros', 'Cotillón', 'Pestiños',
    'Carnaval', 'Verbenas', 'Romería', 'Chupinazo', 'Gigantes y cabezudos', 'Caseta', 'Paso de Semana Santa', 'Belén', 'Cabalgata', 'Piñata'
  ],
  'Objetos de casa': [
    'Tendedero', 'Fregona', 'Bajera', 'Desatascador', 'Vitrocerámica', 'Persiana', 'Calderilla', 'Mesilla', 'Tarro', 'Cubiertos',
    'Sartén', 'Batidora', 'Manta', 'Tabla de planchar', 'Escobilla', 'Alfombra', 'Sacacorchos', 'Candelabro', 'Tetera', 'Cojín'
  ],
  'Comida española': [
    'Tortilla de patatas', 'Paella', 'Jamón serrano', 'Gazpacho', 'Croquetas', 'Porra', 'Callos', 'Rabo de toro', 'Turrón', 'Gofre',
    'Pulpo a la gallega', 'Patatas bravas', 'Migas', 'Pinchos', 'Chuletón', 'Fabada', 'Pimientos de Padrón', 'Crema catalana', 'Cachopo', 'Rosquillas'
  ],
  'Lugares de España': [
    'Plaza Mayor', 'La Sagrada Familia', 'El Retiro', 'La Alhambra', 'El Guggenheim', 'Mercadona', 'El Corte Inglés', 'Estación de Atocha', 'Puerta del Sol', 'El Bernabéu',
    'La Mezquita', 'Plaza de España', 'La Giralda', 'Ramblas', 'Parque Güell', 'Catedral de Burgos', 'Acueducto de Segovia', 'Museo del Prado', 'Teleférico', 'Gibraltar'
  ],
  'Cosas de playa': [
    'Sombrilla', 'Chanclas', 'Crema solar', 'Nevera portátil', 'Castillos de arena', 'Barca de pedales', 'Colchoneta', 'Cubo y pala', 'Chiringuito', 'Patines',
    'Toalla', 'Bañador', 'Gafas de sol', 'Aletas', 'Escarpines', 'Tabla de surf', 'Vóley playa', 'Heladero', 'Marea', 'Duna'
  ],
  'Geografía': [
    'Península', 'Archipiélago', 'Volcán', 'Meseta', 'Glaciar', 'Estrecho', 'Océano', 'Afluente', 'Cordillera', 'Desembocadura',
    'Cabo', 'Valle', 'Isla', 'Huso horario', 'Latitud', 'Ecuador', 'Continente', 'Círculo Polar', 'Precipitación', 'Clima'
  ],
  'Tecnología': [
    'USB', 'Router', 'Captcha', 'Cifrado', 'Pendrive', 'Streaming', 'Hackeo', 'Algoritmo', 'Disco duro', 'Webcam',
    'Firewall', 'Proxy', 'Servidor', 'Dominio', 'Base de datos', 'Tablet', 'Auriculares', 'Cable de red', 'Dongle', 'Batería externa'
  ],
  'Conceptos': [
    'Lealtad', 'Secreto', 'Causa', 'Silencio', 'Sospecha', 'Confianza', 'Coartada', 'Misión', 'Propaganda', 'Exilio',
    'Doble juego', 'Paciencia', 'Código', 'Fidelidad', 'Amenaza', 'Traición', 'Motivo', 'Identidad', 'Vigilancia', 'Mentira'
  ],
  'Oficina': [
    'Grapadora', 'Archivador', 'Post-it', 'Tarjetero', 'Tóner', 'Trituradora', 'Agenda', 'Sello', 'Móvil de empresa', 'DNI',
    'Subrayador', 'Bloc de notas', 'Calculadora', 'Perforadora', 'Separadores', 'Escáner', 'Carpeta', 'Clip', 'Bolígrafo', 'Cafetera'
  ],
  'Ocio': [
    'Discoteca', 'Pub', 'Bolera', 'Casino', 'Escape Room', 'Terraza', 'Parque temático', 'Karaoke', 'Sala de billar', 'Gimnasio',
    'Concierto', 'Festival', 'Monólogo', 'Museo de cera', 'Paseo en barca', 'Mercadillo', 'Picnic', 'Pista de hielo', 'Degustación', 'Zapping'
  ],
  'Viaje': [
    'Visado', 'Aduana', 'Control de pasaportes', 'Maleta de cabina', 'Billete de tren', 'Recorrido', 'Terminal', 'Escala', 'Reserva', 'Alojamiento',
    'Hostal', 'Check-in', 'Itinerario', 'Souvenir', 'Guía turístico', 'Cambio de divisa', 'Equipaje de mano', 'Embarque', 'Jet lag', 'Frontera'
  ]
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultSettings

    const parsed = JSON.parse(saved)
    // Migration: if category is string, convert to array
    if (parsed.category && typeof parsed.category === 'string') {
      parsed.categories = [parsed.category]
      delete parsed.category
    }

    return { ...defaultSettings, ...parsed }
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
  currentCategory: '',
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
  const getAvatarUrl = (seed) => `https://api.dicebear.com/9.x/adventurer/svg?skinColor=f2d3b1,ecad80&glassesProbability=30&backgroundColor=c8aede,ffdfbf,ffffff,b6e3f4,ffd5dc,e0ffe0&seed=${encodeURIComponent(seed)}`;

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
      avatar: getAvatarUrl(name)
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
    let chosenCategory

    if (state.settings.randomCategory) {
      const keys = Object.keys(allCategories)
      chosenCategory = keys[Math.floor(Math.random() * keys.length)]
    } else {
      const selected = state.settings.categories || []
      if (selected.length === 0) {
        chosenCategory = 'Lugares'
      } else {
        chosenCategory = selected[Math.floor(Math.random() * selected.length)]
      }
    }

    state.currentCategory = chosenCategory
    const words = allCategories[chosenCategory] || allCategories['Lugares'] || defaultCategories['Lugares']
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
    state.currentCategory = ''
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
    getAvatarUrl,
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

