<template>
  <UApp>
  <div
    class="relative flex min-h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-slate-100 lg:h-screen lg:flex-row"
    @wheel="handleWheel"
    @mousemove="handleMouseMove"
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
        <h2 class="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl"></h2>
        <p class="mt-4 max-w-xs text-base leading-relaxed text-slate-300">
          Always outnumbered, never outgunned

        </p>

        <div
          class="mt-6 pointer-events-none w-28 max-w-[55%] opacity-75"
          aria-hidden="true"
        >
          <div class="signature-mask" role="presentation"></div>
        </div>

        <nav aria-label="Section links" class="mt-10 lg:hidden">
          <ul class="flex flex-wrap gap-3">
            <li v-for="item in navItems" :key="item.label">
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
            </li>
          </ul>
        </nav>

        <nav aria-label="Section links" class="hidden lg:block">
          <ul class="mt-16 w-max">
            <li v-for="item in navItems" :key="item.label">
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
            </li>
          </ul>
        </nav>

      </div>
      <ul class="mt-10 flex items-center gap-5 text-sm text-slate-400" aria-label="Social media">
        <li v-for="link in socialLinks" :key="link.label">
          <UTooltip
            arrow
            :delay-duration="0"
            :text="link.tooltip ?? link.label"
          >
            <motion.a
              :whileHover="{ scale: 1.2 }"
              :whilePress="{ scale: 0.85 }"
              @click="executeSocialClick(link.href, link.label)"
              class="flex cursor-pointer items-center justify-center transition-colors duration-200 hover:text-white focus-visible:text-white"
            >
              <UIcon :name="link.icon" class="h-5 w-5 sm:h-6 sm:w-6" />
              <span class="sr-only">{{ link.label }}</span>
            </motion.a>
          </UTooltip>
        </li>
      </ul>
    </header>

    <!-- Content Panel -->
    <main
      ref="rightSide"
      class="relative z-10 w-full flex-1 bg-transparent lg:w-[54%] lg:overflow-y-auto"
    >
      <div class="px-6 py-12 sm:px-12 lg:px-16 lg:py-24">
        <section id="about" class="scroll-mt-24 text-left">
          <h2 class="text-sm font-semibold uppercase text-white/80">ABOUT</h2>
          <p class="mt-4 text-pretty text-base leading-relaxed text-slate-300">
            I'm an <strong class="font-semibold text-white">aspiring student</strong> with the goal of standing out in <strong class="font-semibold text-white">computer science</strong>, keen to build <strong class="font-semibold text-white">creative solutions</strong> regardless of unique constraints. My favorite part of the work lies in efficiency and user interaction; I aim to create performant yet elegant systems for evolving problems.
          </p>
          <p class="mt-4 text-pretty text-base leading-relaxed text-slate-300">
            Currently, I'm a student at <strong class="font-semibold text-white">METU D.F. Private School Ankara</strong>. Most of my studies focus on improving my skills in <strong class="font-semibold text-white">computer science and software engineering</strong>.
          </p>
          <p class="mt-4 text-pretty text-base leading-relaxed text-slate-300">
            My software development experience spans remarkably <strong class="font-semibold text-white">diverse environments</strong>, from the focused autonomy of working remotely at the top of the Alps to the collaborative and structured setting of a leading electronics design company. This contrast has equipped me with a <strong class="font-semibold text-white">versatile skill set</strong> and the ability to thrive in any work culture.
          </p>
          <div class="mt-6">
            <a
              @click="async () => {await navigateTo('https://docs.google.com/document/d/101nZjssknWJN8Hzj-dGkIo488KDSQYsji54a1PD7qGQ/edit?tab=t.0', { external: true, open: { target: '_blank', }, })}"
              class="inline-flex items-center text-base font-medium text-white transition-colors duration-200 hover:text-slate-200 cursor-pointer"
            >
              View Resume
              <span class="ml-2 transition-transform duration-200 hover:translate-x-1">→</span>
            </a>
          </div>
        </section>


        <section id="experience" class="mt-20 scroll-mt-24 text-left">
          <h2 class="text-sm font-semibold uppercase text-white/80">EXPERIENCE</h2>
          <div class="mt-8 space-y-12 border-l border-white/10 pl-6">
            <article v-for="role in experience" :key="role.company" class="space-y-2">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 class="text-lg font-semibold text-white">{{ role.company }}</h3>
                <span class="text-xs uppercase text-slate-500">{{ role.period }}</span>
              </div>
              <p class="text-base font-medium text-slate-200">{{ role.title }}</p>
              <p class="text-pretty text-base leading-relaxed text-slate-400">{{ role.summary }}</p>
            </article>
          </div>
        </section>

        <section id="projects" class="mt-20 scroll-mt-24 text-left">
          <h2 class="text-sm font-semibold uppercase text-white/80">PROJECTS</h2>
          <div class="mt-10 grid grid-cols-1 gap-10">
            <article
              v-for="project in projects"
              :key="project.name"
              @click="async () => {await navigateTo(project.href, { external: true, open: { target: '_blank', }, })}"
              class="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
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
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
  </UApp>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const toast = useToast()

useHead({
  title: 'Derin Alan Ritter'
})

const rightSide = ref<HTMLElement | null>(null)
const cursorLight = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isDesktop = ref(false)

let mediaQuery: MediaQueryList | null = null
let mediaQueryChangeHandler: ((event: MediaQueryListEvent) => void) | null = null


const sectionIds = ['about', 'experience', 'projects'] as const
type SectionId = (typeof sectionIds)[number]

const navItems: Array<{ id: SectionId; label: string; href: string }> = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' }
]

const currentSection = ref<SectionId>('about')
let sectionElements: Record<SectionId, HTMLElement | null> = {
  about: null,
  experience: null,
  projects: null
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

const projects = [
  {
    name: 'Qwen3-SexismDetect',
    year: '2025',
    description:
      'Fine-tuned Qwen3-4B LLM model with custom training data to excel both in speed and performance at detecting sexism. Reduced costs and inference time significantly compared to generalized models.',
    href: 'https://huggingface.co/derinaritter/qwen3-4B-sexismdetect/tree/main'
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
    name: 'A* Pathfinding Visualizer',
    year: '2025',
    description:
      'An interactive pathfinding algorithm visualizer meant to demonstrate how A* search works.',
    href: 'https://kxser.github.io/astar-algorithm-demonstration/index.html'
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



const getSectionCenter = (element: HTMLElement) => {
  if (isDesktop.value && rightSide.value) {
    return element.offsetTop + element.offsetHeight / 2
  }

  return element.getBoundingClientRect().top + window.scrollY + element.offsetHeight / 2
}

const updateCurrentSection = () => {
  if (!process.client) {
    return
  }

  let closestSection: SectionId = currentSection.value
  let smallestDistance = Number.POSITIVE_INFINITY

  const scrollPosition = isDesktop.value && rightSide.value ? rightSide.value.scrollTop : window.scrollY
  const viewportCenter = isDesktop.value && rightSide.value
    ? scrollPosition + rightSide.value.clientHeight / 2
    : scrollPosition + window.innerHeight / 2

  sectionIds.forEach((id) => {
    const element = sectionElements[id] ?? document.getElementById(id)
    if (!element) {
      return
    }

    sectionElements[id] = element
    const sectionCenter = getSectionCenter(element)
    const distance = Math.abs(sectionCenter - viewportCenter)

    if (distance < smallestDistance) {
      smallestDistance = distance
      closestSection = id
    }
  })

  currentSection.value = closestSection
}

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

  currentSection.value = id
}

const handleWheel = (event: WheelEvent) => {
  if (isDesktop.value && rightSide.value) {
    event.preventDefault()
    rightSide.value.scrollTop += event.deltaY
    updateCurrentSection()
  }
}

const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

const handleScrollEvent = () => {
  updateCurrentSection()
}

const applyScrollListeners = (desktop: boolean) => {
  if (!process.client) {
    return
  }

  window.removeEventListener('scroll', handleScrollEvent)
  if (rightSide.value) {
    rightSide.value.removeEventListener('scroll', handleScrollEvent)
  }

  if (desktop && rightSide.value) {
    rightSide.value.addEventListener('scroll', handleScrollEvent, { passive: true })
  } else if (!desktop) {
    window.addEventListener('scroll', handleScrollEvent, { passive: true })
  }
}

onMounted(() => {
  sectionIds.forEach((id) => {
    sectionElements[id] = document.getElementById(id)
  })

  if (process.client) {
    mediaQuery = window.matchMedia('(min-width: 1024px)')
    isDesktop.value = mediaQuery.matches
    applyScrollListeners(isDesktop.value)

    mediaQueryChangeHandler = (event: MediaQueryListEvent) => {
      isDesktop.value = event.matches
      applyScrollListeners(event.matches)
      nextTick(() => updateCurrentSection())
    }

    mediaQuery.addEventListener('change', mediaQueryChangeHandler)
  }

  updateCurrentSection()
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScrollEvent)
    if (rightSide.value) {
      rightSide.value.removeEventListener('scroll', handleScrollEvent)
    }

    if (mediaQuery && mediaQueryChangeHandler) {
      mediaQuery.removeEventListener('change', mediaQueryChangeHandler)
    }
  }
})
</script>

