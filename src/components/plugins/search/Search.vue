<template>
  <el-form
    :model="params"
    :class="inline?'':'search-box'"
    :inline="inline"
    ref="form"
    @submit.native.prevent="searchHandler()"
    size="small"
    :label-width="labelWidth ? (labelWidth + 'px') : ''"
  >
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :class="inline?'':'search-box-item'"
      :prop="form.itemType != 'daterange' ? form.prop : (datePrefix + index)"
      :label="form.label"
      :rules="form.rules || []"
      :label-width="form.labelWidth ? (form.labelWidth + 'px') : ''"
    >
      <el-input
        v-if="form.itemType === 'input' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        :size="form.size ? form.size : size"
        :readonly="form.readonly"
        :disabled="form.disabled"
        :placeholder="form.placeholder"
        :autofocus="form.autofocus"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        @keyup.enter.native="searchHandler"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        clearable
      />
      <el-autocomplete
        v-if="form.itemType === 'autocomplete'"
        v-model="params[form.modelValue]"
        :placeholder="form.placeholder"
        :autofocus="form.autofocus"
        @keyup.enter.native="searchHandler"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :trigger-on-focus="form.triggerOnFocus"
        :fetch-suggestions="form.querySearch"
        @select="item=>handleSelect(item,form.prop)"
      ></el-autocomplete>
      <el-checkbox
        v-if="form.itemType === 'checkbox'"
        @change="searchHandler"
        v-model="params[form.modelValue]"
        :checked="form.checked"
        :disabled="form.disabled"
        :suffix-icon="form.suffixIcon"
        :prefix-icon="form.prefixIcon"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
      >{{form.placeholder}}</el-checkbox>
      <el-select
        v-else-if="form.itemType === 'select'"
        filterable
        v-model="params[form.modelValue]"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        clearable
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
        <el-option
          v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
          :key="opIndex + '_remote'"
          :value="(typeof op === 'object') ? op[form.valueKey || 'value'] : op"
          :label="(typeof op === 'object') ? op[form.labelKey || 'label'] : op"
        />
      </el-select>
      <el-select
        v-else-if="form.itemType === 'select2-1'"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :size="form.size ? form.size : size"
        filterable
        clearable
        @clear="defaultOnClear(form.onClear)"
        v-model="params[form.modelValue]"
        :disabled="form.disabled"
        @visible-change="defaultSelectChange($event,form.visibleChangeVal)"
        @change="form.selChangeVal"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
      </el-select>
      <el-select
        v-else-if="form.itemType === 'select2-2'"
        filterable
        v-model="params[form.modelValue]"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        clearable
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option"
        />
      </el-select>
      <el-radio-group
        v-else-if="form.itemType === 'radio'"
        v-model="params[form.modelValue]"
        :disabled="form.disabled"
        @change="searchHandler"
      >
        <el-radio
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio>
      </el-radio-group>
      <el-radio-group
        v-else-if="form.itemType === 'radio-button'"
        v-model="params[form.modelValue]"
        :disabled="form.disabled"
        @change="searchHandler"
      >
        <el-radio-button
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :label="option.value"
        >{{option.label}}</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-else-if="form.itemType === 'date'"
        v-model="params[form.modelValue]"
        type="date"
        :placeholder="form.placeholder"
        value-format="yyyy-MM-dd HH:mm:ss"
        :size="form.size ? form.size : size"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :picker-options="form.pickerOptions || {}"
      />
      <el-date-picker
        v-else-if="form.itemType === 'daterange'"
        v-model="params[form.modelValue]"
        :size="form.size ? form.size : size"
        type="daterange"
        @change="date => changeDate(date, form.prop[0], form.prop[1])"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :picker-options="form.pickerOptions || {}"
      />
      <el-date-picker
        v-else-if="form.itemType === 'datetimerange'"
        v-model="params[form.modelValue]"
        :size="form.size ? form.size : size"
        type="datetimerange"
        @change="changeDatetime(params[form.modelValue], form.paramVal[0], form.paramVal[1])"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :placeholder="form.placeholder"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :picker-options="form.pickerOptions || {}"
      />
      <!-- 范围时间 -->
      <!-- <lump-time
      v-else-if="form.itemType === 'lumpTime'"
      ref="lumpTime"
      :timeObject="form"
      @searchHandler="searchHandler"
      /> -->
      <span v-else-if="form.itemType=='cascader'">
        <div class="block">
          <el-cascader
            expand-trigger="hover"
            clearable
            :placeholder="form.placeholder"
            :props="form.props"
            :options="selectOptions[cascaderPrefix + index]"
            v-model="params[form.modelValue]"
            @change="form.onchange"
            :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
          ></el-cascader>
        </div>
      </span>
    </el-form-item>
    <el-form-item label v-if="inline">
      <el-button
        type="primary"
        :size="size"
        @click="searchHandler"
        :loading="submitLoading"
      >{{ submitBtnText }}</el-button>
      <el-button
        type="primary"
        :plain="true"
        :size="size"
        v-if="showResetBtn"
        @click="resetForm"
        :loading="submitLoading"
      >{{ resetBtnText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import LumpTime from '@/components/common/LumpTime'; // 范围选择日期组件 xingjiarui 2020-04-10

function sizeValidator(value) {
  const methodTypes = ['large', 'small', 'mini'];
  const valid = methodTypes.indexOf(value.toLowerCase()) !== -1 || value === '';
  if (!valid) {
    throw new Error('Size must be one of [\'large\', \'small\', \'mini\']');
  }
  return valid;
}

export default {
  name: 'jsearch',
  components: {
    // LumpTime,
  },
  props: {
    size: {
      type: String,
      default: 'small',
      validator: sizeValidator,
    },
    showResetBtn: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: true,
    },
    fuzzy: {
      type: Boolean,
      default: false,
    },
    labelWidth: Number,
    itemWidth: Number,
    submitHandler: Function,
    beforeSearch: Function,
    submitLoading: {
      type: Boolean,
      default: false,
    },
    submitBtnText: {
      type: String,
      default: '查询',
    },
    resetBtnText: {
      type: String,
      default: '重置',
    },
    forms: {
      type: Array,
      required: true,
    },
  },
  data() {
    const { forms, fuzzy } = this.$props;
    const datePrefix = 'daterange-prefix';
    const selectOptionPrefix = 'select-option-prefix';
    const cascaderPrefix = 'cascader-prefix';
    const dataObj = {
      selectOptions: {},
    };
    const params = {};
    const format = {};
    const fuzzyOps = {};
    forms.forEach((v, i) => {
      const propType = typeof v.prop;
      if (propType === 'string') {
        v.modelValue = v.prop;
        params[v.prop] = '';
        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy;
        if (v.format) {
          format[v.prop] = v.format;
        }
        if (v.defaultValue !== undefined) {
          params[v.prop] = v.defaultValue;
        }
      } else if (
        propType === 'object'
        && Object.prototype.toString.call(v.prop) === '[object Array]'
      ) {
        v.prop.forEach((vv) => {
          params[vv] = '';
          if (v.format) {
            format[vv] = v.format;
          }
          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy;
        });
      }
      if (v.itemType === 'daterange') {
        params[datePrefix + i] = '';
        v.modelValue = datePrefix + i;
      }
      if (v.itemType === 'datetimerange') {
        if (v.defaultValue !== undefined) {
          // params[v.prop] = v.defaultValue; // 以前方法  初始化需要用到startTime endTime
          // 初始化需要用到startTime endTime 改成这种写法 xingjiarui 2020-04-02
          v.defaultValue ? params[v.paramVal[0]] = v.defaultValue[0] : params[v.paramVal[0]] = '';
          v.defaultValue ? params[v.paramVal[1]] = v.defaultValue[1] : params[v.paramVal[1]] = '';
        }
      }
      if (v.itemType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        this.getRemoteData(
          v.selectUrl,
          v.selectParams,
          v.selectResultField,
          v.selectResultHandler,
          dataKey,
        );
      }
      if (v.itemType === 'cascader' && (v.selectFetch || v.selectUrl)) {
        params[v.prop] = [];
        const dataKey = cascaderPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        this.getRemoteData(
          v.selectUrl,
          v.selectParams,
          v.selectResultField,
          v.selectResultHandler,
          dataKey,
        );
      }
    });
    return {
      params,
      datePrefix,
      selectOptionPrefix,
      cascaderPrefix,
      ...dataObj,
      format,
      fuzzyOps,
    };
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this;
      if (itemWidth) {
        return `width: ${itemWidth}px;`;
      }
      return '';
    },
  },
  methods: {
    isArray(value) {
      return (
        typeof value === 'object'
        && Object.prototype.toString.call(value) === '[object Array]'
      );
    },
    searchHandler() {
      if (this.beforeSearch) {
        this.beforeSearch();
      }
      this.getParams((error, params) => {
        if (!error) {
          const { submitHandler } = this;
          if (submitHandler) {
            submitHandler(params);
          } else {
            throw new Error('Need to set attribute: submitHandler !');
          }
        }
      });
    },
    defaultSelectChange(event, changeVal) {
      if (event) {
        changeVal();
      }
    },
    defaultOnClear(clearFun) {
      const _this = this;
      _this.forms.forEach((v) => {
        if (v.itemType === 'select2-2') {
          _this.params[v.prop] = '';
        }
      });
      clearFun();
    },
    selChange() {
      const _this = this;
      _this.forms.forEach((v) => {
        if (v.itemType === 'select2-2') {
          _this.params[v.prop] = '';
        }
      });
    },
    getParamFuzzy() {
      return this.fuzzyOps;
    },
    getParams(callback) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { params, datePrefix, format } = this;
          const formattedForm = {};
          Object.keys(params).forEach((v) => {
            if (v.indexOf(datePrefix) === -1) {
              formattedForm[v] = format[v]
                ? format[v](params[v], v)
                : params[v];
            }
            // 处理范围选择时间中的startTime endTime xingjiarui 2020-04-10
            // if (v === 'lumpTime') {
            //   const range = this.$refs.lumpTime[0].times;
            //   range ? formattedForm.startTime = range[0] : formattedForm.startTime = '';
            //   range ? formattedForm.endTime = range[1] : formattedForm.endTime = '';
            //   delete formattedForm[v];
            // }
          });
          if (callback) callback(null, formattedForm);
        } else if (callback) callback(new Error());
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    changeDatetime(range, startDate, endDate) {
      range ? this.params[startDate] = range[0] : this.params[startDate] = '';
      range ? this.params[endDate] = range[1] : this.params[endDate] = '';
    },
    changeDate(date, startDate, endDate) {
      let dates;
      if (date === null) {
        this.params[startDate] = '';
        this.params[endDate] = '';
        return;
      }
      if (typeof date === 'string') {
        dates = date.split(' - ');
      } else if (date && date.hasOwnProperty('length')) {
        const firstDate = date[0];
        const secondDate = date[1];
        dates = [
          `${firstDate.getFullYear()}-${(
            `0${
              firstDate.getMonth() + 1}`
          ).substr(-2)}-${(`0${firstDate.getDate()}`).substr(-2)}`,
          `${secondDate.getFullYear()}-${(
            `0${
              secondDate.getMonth() + 1}`
          ).substr(-2)}-${(`0${secondDate.getDate()}`).substr(-2)}`,
        ];
      }
      this.params[startDate] = dates[0];
      this.params[endDate] = dates[1];
    },
    getRemoteData(url, param, listField, resultHandler, dataKey) {
      const _this = this;
      this.$api.post(url, param, null).then((res) => {
        let result = res;
        if (res && !(res instanceof Array)) {
          if (listField && listField.indexOf('.') > 0) {
            listField.split('.').forEach((vv) => {
              result = result[vv];
            });
          } else {
            result = res[listField];
          }
        }
        if (!result || !(result instanceof Array)) {
          console.warn(
            `The result of key:${listField} is not Array. 接口返回的字段:${listField} 不是一个数组`,
          );
        }
        _this.selectOptions[dataKey] = result;
      });
    },
    handleSelect(item, prop) {
      this.params[prop] = item;
    },
  },
};
</script>

<style lang="scss" scope>
.lump-time {
  position: fixed;
  right: 20px;
  top: 14px;
  .time-checkout {
      display: flex;
  }
  .el-radio-button__inner {
    width: 60px;
    height: 32px;
  }
  .el-date-editor {
    margin-left: 10px;
  }
}
</style>
<style scope>
.el-time-panel {
  left: -34px;
}
</style>
