<template>
  <div class="carousel" ref="carousel">
    <div class="carousel__viewport" :style="`width: ${carouselViewportWidth}px`">
      <div
        v-for="(imageSrc, index) of equalSizeImagesList"
        :key="index"
        :class="[
          'carousel__item',
          {
            'carousel__item--selected': isSelected(imageSrc)
          }
        ]"
        @click="toggleSelection(imageSrc)"
      >
        <img :src="imageSrc" :alt="`picsum-img${index}`" />
      </div>
    </div>

    <!--Nav buttons-->
    <div class="carousel__nav">
      <button class="carousel__nav-button" @click="scrollCarousel('prev')">Prev</button>
      <button class="carousel__nav-button" @click="scrollCarousel('next')">Next</button>
    </div>

    <!--Info block-->
    <div v-if="selectedImagesSrcList.length">
      <h2 class="carousel__title">Selected items:</h2>
      <ul class="carousel__selected-items-list">
        <li
          v-for="(src, index) of selectedImagesSrcList"
          :key="`selectedItemsSrc${index}`"
          class="carousel__selected-items-list-item"
        >
          <a :href="src" target="_blank">
            {{ src }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, toRefs } from 'vue'
import { IMAGE_DIMENSIONS } from '@/components/imageSlider/constants'

const props = defineProps({
  imageList: {
    type: Array,
    required: true,
    default: () => []
  }
})
const { imageList } = toRefs(props)
const carousel = ref(null)
const visibleItemsAmount = ref(1)
const selectedImagesSrcList = ref([])
const equalSizeImagesList = computed(() =>
  imageList.value.map((imageData) =>
    setImgDimensions(imageData.download_url, IMAGE_DIMENSIONS.width, IMAGE_DIMENSIONS.height)
  )
)
const carouselViewportWidth = computed(() => {
  return visibleItemsAmount.value * (IMAGE_DIMENSIONS.width + 20)
})
const setImgDimensions = (
  imgSrc,
  width = IMAGE_DIMENSIONS.width,
  height = IMAGE_DIMENSIONS.height
) => {
  if (imgSrc) {
    if (typeof imgSrc === 'string') {
      const regex = /(\d+\/\d+)$/
      const replacement = `${width}/${height}`

      return imgSrc.replace(regex, replacement)
    }
  }
  return ''
}
const setVisibleItemsAmount = () => {
  const carouselWidth = carousel.value?.offsetWidth

  visibleItemsAmount.value = Math.floor(carouselWidth / (IMAGE_DIMENSIONS.width + 20))
}
const scrollCarousel = async (direction) => {
  const carouselViewport = carousel.value.querySelector('.carousel__viewport')
  const scrollAmount = IMAGE_DIMENSIONS.width + 20 // width + margin
  const totalItems = equalSizeImagesList.value.length

  const animateScroll = (targetScroll) => {
    return new Promise((resolve) => {
      carouselViewport.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
      setTimeout(() => resolve(), 500)
    })
  }

  if (direction === 'prev') {
    const currentScroll = carouselViewport.scrollLeft

    if (currentScroll <= 0) {
      await animateScroll((totalItems - visibleItemsAmount.value) * scrollAmount)
    } else {
      carouselViewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  } else if (direction === 'next') {
    const currentScroll = carouselViewport.scrollLeft
    const maxScroll = (totalItems - visibleItemsAmount.value) * scrollAmount

    if (currentScroll >= maxScroll) {
      await animateScroll(0)
    } else {
      carouselViewport.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }
}
const toggleSelection = (src) => {
  const index = selectedImagesSrcList.value.indexOf(src)

  if (index > -1) {
    selectedImagesSrcList.value.splice(index, 1)
  } else {
    selectedImagesSrcList.value.push(src)
  }
}
const isSelected = (src) => {
  return selectedImagesSrcList.value.includes(src)
}

onMounted(() => {
  setVisibleItemsAmount()
  window.addEventListener('resize', () => setVisibleItemsAmount())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleItemsAmount)
})
</script>

<style lang="scss" scoped>
.carousel {
  margin: 50px 0;
}

.carousel__viewport {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
  margin: 0 auto;
}

.carousel__item {
  margin: 0 10px;
  transition: 0.3s;
  cursor: pointer;
  &.carousel__item--selected {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.carousel__nav {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px;
}

.carousel__nav-button {
  padding: 5px 15px;
  font-size: 20px;
  border-radius: 5px;
  background-color: rgba(135, 206, 250, 1);
  transition: 0.3s;
  &:hover {
    background-color: rgba(135, 206, 250, 0.7);
  }
}

.carousel__title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
}

.carousel__selected-items-list {
  text-align: center;
  margin-top: 10px;
}
.carousel__selected-items-list-item {
  margin-bottom: 5px;
}
</style>
