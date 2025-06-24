<script setup>
const props = defineProps({
  textColor: {
    type: String,
    default: 'text-white'
  },
  bgColor: {
    type: String,
    default: 'bg-black'
  },
  hoverBgColor: {
    type: String,
    default: 'bg-gray-800'
  },
  fontSize: {
    type: String,
    default: 'text-base'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function onClick(event) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
      :class="[
      'px-5 py-3 lg:px-4 lg:py-2 font-semibold duration-300 rounded-2xl transition cursor-pointer',
      textColor,
      bgColor,
      fontSize,
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      !disabled ? `hover:${hoverBgColor}` : ''
    ]"
      @click="onClick"
      :disabled="disabled"
  >
    <slot>Buton</slot>
  </button>
</template>
