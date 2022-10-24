const {createApp} = Vue;
const Random = Mock.Random;

const listData = []
for(let i = 0; i < 1000; i++){
  listData.push((i + 1) + "." +Random.paragraph(1, 5))
  // listData.push(i)
}

createApp({
  data(){
    return {
      listData,
      screenHeight:667,
      estimatedItemSize:100,//预估高度
      bufferScale:1,
      positions:[],//每项的位置信息
      start:0,
      end:10,
      startOffset:0
    }
  },
  computed:{
    listHeight(){
      return this.positions[this.listData.length - 1].bottom;
    },
    visibleCount(){
      return Math.ceil(this.screenHeight / this.estimatedItemSize)
    },
    getTransform(){
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    visibleData(){
      let start = this.start - this.aboveCount;
      let end = this.end + this.belowCount;
      return this.listData.slice(start,end);
    },
    aboveCount(){
      return Math.min(this.start,this.bufferScale * this.visibleCount)
    },
    belowCount(){
      return Math.min(this.listData.length - this.end,this.bufferScale * this.visibleCount)
    }
  },
  created(){
    this.initPositions()
  },
  mounted(){
    this.screenHeight = this.$refs.list.clientHeight;
    this.start = 0; 
    this.end = this.start + this.visibleCount;
  },
  updated() {
    this.$nextTick(()=>{
      let nodes = this.$refs.items;
      nodes.forEach(node => {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height
        let dValue = oldHeight - height;
        if(dValue){
          this.positions[index].height = height;
          this.positions[index].bottom = this.positions[index].bottom - dValue;
          for(let k = index + 1;k < this.positions.length;k++){
            this.positions[k].top = this.positions[k - 1].bottom;
            this.positions[k].bottom = this.positions[k].bottom - dValue;
          }
        }
      })
      this.setStartOffset(); 
    });
  },
  methods:{
    getStartIndex(scrollTop = 0){
      return this.binarySearch(this.positions,scrollTop);
    },
    binarySearch(list,value){
      let start = 0;
      let end = list.length - 1;
      let tempIndex = null;
      while(start <= end){
        let midIndex = parseInt((start + end) / 2);
        let midValue = list[midIndex].bottom;
        if(midValue == value){
          return midIndex + 1;
        }else if(midValue < value){
          start = midIndex + 1;
        }else if(midValue > value){
          if(tempIndex === null || tempIndex > midIndex){
            tempIndex = midIndex
          }
          end = end - 1;
        }
      }
      return tempIndex;
    },
    initPositions(){
      this.positions = this.listData.map((m,index) => {
        return {
          index,
          height:this.estimatedItemSize,
          top:index * this.estimatedItemSize,
          bottom:(index + 1) * this.estimatedItemSize,
        }
      })
    },
    scrollEvent(e){
      let scrollTop = this.$refs.list.scrollTop;
      this.start = this.getStartIndex(scrollTop);
      this.end = this.start + this.visibleCount;
      this.setStartOffset();
    },
    setStartOffset(){
      if(this.start >= 1){
        let size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0);
        this.startOffset = this.positions[this.start - 1].bottom - size;
      }else{
        this.startOffset = 0;
      }
    }
  }
}).mount("#app")