<template>
  <div>
  <!-- Scroll Progress Bar -->
  <motion.div
    class="fixed top-0 left-0 right-0 h-1 bg-white/20 origin-left z-50"
    :style="{ scaleX: scrollProgress }"
  />
  
  <div
    class="relative flex min-h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-slate-100 lg:h-screen lg:flex-row"
    @wheel="handleWheel"
  >
    <div class="pointer-events-none absolute inset-0 -z-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%),linear-gradient(180deg,rgba(9,9,11,0.92),rgba(9,9,11,0.99))]"></div>
      <div class="absolute inset-x-0 -top-20 h-[65vh] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_60%)] blur-3xl"></div>
      <div class="absolute -bottom-32 right-1/4 h-[55vh] w-[55vh] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_65%)] blur-2xl"></div>
    </div>

    <!-- Cursor Light Effect -->
    <ClientOnly>

    </ClientOnly>

    <!-- Intro Panel -->
    <header
      class="relative z-10 w-full border-b border-white/10 px-6 py-12 backdrop-blur-sm sm:px-12 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:border-b-0 lg:border-r lg:border-white/10 lg:py-24"
    >
      <div>
        <motion.h1
            :whileHover="{ scale: 1.02 }"
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            scale: { type: 'spring', stiffness: 100, damping: 15, mass: 0.8 }
            }"
          class="text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl"
        >
          <a href="/" class="cursor-pointer transition-colors duration-200 hover:text-white">Derin Alan Ritter</a>
        </motion.h1>
        <motion.h2 
          class="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }"
        ></motion.h2>
        <motion.p 
          class="mt-4 max-w-xs text-base italic font-medium leading-relaxed text-slate-300"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }"
        >
          Always outnumbered, never outgunned

        </motion.p>

        <nav aria-label="Section links" class="mt-10 lg:hidden">
          <ul class="flex flex-wrap gap-3">
            <motion.li 
              v-for="(item, index) in navItems" 
              :key="item.label"
              :initial="{ opacity: 0, y: -10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
                }"
            >
              <button
                type="button"
                class="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                :class="{
                  'border-white/60 bg-white/10 text-white': item.id === currentSection
                }"
                @click="scrollToSection(item.id)"
              >
                {{ item.label }}
              </button>
            </motion.li>
          </ul>
        </nav>

        <nav aria-label="Section links" class="hidden lg:block">
          <ul class="mt-16 w-max">
            <motion.li 
              v-for="(item, index) in navItems" 
              :key="item.label"
              :initial="{ opacity: 0, x: -20 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ 
                duration: 0.5,
                delay: 0.3 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }"
            >
              <a
                :href="item.href"
                class="group flex cursor-pointer items-center py-3"
                :aria-current="item.id === currentSection ? 'page' : undefined"
                @click.prevent="scrollToSection(item.id)"
              >
                <span
                  :class="[
                    'mr-4 h-px transition-all duration-300 group-hover:w-16 group-hover:bg-white group-focus-visible:w-16 group-focus-visible:bg-white motion-reduce:transition-none',
                    item.id === currentSection ? 'w-16 bg-white' : 'w-8 bg-slate-600'
                  ]"
                ></span>
                <span
                  :class="[
                    'text-sm font-semibold uppercase transition-colors duration-300 group-hover:text-slate-200 group-focus-visible:text-slate-200',
                    item.id === currentSection ? 'text-slate-200' : 'text-slate-500'
                  ]"
                >
                  {{ item.label }}
                </span>
              </a>
            </motion.li>
          </ul>
        </nav>

      </div>
      <motion.ul 
        class="mt-10 flex items-center gap-5 text-sm text-slate-400" 
        aria-label="Social media"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ 
          duration: 0.6,
          delay: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }"
      >
        <motion.li 
          v-for="(link, index) in socialLinks" 
          :key="link.label"
          :initial="{ opacity: 0, scale: 0.8 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ 
            duration: 0.4,
            delay: 0.9 + index * 0.05,
            ease: [0.22, 1, 0.36, 1]
          }"
        >
          <UTooltip
            arrow
            :delay-duration="0"
            :text="link.tooltip ?? link.label"
          >
            <motion.a
              :whileHover="{ scale: 1.2, rotate: 5 }"
              :whilePress="{ scale: 0.85 }"
              :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
              @click="executeSocialClick(link.href, link.label)"
              class="flex cursor-pointer items-center justify-center transition-colors duration-200 hover:text-white focus-visible:text-white"
            >
              <UIcon :name="link.icon" class="h-5 w-5 sm:h-6 sm:w-6" />
              <span class="sr-only">{{ link.label }}</span>
            </motion.a>
          </UTooltip>
        </motion.li>
      </motion.ul>
    </header>

    <!-- Content Panel -->
    <main
      ref="rightSide"
      class="relative z-10 w-full flex-1 bg-transparent lg:w-[54%] lg:overflow-y-auto"
    >
      <div class="px-6 py-12 sm:px-12 lg:px-16 lg:py-24">
        <motion.section 
          id="about" 
          class="scroll-mt-24 text-left"
          :initial="!isSafari ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }"
          :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
          :transition="!isSafari ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }"
          :inViewOptions="!isSafari ? { once: true, amount: 0.3 } : { once: true }"
        >
          <motion.h2 
            class="text-sm font-semibold uppercase text-white/80"
            :initial="!isSafari ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }"
            :whileInView="!isSafari ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.2 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            ABOUT
          </motion.h2>
          <motion.p 
            class="mt-4 text-pretty text-base leading-relaxed text-slate-300"
            :initial="!isSafari ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }"
            :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.3 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            I'm an <strong class="font-semibold text-white">aspiring student</strong> with the goal of standing out in <strong class="font-semibold text-white">computer science</strong>, keen to build <strong class="font-semibold text-white">creative solutions</strong> regardless of unique constraints. My favorite part of the work lies in efficiency and user interaction; I aim to create performant yet elegant systems for evolving problems.
          </motion.p>
          <motion.p 
            class="mt-4 text-pretty text-base leading-relaxed text-slate-300"
            :initial="!isSafari ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }"
            :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.4 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            Currently, I'm a student at <strong class="font-semibold text-white">METU D.F. Private School Ankara</strong>. Most of my studies focus on improving my skills in <strong class="font-semibold text-white">computer science and software engineering</strong>.
          </motion.p>
          <motion.p 
            class="mt-4 text-pretty text-base leading-relaxed text-slate-300"
            :initial="!isSafari ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }"
            :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.5 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            My software development experience spans remarkably <strong class="font-semibold text-white">diverse environments</strong>, from the focused autonomy of working remotely at the top of the Alps to the collaborative and structured setting of a leading electronics design company. This contrast has equipped me with a <strong class="font-semibold text-white">versatile skill set</strong> and the ability to thrive in any work culture. I frequently leverage my reputation as the school's primary technical troubleshooter to design and implement IT infrastructure for multiple student organizations.
          </motion.p>
          <motion.div 
            class="mt-6"
            :initial="!isSafari ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }"
            :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.6 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            <motion.a
              @click="async () => {await navigateTo('https://docs.google.com/document/d/101nZjssknWJN8Hzj-dGkIo488KDSQYsji54a1PD7qGQ/edit?tab=t.0', { external: true, open: { target: '_blank', }, })}"
              class="inline-flex items-center text-base font-medium text-white transition-colors duration-200 hover:text-slate-200 cursor-pointer group"
              :whileHover="{ x: 5 }"
              :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
            >
              View Resume
              <span class="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </motion.a>
          </motion.div>
        </motion.section>


        <motion.section 
          id="experience" 
          class="mt-20 scroll-mt-24 text-left"
          :initial="!isSafari ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }"
          :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
          :transition="!isSafari ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }"
          :inViewOptions="!isSafari ? { once: true, amount: 0.2 } : { once: true }"
        >
          <motion.h2 
            class="text-sm font-semibold uppercase text-white/80"
            :initial="!isSafari ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }"
            :whileInView="!isSafari ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.2 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            EXPERIENCE
          </motion.h2>
          <div class="mt-8 space-y-12 border-l border-white/10 pl-6">
            <motion.article 
              v-for="(role, index) in experience" 
              :key="role.company" 
              class="space-y-2"
              :initial="!isSafari ? { opacity: 0, x: -30 } : { opacity: 1, x: 0 }"
              :whileInView="!isSafari ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }"
              :transition="!isSafari ? { 
                duration: 0.5, 
                delay: 0.3 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              } : { duration: 0 }"
              :inViewOptions="!isSafari ? { once: true, amount: 0.5 } : { once: true }"
            >
              <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 class="text-lg font-semibold text-white">{{ role.company }}</h3>
                <span class="text-xs uppercase text-slate-500">{{ role.period }}</span>
              </div>
              <p class="text-base font-medium text-slate-200">{{ role.title }}</p>
              <p class="text-pretty text-base leading-relaxed text-slate-400">{{ role.summary }}</p>
            </motion.article>
          </div>
        </motion.section>

        <section 
          id="projects" 
          class="mt-20 scroll-mt-24 text-left"
        >
          <h2 
            class="text-sm font-semibold uppercase text-white/80"
          >
            PROJECTS
          </h2>
          <div class="mt-10 grid grid-cols-1 gap-10">
            <motion.article
              v-for="(project, index) in projects"
              :key="project.name"
              @click="async () => {await navigateTo(project.href, { external: true, open: { target: '_blank', }, })}"
              class="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
              :whileHover="{ 
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 17 }
              }"
              :whilePress="{ scale: 0.98 }"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">{{ project.name }}</h3>
                <span class="text-xs uppercase text-white/70">{{ project.year }}</span>
              </div>
              <p class="mt-4 text-pretty text-base leading-relaxed text-slate-300">{{ project.description }}</p>
              <a
                class="mt-4 inline-flex items-center text-sm font-medium text-white transition-colors duration-200 hover:text-slate-200 cursor-pointer"
                target="_blank"
                rel="noreferrer noopener"
              >
                View project
                <span class="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </motion.article>
          </div>
        </section>

        <motion.section 
          id="credentials" 
          class="mt-20 scroll-mt-24 text-left"
          :initial="!isSafari ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }"
          :whileInView="!isSafari ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
          :transition="!isSafari ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }"
          :inViewOptions="!isSafari ? { once: true, amount: 0.2 } : { once: true }"
        >
          <motion.h2 
            class="text-sm font-semibold uppercase text-white/80"
            :initial="!isSafari ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }"
            :whileInView="!isSafari ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }"
            :transition="!isSafari ? { duration: 0.5, delay: 0.2 } : { duration: 0 }"
            :inViewOptions="!isSafari ? { once: true } : { once: true }"
          >
            CREDENTIALS
          </motion.h2>
          <div class="mt-8 space-y-12 border-l border-white/10 pl-6">
            <motion.article 
              v-for="(credential, index) in credentials" 
              :key="credential.name" 
              class="group space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              tabindex="0"
              :class="{'cursor-pointer hover:cursor-pointer': !!credential.image || !!credential.href}"
              :initial="!isSafari ? { opacity: 0, x: -30 } : { opacity: 1, x: 0 }"
              :whileInView="!isSafari ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }"
              :whileHover="{ scale: 1.01 }"
              :transition="!isSafari ? { 
                duration: 0.4, 
                delay: 0.15 + index * 0.05,
                ease: [0.22, 1, 0.36, 1]
              } : { duration: 0 }"
              :inViewOptions="!isSafari ? { once: true, amount: 0.5 } : { once: true }"
            >
              <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 class="text-lg font-semibold text-white">{{ credential.name }}</h3>
                <span class="text-xs uppercase text-slate-400">{{ credential.issued }}</span>
              </div>
              <p class="text-base font-medium text-slate-300">{{ credential.organizationLabel }}: {{ credential.organization }}</p>
              <div class="mt-3 flex flex-wrap gap-3">
                <motion.button
                  v-if="credential.image"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/50 hover:bg-white/15 hover:text-white hover:cursor-pointer cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  :whileHover="{ x: 4 }"
                  :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
                  @click.stop="showCredentialPreview(credential.image, credential.name)"
                >
                  View credential
                  <span aria-hidden="true">↗</span>
                </motion.button>
                <motion.button
                  v-else-if="credential.href"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white hover:cursor-pointer cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  :whileHover="{ x: 4 }"
                  :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
                  @click.stop="openCredential(credential.href)"
                >
                  View credential
                  <span aria-hidden="true">↗</span>
                </motion.button>
              </div>
            </motion.article>
          </div>
        </motion.section>

        <section class="mt-16 flex flex-col items-center gap-2 text-center">
          <NuxtImg
            src="/signature_derin.png"
            alt="Derin Alan Ritter signature"
            class="h-14 w-auto opacity-90 invert brightness-0"
            draggable="false"
            loading="lazy"
          />
          <p class="text-sm font-medium text-slate-300">
            Copyright © {{ currentYear }} — Made by Derin Alan Ritter
          </p>
          <p class="text-sm font-medium text-slate-300">
            Time (UTC +3): <span class="text-white">{{ currentTimeUtc3 }}</span>
          </p>
          <a
            href="https://derinaritter.com"
            class="text-sm font-semibold text-white transition-colors duration-200 hover:text-slate-200"
            target="_blank"
            rel="noreferrer noopener"
          >
            https://derinaritter.com
          </a>
        </section>

        <AnimatePresence>
          <Teleport to="body">
            <motion.div
              v-if="showCredentialModal"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0 }"
              @click.self="closeCredentialPreview"
            >
              <motion.div
                class="relative w-[92vw] max-w-3xl rounded-2xl border border-white/15 bg-zinc-900/90 p-4 shadow-2xl"
                role="dialog"
                aria-modal="true"
                :aria-label="selectedCredentialTitle || 'Credential preview'"
                :initial="{ scale: 0.95, opacity: 0, y: 10 }"
                :animate="{ scale: 1, opacity: 1, y: 0 }"
                :exit="{ scale: 0.97, opacity: 0, y: 4 }"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <h3 class="text-lg font-semibold text-white">{{ selectedCredentialTitle }}</h3>
                  <button
                    type="button"
                    class="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-semibold text-white/90 transition-colors duration-200 hover:border-white/50 hover:text-white hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"
                    @click="closeCredentialPreview"
                  >
                    Close
                  </button>
                </div>
                <div class="relative overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <NuxtImg
                    v-if="selectedCredentialImage"
                    :src="selectedCredentialImage"
                    :alt="selectedCredentialTitle || 'Credential preview'"
                    class="block max-h-[70vh] w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </motion.div>
          </Teleport>
        </AnimatePresence>
      </div>
    </main>
  </div>
  </div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence, useScroll, useSpring } from 'motion-v'

const toast = useToast()

useHead({
  title: 'Derin Alan Ritter'
})

const rightSide = ref<HTMLElement | null>(null)
const cursorLight = ref<HTMLElement | null>(null)
const isDesktop = ref(false)
const isSafari = ref(false)
const showCredentialModal = ref(false)
const selectedCredentialImage = ref('')
const selectedCredentialTitle = ref('')
const currentTimeUtc3 = ref('')
const currentYear = new Date().getFullYear()

// Scroll progress tracking
const { scrollYProgress } = useScroll()
const scrollProgress = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
})

let mediaQuery: MediaQueryList | null = null
let mediaQueryChangeHandler: ((event: MediaQueryListEvent) => void) | null = null
let timeInterval: number | null = null


const sectionIds = ['about', 'experience', 'projects', 'credentials'] as const
type SectionId = (typeof sectionIds)[number]

const navItems: Array<{ id: SectionId; label: string; href: string }> = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'credentials', label: 'Credentials', href: '#credentials' }
]

const currentSection = ref<SectionId>('about')
let sectionElements: Record<SectionId, HTMLElement | null> = {
  about: null,
  experience: null,
  projects: null,
  credentials: null
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/kxser', icon: 'i-simple-icons-github', tooltip: 'GitHub' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/d-alan-ritter-441403348/', icon: 'i-simple-icons-linkedin', tooltip: 'LinkedIn' },
  { label: 'Email', href: 'derinaritter@protonmail.ch', icon: 'i-simple-icons-maildotru', tooltip: 'derinaritter@protonmail.ch' },
  { label: 'Instagram', href: 'https://www.instagram.com/derinnritter/', icon: 'i-simple-icons-instagram', tooltip: 'Instagram' },
  { label: 'BTC', href: 'bc1qt4rsgxh4r82xxkkkntt5regrs06m5vhx2zelq6', icon: 'i-cryptocurrency-btc', tooltip: 'BTC Wallet' },
  { label: 'ETH', href: '0x38d423Ddb091A89934Efa9528D9125DD93aB2d6f', icon: 'i-cryptocurrency-eth', tooltip: 'ETH Wallet' },
]
async function executeSocialClick(href: string, label: string) {
  console.log(href, label)
  if (href.includes("http")) {
    await navigateTo(href, { external: true, open: { target: '_blank', }, })
  } else if (label === "Email") {
    navigator.clipboard.writeText(href)
    toast.add({
    title: `Copied ${label} to clipboard.`,
    color: 'neutral',
    description: href,
    icon: 'i-material-symbols-content-copy'
  })
    
} else {
  // Copy crypto address to clipboard
  navigator.clipboard.writeText(href)
    toast.add({
    title: `Copied ${label} address to clipboard.`,
    color: 'neutral',
    description: href.length > 10 ? `${href.slice(0, 5)}...${href.slice(-5)}` : href,
    icon: 'i-material-symbols-content-copy'
  })
  }}

const openCredential = async (href?: string) => {
  if (!href) {
    return
  }

  await navigateTo(href, { external: true, open: { target: '_blank' } })
}

const showCredentialPreview = (image?: string, title?: string) => {
  if (!image) {
    return
  }

  selectedCredentialImage.value = image
  selectedCredentialTitle.value = title ?? 'Credential preview'
  showCredentialModal.value = true
}

const closeCredentialPreview = () => {
  showCredentialModal.value = false
  nextTick(() => {
    selectedCredentialImage.value = ''
  })
}

const updateUtc3Time = () => {
  const now = new Date()
  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000
  const target = new Date(utcMillis + 3 * 60 * 60 * 1000)
  currentTimeUtc3.value = target.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const experience = [
  {
    company: 'The College Chronicle',
    title: 'Co-Founder & Chief Technical Officer (CTO)',
    period: 'Present',
    summary:
      'Co-Founder, CTO & Editor. Spearheaded breakaway newspaper branch. Built its entire digital infrastructure, website & directed editorial content.'
  },
  {
    company: 'Metu College M.U.N.',
    title: 'Director General & Head of I.T.',
    period: '2022 — Present',
    summary:
      'Responsible for managing, developing, and deploying the I.T. infrastructure for a 300-person M.U.N. conference while continuing my role in general management.'
  },
  {
    company: 'METU College Entrepreneurship Club',
    title: 'Lead Software Engineer',
    period: '2022 — 2022',
    summary:
      "Developed a bespoke website for the club's entry into the national GencBizz competition."
  },
  {
    company: 'RK Media',
    title: 'Co-founder',
    period: '2023-2024',
    summary:
      'Built responsive marketing sites, advertising prototypes, and web applications for various creators and communities.'
  },
    {
    company: 'MEGART Technology',
    title: 'Internship',
    period: '2023 — 2023',
    summary:
      "Collaborated and gained insightful experience at a leading electronics design company."
  },
      {
    company: 'Cartesian Robotics #8561',
    title: 'Minor Technical Contributor',
    period: '2022 — 2022',
    summary:
      "Developed the fastest AprilTag recognition algorithm for use in the regional FRC Robotics Competition."
  },
]

type Credential = {
  name: string
  organization: string
  organizationLabel: string
  issued: string
  href?: string
  image?: string
}

const credentials: Credential[] = [
  {
    name: 'Private Anatolian High School Diploma',
    organization: 'METU D.F. Private Anatolian High School',
    organizationLabel: 'Institution',
    issued: 'Expected: June 2026',
    href: ''
  },
  {
    name: 'SAT',
    organization: 'College Board',
    organizationLabel: 'Organization',
    issued: 'Issued: See credential',
    href: '/credentials/redacted_sat.jpg',
    image: '/credentials/redacted_sat.jpg'
  },
  {
    name: 'IELTS Academic',
    organization: 'IELTS',
    organizationLabel: 'Organization',
    issued: 'Issued: See credential',
    href: '/credentials/redacted_ielts.jpg',
    image: '/credentials/redacted_ielts.jpg'
  },
  {
    name: 'Linux for Developers',
    organization: 'The Linux Foundation, CID: 2HLEN6G2U4OZ',
    organizationLabel: 'Organization',
    issued: 'Issued: Jul 2025',
    href: 'https://www.coursera.org/account/accomplishments/verify/2HLEN6G2U4OZ'
  },
  {
    name: 'Open Source Software Development Methods',
    organization: 'The Linux Foundation, CID: V8482ZLYJ10A',
    organizationLabel: 'Organization',
    issued: 'Issued: Jul 2025',
    href: 'https://www.coursera.org/account/accomplishments/verify/V8482ZLYJ10A'
  }
]

const projects = [
  {
    name: 'Qwen3-SexismDetect',
    year: '2025',
    description:
      'Fine-tuned Qwen3-4B LLM model with custom training data to excel both in speed and performance at detecting sexism. Reduced costs and inference time significantly compared to generalized models.',
    href: 'https://huggingface.co/derinaritter/qwen3-4B-sexismdetect/tree/main'
  },
  {
    name: 'A* Pathfinding Visualizer',
    year: '2025',
    description:
      'An interactive pathfinding algorithm visualizer meant to demonstrate how A* search pathfinding works.',
    href: 'https://derinaritter.com/astar'
  },
  {
    name: 'TEDxODTUGVO Youth Website',
    year: '2025',
    description:
      'Due to my background while being a keynote speaker for TEDxODTUGVO Youth, I was commisioned to build a website for the event that adheres to required standards.',
    href: 'https://tedxodtugvo.org'
  },
  {
    name: 'The College Chronicle',
    year: '2025',
    description:
      'Digital school journal/newspaper platform. Built complete infrastructure and website for breakaway newspaper branch.',
    href: 'https://thecollegechronicle.org'
  },
  {
    name: 'MCMUN Website',
    year: '2025',
    description:
      'Sustainable, low-cost website for the METU College Model United Nations conference, built with Nuxt 4.',
    href: 'https://metucollegemun.org'
  },
  {
    name: 'NuxtAuth',
    year: '2025',
    description:
      'A fully self-contained authentication framework to be used as a starting point for Nuxt 4 applications. It requires no backend services and is perfect for small applications.',
    href: 'https://github.com/kxser/nuxtauth'
  },
    {
    name: 'Arrow Cursor Follow',
    year: '2025',
    description:
      'Lightweight demonstration that renders an arrow array element that smoothly rotates and points toward (or chases) the  mouse / pointer position. Similar to a magnetic filing effect.',
    href: 'https://github.com/kxser/arrow-cursor-follow'
  },
]



const scrollToSection = (id: SectionId) => {
  const target = sectionElements[id] ?? document.getElementById(id)
  if (!target) {
    return
  }

  sectionElements[id] = target

  if (process.client && isDesktop.value && rightSide.value) {
    rightSide.value.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
  } else if (process.client) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  // currentSection updated via observer
}

const handleWheel = (event: WheelEvent) => {
  if (isDesktop.value && rightSide.value) {
    // Allow native scrolling when hovering over the content
    if (rightSide.value.contains(event.target as Node)) {
      return
    }

    event.preventDefault()
    rightSide.value.scrollTop += event.deltaY
  }
}

let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        currentSection.value = entry.target.id as SectionId
      }
    })
  }, {
    root: null,
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  })

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
}

onMounted(() => {
  sectionIds.forEach((id) => {
    sectionElements[id] = document.getElementById(id)
  })

  if (process.client) {
    // Detect Safari
    isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    
    mediaQuery = window.matchMedia('(min-width: 1024px)')
    isDesktop.value = mediaQuery.matches
    
    // Mouse positioning optimization
    let ticking = false
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
          ticking = false
        })
        ticking = true
      }
    })

    mediaQueryChangeHandler = (event: MediaQueryListEvent) => {
      isDesktop.value = event.matches
    }

    mediaQuery.addEventListener('change', mediaQueryChangeHandler)

    updateUtc3Time()
    timeInterval = window.setInterval(updateUtc3Time, 1000)
    
    initObserver()
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    if (mediaQuery && mediaQueryChangeHandler) {
      mediaQuery.removeEventListener('change', mediaQueryChangeHandler)
    }

    if (timeInterval) {
      clearInterval(timeInterval)
    }
    
    if (observer) {
      observer.disconnect()
    }
  }
})
</script>

