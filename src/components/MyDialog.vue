<template>
  <el-dialog
    class="my-dialog"
    v-bind="$props"
    :close-on-click-modal="false"
    @open="open"
    @close="close"
    @keyup.enter.native="handleEnterEvent"
  >
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel" type="text" size="small" @click="hideDialog">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        class="confirm-button"
        type="text"
        :loading="confirmLoading"
        :disabled="btnDisabled"
        @click="confirmClick"
        >{{ confirmBtnText === '' ? $t('common.confirm') : confirmBtnText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class MyDialog extends Vue {
  // The title name to display
  @Prop({ required: true }) public title!: string
  // The width of the dialog
  @Prop({ default: '560px' }) public width!: string
  // Show dialog
  @Prop({ default: false }) public visible!: boolean
  // Confirm button loading
  @Prop({ default: false }) public confirmLoading!: boolean
  // Dialog confirm button text
  @Prop({ default: '' }) public confirmBtnText!: string
  // Confirm button disabled status
  @Prop({ default: false }) public btnDisabled!: boolean
  // Dialog margin-top value
  @Prop({ default: '15vh' }) public top!: string

  private showDialog: boolean = this.visible

  @Watch('visible')
  private onVisibleChanged(val: boolean) {
    this.showDialog = val
  }

  private confirmClick() {
    // Confirm event
    this.$emit('confirm')
  }
  private open() {
    // Open the dialog event
    this.$emit('open')
  }
  private close() {
    this.$emit('update:visible', false)
    // Close the dialog event
    this.$emit('close')
  }
  private hideDialog() {
    // Hide the Dialog event
    this.$emit('update:visible', false)
  }
  private handleEnterEvent() {
    // Trigger enter event
    this.$emit('keyupEnter')
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/variable.scss';

.my-dialog {
  .el-dialog--center .el-dialog__body {
    padding: 32px 24px 0;
  }
  .el-dialog__footer {
    text-align: right !important;
    padding: 10px 24px;
    .el-button--text {
      font-size: 14px;
      color: var(--color-text-default);
      &:hover {
        color: var(--color-main-green);
      }
    }
    .confirm-button {
      margin-left: 24px;
      color: var(--color-main-green);
      &:hover {
        color: var(--color-minor-green);
      }
    }
    .el-button.is-loading:before {
      background-color: transparent;
    }
  }
}
</style>
