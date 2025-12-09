<script setup>
import { onMounted } from 'vue'
import { useGame } from '../composables/useGame'
import gsap from 'gsap'

const { state, resetGame } = useGame()

onMounted(() => {
    const tl = gsap.timeline()

    tl.from('.gsap-title', {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
    })
        .from(
            '.gsap-word-reveal',
            {
                y: 20,
                opacity: 0,
                duration: 0.5,
            },
            '-=0.2'
        )
        .from('.gsap-spies-title', {
            opacity: 0,
            duration: 0.4,
        })
        .from(
            '.gsap-spy-card',
            {
                x: -30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: 'power2.out',
            },
            '-=0.2'
        )
})

const handleReset = () => {
    gsap.to('.gsap-container', {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        onComplete: resetGame,
    })
}
</script>

<template>
    <div
        class="gsap-container flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4 pt-8 pb-12 md:pt-6 md:pb-6 space-y-8 text-center"
    >
        <h1 class="gsap-title text-4xl font-bold text-white">
            Juego Terminado
        </h1>

        <div class="gsap-word-reveal space-y-2">
            <p class="text-gray-400 text-sm uppercase tracking-widest">
                La Palabra Secreta Era
            </p>
            <p class="text-5xl font-black text-blue-400">
                {{ state.secretWord }}
            </p>
        </div>

        <div class="w-full space-y-4">
            <h2
                class="gsap-spies-title text-xl text-red-400 font-bold border-b border-gray-700 pb-2"
            >
                Los Espías Eran
            </h2>
            <div
                v-for="index in state.spyIndices"
                :key="index"
                class="gsap-spy-card bg-red-900/20 p-4 rounded-xl border border-red-500/30 flex items-center space-x-4"
            >
                <img
                    :src="state.players[index].avatar"
                    class="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-500"
                    alt="Avatar"
                />
                <span class="text-2xl font-bold text-white">{{
                    state.players[index].name
                }}</span>
            </div>
        </div>

        <button
            @click="handleReset"
            class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 mt-8 glow-gradient-green-emerald glow-gradient-green-emerald-hover"
        >
            Jugar de Nuevo
        </button>
    </div>
</template>
