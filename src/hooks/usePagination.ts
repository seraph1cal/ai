import { ref } from 'vue';
//使用方法 对于表格的分页配置  pagInfo作为请求参数  setTotal 用来设置分页总数
//sizeChange  currentChange  在使用的地方这样调用sizeChange($event,API)  API为表格请求的接口
export function usePagination(num: number = 1, size: number = 10) {
  let pagInfo = ref({
    total: 0,
    pageNum: num,
    pageSize: size
  });
  function setTotal(val: number): void {
    pagInfo.value.total = val;
  }
  function sizeChange(val: number, funApi: Function) {
    pagInfo.value.pageSize = val;
    funApi();
  }
  function currentChange(val: number, funApi: Function) {
    pagInfo.value.pageNum = val;
    funApi();
  }
  return { pagInfo, sizeChange, setTotal, currentChange };
}
