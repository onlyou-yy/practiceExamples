const {createApp} = Vue;

const listData = []
for(let i = 0; i < 100000; i++){
  listData.push(i)
}

createApp({
  data(){
    return {
      listData,
      itemSize:40,
    }
  },
  computed:{
    listHeight(){
      return this.listData.length * this.itemSize
    },
    visibleCount(){
      return Math.ceil(screenHeight / this.itemSize)
    },
    getTransform(){
      return `translate`
    }
  },
}).mount("#app")