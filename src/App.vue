<script setup>
import ImageSlider from '@/components/imageSlider/ImageSlider.vue'
import { onMounted, reactive } from 'vue'
import { getImages } from '@/api'

onMounted(() => {
  getImages().then((data) => {
    for (const elem of data) {
      sliderContent.push(elem)
    }
  })
})

const sliderContent = reactive([])
</script>

<template>
  <div class="app-wrapper">
    <image-slider :image-list="sliderContent" />
  </div>
</template>
