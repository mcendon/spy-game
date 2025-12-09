<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useGame } from '../composables/useGame'
import gsap from 'gsap'

const { state, nextPlayer } = useGame()

const isRevealed = ref(false)

const currentPlayer = computed(() => state.players[state.currentPlayerIndex])

const otherSpies = computed(() => {
    if (
        !state.settings.spiesKnowEachOther ||
        currentPlayer.value.role !== 'Espía'
    )
        return []
    return state.players
        .filter((p) => p.role === 'Espía' && p.id !== currentPlayer.value.id)
        .map((p) => p.name)
})

const animateIntro = () => {
    gsap.from('.gsap-intro-text', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
    })
    gsap.from('.gsap-avatar', {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.2,
    })
}

const animateReveal = () => {
    gsap.from('.gsap-role-text', {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.6)',
    })
    gsap.from('.gsap-info-box', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
    })
}

onMounted(() => {
    animateIntro()
})

watch(isRevealed, async (newVal) => {
    await nextTick()
    if (newVal) {
        animateReveal()
    } else {
        animateIntro()
    }
})

const handleReveal = () => {
    gsap.to('.gsap-intro-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        onComplete: () => {
            isRevealed.value = true
        },
    })
}

const handleNext = () => {
    gsap.to('.gsap-reveal-container', {
        opacity: 0,
        x: -50,
        duration: 0.2,
        onComplete: () => {
            isRevealed.value = false
            nextPlayer()
        },
    })
}
</script>

<template>
    <div
        class="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4 pt-8 pb-12 md:pt-6 md:pb-6 text-center space-y-8 overflow-hidden"
    >
        <div v-if="!isRevealed" class="gsap-intro-container space-y-8 w-full">
            <div class="space-y-4">
                <h2 class="gsap-intro-text text-2xl text-gray-400 font-medium">
                    Pasa el dispositivo a
                </h2>
                <h1 class="gsap-intro-text text-5xl font-bold text-white">
                    {{ currentPlayer.name }}
                </h1>
            </div>

            <div
                class="gsap-avatar w-40 h-40 mx-auto bg-gray-800 rounded-full flex items-center justify-center shadow-inner border-4 border-gray-700 overflow-hidden"
            >
                <img
                    :src="currentPlayer.avatar"
                    class="w-full h-full object-cover"
                    alt="Avatar"
                />
            </div>

            <button
                @click="handleReveal"
                class="w-full py-4 bg-blue-600 rounded-2xl text-white text-xl font-bold shadow-lg hover:bg-blue-500 transition-all active:scale-95 glow-blue glow-blue-hover"
            >
                Toca para Revelar Rol
            </button>
        </div>

        <div v-else class="gsap-reveal-container space-y-8 w-full">
            <div class="space-y-2">
                <h2 class="text-xl text-gray-400">Eres...</h2>
                <h1
                    class="gsap-role-text text-4xl font-black tracking-wider"
                    :class="
                        currentPlayer.role === 'Espía'
                            ? 'text-red-500'
                            : 'text-green-400'
                    "
                >
                    {{ currentPlayer.role === 'Espía' ? 'ESPÍA' : 'CIUDADANO' }}
                </h1>
            </div>

            <div
                v-if="currentPlayer.role === 'Ciudadano'"
                class="gsap-info-box p-6 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl"
            >
                <p class="text-gray-400 text-sm mb-2 uppercase tracking-widest">
                    Palabra Secreta
                </p>
                <p class="text-4xl font-bold text-white">
                    {{ state.secretWord }}
                </p>
            </div>

            <div
                v-else
                class="gsap-info-box p-6 bg-gray-800 rounded-2xl border border-red-900/30 shadow-xl space-y-4"
            >
                <p class="text-red-300 text-lg">
                    ¡Intenta pasar desapercibido y adivina la palabra!
                </p>

                <div
                    v-if="state.settings.showCategoryToSpies"
                    class="pt-4 border-t border-gray-700"
                >
                    <p
                        class="text-gray-400 text-xs uppercase tracking-widest mb-1"
                    >
                        Pista de Categoría
                    </p>
                    <p class="text-xl font-bold text-white">
                        {{ state.currentCategory }}
                    </p>
                </div>

                <div
                    v-if="
                        state.settings.spiesKnowEachOther &&
                        otherSpies.length > 0
                    "
                    class="pt-4 border-t border-gray-700"
                >
                    <p
                        class="text-gray-400 text-xs uppercase tracking-widest mb-1"
                    >
                        Otros Espías
                    </p>
                    <p class="text-xl font-bold text-red-400">
                        {{ otherSpies.join(', ') }}
                    </p>
                </div>
            </div>

            <button
                @click="handleNext"
                class="w-full py-4 bg-gray-700 rounded-2xl text-white text-xl font-bold shadow-lg hover:bg-gray-600 transition-all active:scale-95 glow-gray glow-gray-hover"
            >
                {{
                    state.currentPlayerIndex < state.players.length - 1
                        ? 'Siguiente Jugador'
                        : 'Comenzar Juego'
                }}
            </button>
        </div>
    </div>
</template>
