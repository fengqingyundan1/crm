export default  {
    data(){
        return {
            tableData: {
                count: 0,
                page_number: 1,
                page_size: 2,
                sizes: [30, 50, 100, 200],
                loading: false,
                data: []               
            }     
        }
    },
    created() {
      this.searchButton()
    },
    methods: {
      // 预申明，防止报错
      searchButton() {},
      handleSizeChange(val) {
        this.searchButton()
      },
      handleCurrentChange(val) {
        this.searchButton()
      }
    }
}