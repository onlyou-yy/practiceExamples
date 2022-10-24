const {createApp} = Vue;

const listData = []
for(let i = 0; i < 100000; i++){
  listData.push(i)
}

createApp({
  data(){
    return {
      listData,
      screenHeight:800,
      itemSize:40,
      start:0,
      end:10,
      startOffset:0
    }
  },
  computed:{
    listHeight(){
      return this.listData.length * this.itemSize
    },
    visibleCount(){
      return Math.ceil(this.screenHeight / this.itemSize)
    },
    getTransform(){
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    visibleData(){
      return this.listData.slice(this.start,Math.min(this.end,this.listData.length));
    }
  },
  mounted(){
    // this.screenHeight = this.$el.clientHeight;
    this.start = 0; 
    this.end = this.start + this.visibleCount;
  },
  methods:{
    scrollEvent(e){
      let scrollTop = this.$refs.list.scrollTop;
      this.start = Math.floor(scrollTop/this.itemSize)
      this.end = this.start + this.visibleCount;
      this.startOffset = scrollTop;
    }
  }
}).mount("#app")