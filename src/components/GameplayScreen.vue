<script setup>
import { ref, onMounted } from 'vue'
import { useGame } from '../composables/useGame'
import gsap from 'gsap'

const { state, revealSpies } = useGame()
const showCategory = ref(true)

onMounted(() => {
    const tl = gsap.timeline()

    tl.from('.gsap-title', {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
    }).from(
        '.gsap-player-card',
        {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(1.5)',
        },
        '-=0.3'
    )
})

const handleReveal = () => {
    gsap.to('.gsap-container', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: revealSpies,
    })
}
</script>

<template>
    <div
        class="gsap-container flex flex-col gap-4 items-center justify-between h-full w-full max-w-md mx-auto p-6 py-12"
    >
        <div class="text-center space-y-4">
            <h1 class="gsap-title text-3xl font-bold text-white">
                Juego en Progreso
            </h1>
            <p class="gsap-title text-gray-400">
                ¡Haz preguntas y encuentra al espía!
            </p>
        </div>

        <div class="w-full grid grid-cols-2 gap-4">
            <div
                v-for="player in state.players"
                :key="player.id"
                class="gsap-player-card bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-2"
            >
                <img
                    :src="player.avatar"
                    class="w-16 h-16 rounded-full bg-gray-700 border border-gray-600"
                    alt="Avatar"
                />
                <span
                    class="text-white font-medium text-center leading-tight"
                    >{{ player.name }}</span
                >
            </div>
        </div>

        <div class="w-full space-y-4">
            <button
                @click="handleReveal"
                class="w-full py-4 bg-red-600 rounded-2xl text-white text-xl font-bold shadow-lg hover:bg-red-500 transition-all active:scale-95 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 glow-red glow-red-hover"
            >
                Revelar Espías
            </button>
        </div>
    </div>
</template>
