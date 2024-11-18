<template>
  <v-sheet class="ma-2 pa-2">
    <v-card
        class="product"
    >
    <v-img
      v-if="props.productData.image"
      :src="props.productData.image"
      height="200px"
      cover
      />
      <v-img
      v-else
      src="https://via.placeholder.com/200?text=No+Image"
      height="200px"
      cover
      />


      <v-card-title>
        {{ props.productData.brand }}
      </v-card-title>

      <v-card-subtitle>
        $ {{ props.productData.price }}
      </v-card-subtitle>

      <v-card-text>
        {{ props.productData.description }}
      </v-card-text>

      <v-card-actions>
        <v-btn @click="goToProductPage(props.productData.id)">
          Add to cart
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: 'ProductItem',
  })
</script>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  const props = defineProps({
    productData: {
      type: Object,
      required: true,
    }
  })

  const emit = defineEmits(['item-clicked'])

  const goToProductPage = (productId: number) => {
  emit('item-clicked', productId);
};

</script>