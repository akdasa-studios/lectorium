import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTracksCountStore = defineStore('tracksCount', () =>{
  
  /* ------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const totalCount = ref<number>(0)

  /* -------------------------------------------------------------------------- */
  /*                                  Interface                                 */
  /* -------------------------------------------------------------------------- */

  return { totalCount }
})