<template>
  <my-dialog
    :title="$t('connections.cleanHistoryData')"
    :visible.sync="showDialog"
    class="clean-data"
    width="450px"
    @confirm="cleanData"
    @close="resetData"
  >
    <i class="el-icon-warning"></i>{{ $t('settings.cleanHistoryDialogMessage') }}
  </my-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { cleanHistoryData } from '@/utils/api/setting'
import MyDialog from './MyDialog.vue'

@Component({
  components: {
    MyDialog,
  },
})
export default class ClearUpHistoryData extends Vue {
  @Prop({ default: false }) public visible!: boolean

  private showDialog: boolean = this.visible

  @Watch('visible')
  private onVisibleChanged(val: boolean) {
    this.showDialog = val
  }

  private async cleanData() {
    cleanHistoryData()
    this.$message.success(this.$tc('connections.cleanHistorySuccess'))
    this.resetData()
  }

  private resetData() {
    this.showDialog = false
    this.$emit('update:visible', false)
  }
}
</script>

<style lang="scss">
.clean-data {
  .el-icon-warning {
    color: var(--color-main-yellow);
    margin-right: 5px;
    font-size: 20px;
  }
  .el-dialog__body {
    padding-bottom: 0px;
    word-break: normal;
    color: var(--color-text-default);
  }
}
</style>
