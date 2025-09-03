<script setup lang="ts">
import { defineProps } from 'vue'

interface Card {
  icon?: string
  title: string
  details: string
  link?: string
  linkText?: string
}

defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div class="card-grid">
    <div v-for="(card, index) in cards" :key="index" class="card">
      <div class="card-content">
        <div v-if="card.icon" class="card-icon">{{ card.icon }}</div>
        <h3 class="card-title">{{ card.title }}</h3>
        <p class="card-details">{{ card.details }}</p>
      </div>
      <div v-if="card.link" class="card-action">
        <a :href="card.link">
          <strong>{{ card.linkText || '前往指南 →' }}</strong>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  overflow: hidden; /* Ensures content respects border-radius */
}

.card:hover {
  border-color: var(--vp-c-brand-1);
}

.card-content {
  padding: 24px;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.card-details {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

.card-action {
  border-top: 1px solid var(--vp-c-border);
  padding: 16px 24px;
  background-color: var(--vp-c-bg-mute);
  transition: background-color 0.25s;
}

.card:hover .card-action {
  background-color: var(--vp-c-bg-soft-up);
}

.card-action a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.25s;
}

.card-action a:hover {
  color: var(--vp-c-brand-2);
}
</style>
