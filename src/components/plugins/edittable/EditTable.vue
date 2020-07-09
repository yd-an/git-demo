<template>
  <div class="el-table-container">
    <div>
      <div style="padding: 8px 0 8px 0;float: right;margin-top: -40px">
        <el-upload
          v-if="showImportButton"
          style="display: inline; margin-left: 10px;margin-right: 10px;"
          action="#"
          name="fileUpload"
          :show-file-list="false"
          :http-request="upLoadChange"
          :before-upload="beforeUploadFunction==null?beforeUpload:beforeUploadFunction"
        >
          <el-button type="primary" size="small">
            <i class="el-icon-upload2"></i>
            {{importButtonText}}
          </el-button>
        </el-upload>
        <el-button type="primary" @click="download" v-if="showDownLoadButton" size="small">
          <i class="el-icon-download"></i>
          {{downLoadButtonText}}
        </el-button>
        <form id="downDocForm" method="post" enctype="multipart/form-data">
          <input type="hidden" name="docName" id="docName" />
          <input type="hidden" name="fieldNames" id="fieldNames" />
          <input type="hidden" name="valueLists" id="valueLists" />
        </form>
      </div>
      <el-table
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        ref="etable"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableData1"
        :border="border"
        :stripe="stripe"
        :height="height"
        :max-height="maxHeight"
        :fit="fit"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :current-row-key="currentRowKey"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :row-key="rowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :show-summary="showSummary"
        :sum-text="sumText"
        :size="size"
        :summary-method="summaryMethod"
        @sort-change="sortChange"
      >
        <el-table-column v-if="no" type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column
          v-for="column in columns"
          :column-key="column.columnKey"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :minWidth="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :header-align="headerAlign || column.align"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
          :key="column.label"
        >
          <template slot-scope="scope">
            <span style="width:100%;" v-if="column.type=='select'&& (column.dataSource ==undefined || column.dataSource!='dynamic')" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                style="width:100%"
                :no-data-text="column.noDataText==undefined?'无数据':column.noDataText"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="column.disabled==undefined?false:column.disabled"
                @change="column.onchange?column.onchange(scope.row):false"
                @visible-change="column.visibleChange?column.visibleChange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select'&& column.dataSource && column.dataSource=='dynamic'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="column.disabled==undefined?false:column.disabled"
              >
                <el-option-group
                  v-for="group in column.source(scope.row)"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="(item,index) in group.options"
                    :key="index"
                    :value="item[column.props.value]"
                    :label="item[column.props.label]"
                  ></el-option>
                </el-option-group>
              </el-select>
            </span>
            <span v-else-if="column.type=='select_dynamic'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                style="width:100%"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @change="column.onchange?column.onchange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select_edit_no_create'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                filterable
                style="width:100%"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @change="column.onchange?column.onchange(scope.row):false"
                @visible-change="column.visibleChange?column.visibleChange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='select_edit_no_create2'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                filterable
                style="width:100%"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
              >
                <el-option
                  v-for="(item,index) in scope.row.options"
                  :key="`prod-${index}`"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span style="width:100%;" v-else-if="column.type=='select_edit'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                allow-create
                style="width:100%"
                filterable
                :no-data-text="column.noDataText==undefined?'无数据':column.noDataText"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @visible-change="column.visibleChange?column.visibleChange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in column.source"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
              <span v-else-if="column.type=='select_remote'" :row="scope.row">
              <el-select
                v-model="scope.row[column.prop]"
                size="small"
                filterable
                clearable
                remote
                style="width:100%"
                :placeholder="column.placeholder"
                :loading="column.loading"
                :remote-method="column.remoteMethod"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                @visible-change="activeItem($event,scope)"
                @change="column.onchange?column.onchange(scope.row):false"
              >
                <el-option
                  v-for="(item,index) in scope.row.options"
                  :key="index"
                  :value="item[column.props.value]"
                  :label="item[column.props.label]"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="column.type=='text'" style="display:inline-flex width:100%">
              <el-input
                v-model="scope.row[column.prop]"
                v-if="column.showError"
                :class="scope.row.showError?'has-error':''"
                :placeholder="column.placeholder"
                size="small"
                style="width:100%"
                :disabled="column.disabled==undefined?false:column.disabled"
                @change="column.onchange?column.onchange(scope.row):false"
              >
                <template
                  slot="append"
                  v-if="column.suffix&&column.showSuffixMethod && column.showSuffixMethod(scope.row)"
                >%</template>
              </el-input>
              <el-input
                v-model="scope.row[column.prop]"
                v-else
                clearable
                style="width:100%"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :placeholder="column.placeholder"
                size="small"
                :disabled="column.disabled==undefined?false:column.disabled"
                @blur="column.onblur?column.onblur($event,scope.row):false"
                @clear="column.onblur?column.onblur($event,scope.row):false"
                @change="column.onchange?column.onchange(scope.row):false"
              >
                <template
                  slot="append"
                  v-if="column.suffix&&column.showSuffixMethod && column.showSuffixMethod(scope.row)"
                >%</template>
              </el-input>
              <div
                v-if="scope.row.isToolTip && column.prop== 'paramAliasName' "
                style="left:60px ;top:10px"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="'queryflag'字段用来描述应用表中是否查得了匹配的数据"
                  placement="right"
                >
                  <el-button type="text">
                    <i class="el-icon-question"></i>
                  </el-button>
                </el-tooltip>
              </div>
            </span>
            <span v-else-if="column.type=='text_dynamic'">
              <el-input
                v-model="scope.row[column.prop]"
                :class="validate1(scope.row[column.prop],column.rule,scope.row)?'':'has-error'"
                :placeholder="column.placeholder"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
              ></el-input>
            </span>
            <!--xugr add at 2019-04-03 根据该行某列值决定是否disable，compareColunm：比较的列，compareValue：比较的值-->
            <span v-else-if="column.type=='text_row_calc'">
              <el-input
                v-model="scope.row[column.prop]"
                :placeholder="column.placeholder"
                size="small"
                :disabled="scope.row[column.compareColunm]==column.compareValue"
              ></el-input>
            </span>
            <span v-else-if="column.type=='cmd'">
              <span v-for="(cmd,index) in column.cmds" :key="index">
                <el-button
                  v-if="cmd.rel=='del'"
                  size="small"
                  :type="cmd.type"
                  @click="delRow(scope.row)"
                  :class="cmd.class"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                >{{cmd.label}}</el-button>
                <el-button
                  v-else-if="cmd.cmd"
                  size="small"
                  :type="cmd.type"
                  @click="cmd.cmd(scope.row)"
                  :class="cmd.class"
                >{{cmd.label}}</el-button>
              </span>
            </span>
            <div v-else-if="column.type=='cmd_circle'" style="text-align: center;padding-top: 3px">
              <span v-for="(cmd,index) in column.cmds" :key="index">
                <img
                  v-if="cmd.rel=='add'"
                  src="../../../assets/image/welcome/icon/add.png"
                  style="width: 20px;height: 20px;cursor:pointer"
                  @click="addRow(scope.row)"
                  :class="cmd.class"
                  :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"
                />
                <img
                  v-if="cmd.rel=='del'&&scope.row[cmd.disabled]==undefined?true:scope.row[cmd.disabled]"
                  src="../../../assets/image/welcome/icon/reduce.png"
                  style="width: 20px;height: 20px;cursor:pointer;margin-left: 10px;"
                  @click="delRow(scope.row)"
                  :class="cmd.class"
                />
              </span>
            </div>
            <!--yangjing235 add at 2020-01-14 新增/删除事件调用cmd配置的事件-->
            <div v-else-if="column.type=='cmd_circle_cmdEvent'" style="text-align: center;padding-top: 3px">
              <span v-for="(cmd, index) in column.cmds" :key="index">
                <img v-if="cmd.rel=='add'" src="../../../assets/image/welcome/icon/add.png"
                     style="width: 20px;height: 20px;cursor:pointer" @click="cmd.cmd(scope.row)"
                     :class="cmd.class"
                     :disabled="scope.row[cmd.disabled]==undefined?false:scope.row[cmd.disabled]"/>
                <img v-if="cmd.rel=='del'&&scope.row[cmd.disabled]==undefined?true:scope.row[cmd.disabled]"
                     src="../../../assets/image/welcome/icon/reduce.png"
                     style="width: 20px;height: 20px;cursor:pointer;margin-left: 10px;" @click="cmd.cmd(scope.row)"
                     :class="cmd.class">
              </span>
            </div>
            <span v-else-if="column.type=='cascader'">
              <div class="block">
                <el-cascader
                  expand-trigger="hover"
                  clearable
                  size="small"
                  :placeholder="column.placeholder"
                  :options="column.source"
                  :props="column.props"
                  v-model="scope.row[column.prop]"
                  v-if="column.onchange"
                  @change="column.onchange"
                ></el-cascader>
                <el-cascader
                  expand-trigger="hover"
                  clearable
                  size="small"
                  :placeholder="column.placeholder"
                  :options="column.source"
                  :props="column.props"
                  v-model="scope.row[column.prop]"
                  v-else
                ></el-cascader>
              </div>
            </span>
            <span v-else-if="column.type=='checkbox'">
              <el-checkbox
                v-model="scope.row[column.prop]"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                v-if="column.onchange"
                @change="column.onchange(scope.row)"
              ></el-checkbox>
              <el-checkbox
                v-model="scope.row[column.prop]"
                size="small"
                :disabled="scope.row[column.disabled]==undefined?false:scope.row[column.disabled]"
                v-else
              ></el-checkbox>

              <el-tooltip
                v-if="column.btn!==undefined&&column.btn.checkMergeStatus!==undefined&&column.btn.checkMergeStatus(scope.row)"
                placement="right"
                effect="light"
                style="width: 100%"
              >
                <div slot="content">
                  <el-table
                    :data="column.btn.showInfo(scope.row)"
                    style="width: 100%"
                    max-height="400"
                    border
                  >
                    <el-table-column prop="paramName" label="参数名"></el-table-column>
                    <el-table-column prop="paramCnName" label="参数中文名"></el-table-column>
                    <el-table-column prop="serviceName" label="所属的服务" width="200"></el-table-column>
                  </el-table>
                </div>

                <el-button
                  v-if="column.btn!==undefined&&column.btn.checkMergeStatus!==undefined&&column.btn.checkMergeStatus(scope.row)"
                  size="small"
                  :type="column.btn.type"
                  @click="column.btn.cmd(scope.row)"
                  :class="column.btn.class"
                >{{column.btn.label}}</el-button>
              </el-tooltip>
            </span>
            <span v-else>
              {{ column.prop==='table$index'?(scope.$index+1):(column.render ? column.render(scope.row) :scope.row[column.prop])}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import XLSX from "xlsx";

export default {
  name: "etable",
  data() {
    return {
      defaultRow: { id: -1, delStatus: 0, insert: 1 },
    };
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    no: {
      type: Boolean,
      default: false
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    buttonText: {
      type: String,
      default: "+条件设置"
    },
    showImportButton: {
      type: Boolean,
      default: false
    },
    importButtonText: {
      type: String,
      default: "导入数据"
    },
    showDownLoadButton: {
      type: Boolean,
      default: false
    },
    downLoadButtonText: {
      type: String,
      default: "模板下载"
    },
    beforeUploadFunction: {
      type: Function,
      default: null
    },
    editMode: {
      type: Boolean,
      default: true
    },
    // Element UI Table attributes
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    fromAddTable: { type: Boolean, default: true },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    headerAlign: {
      type: String,
      default: "center"
    },
    size: {
      type: String,
      default: "small"
    },
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    rowClassName: [String, Function],
    rowStyle: [String, Function],
    rowKey: [String, Function],
    emptyText: String,
    defaultExpandAll: Boolean,
    expandRowKeys: Array,
    defaultSort: Object,
    tooltipEffect: String,
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function
  },
  computed: {
    tableData1: function() {
      this.$emit("refreshTableDatas", this.tableData);
      return this.tableData.where(0, "delStatus");
    }
  },
  methods: {
    activeItem(event, scope) {
      if(event){
        this.$emit('activeIndex',scope.$index)
      }
    },
    addRow() {
      var rowCopy = $.extend(true, {}, this.defaultRow);
      this.tableData.push(rowCopy);
      this.$emit("addRowData", rowCopy);
    },
    delRow: function(row) {
      if ((row.delStatus === 0 || row.delStatus === "0" || row.delStatus === "") && row.id !== -1) {
        row.delStatus = 1;
      } else {
        this.tableData.removeAt(row.srcIndex);
      }
      if (this.tableData.length === 0) {
        this.tableData.push(this.defaultRow);
      }
    },
    refreshColumns(value) {
      this.columns = value;
      var row = { id: -1, delStatus: 0, insert: 1 };

      $.each(this.columns, function(i, column) {
        if (column.type === "select" || column.type === "select_dynamic") {
          if (column.source instanceof Function) {
          } else if (column.source.length > 0) {
            row[column.prop] = column.source[0][column.props.value];
          } else {
            row[column.prop] = "";
          }

          // 初始化附加bool属性
          if (column.attachBoolField) {
            row[column.attachBoolField] = !!column.attachDefBoolVal;
          }
        } else if (column.type === "cascader") {
          row[column.prop] = [];
        } else {
          if (column.prop && column.prop !== "") {
            row[column.prop] = "";
          }
        }
      });
      this.defaultRow = row;
      if (!this.editMode && this.tableData.length === 0) {
        var rowCopy = $.extend(true, {}, row);
        this.tableData.push(rowCopy);
      }
    },
    selChange(belongProdCode){

    },
    sortChange(sortOption) {
      var prop = sortOption.prop;
      var order =
        sortOption.order === "descending" ? "descending" : "ascending";
      if (this.tableData.length > 0 && prop && prop !== "") {
        this.tableData = this.tableData
          .slice()
          .sort(this.compareFunction(prop, order));
      }
    },
    compareFunction(propertyName, order) {
      return function(obj1, obj2) {
        var val1 = obj1[propertyName];
        var val2 = obj2[propertyName];
        if (order === "ascending") {
          return val1.localeCompare(val2, "zh") > 0 ? 1 : -1;
        } else if (order === "descending") {
          return val1.localeCompare(val2, "zh") > 0 ? -1 : 1;
        } else {
          return 0;
        }
      };
    },
    validate: function(callback) {
      let flag = true;
      let _this = this;
      this.tableData1.forEach(row => {
        _this.columns.forEach(column => {
          if (!_this.validate1(row[column.prop], column.rule, row)) {
            flag = false;
          }
          // if (row[column.prop] == '' && column.rule) {
          //   flag = false;
          //   return;
          // }
        });
      });
      if (callback) {
        callback(flag);
      }
    },
    length: function(str, length) {
      var total = 0;
      var charCode;
      var i;
      var len;
      if (str === undefined || str == null) {
        return true;
      }
      return str.length <= length;
    },
    empty: function(v) {
      return !v === undefined || v === "" || v == null;
    },
    email: function(str) {
      if (str.length === 0) {
        return true;
      }
      var myRegExp = /[a-z0-9-.]{1,30}@[a-z0-9-]{1,65}.(com|net|org|info|biz|([a-z]{2,3}.[a-z]{2}))/;
      return myRegExp.test(str);
    },

    int: function(str) {
      if (str.length === 0) {
        return true;
      }
      var pattern = /^0$|^[1-9]\d*$/; // 匹配非负整数
      return pattern.test(str);
    },
    english: function(str) {
      if (str.length === 0) {
        return true;
      }
      var pattern = /^([a-zA-z_]{1})([\w]*)$/g; // 匹配非负整数
      return pattern.test(str);
    },

    decimal: function(str) {
      var _this = this;
      if (_this.int(str)) return true;
      var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
      if (re.test(str)) {
        if (RegExp.$1 === 0 && RegExp.$2 === 0) return false;
        return true;
      }
      return false;
    },
    // YYYY-MM-DD
    date: function(str) {
      var _this = this;
      if (_this.isnull(str)) return true;
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
      return reg.test(str);
    },

    // YYYY-MM-DD hh:mm:ss
    dateTime: function(str) {
      var _this = this;
      if (_this.isnull(str)) return true;
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      return reg.test(str);
    },

    minitue: function(str) {
      var _this = this;
      if (_this.isnull(str)) return true;
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
      return reg.test(str);
    },

    // 判断日期类型是否为hh:mm:ss格式的类型
    time: function(str) {
      var _this = this;
      if (_this.isnull(str)) return true;
      let reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
      return reg.test(str);
    },
    validate1: function(val, rule, rowData) {
      var antiSQLInjReg2 = /^(select|update|create|alter|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%|--)$/;
      if (antiSQLInjReg2.test(val)) {
        this.$message.error(
          "名称中不能只包含(select|update|create|alter|delete|truncate|join|union|exec|insert|drop|count|'|\"|;|>|<|%|--)"
        );
        return false;
      }
      // 如果没有rule,则不用校验，直接返回
      if (!rule) {
        return true;
      }
      var flag = true;
      var _this = this;
      flag = flag && !(rule && rule.notEmpty && _this.empty(val));
      if (!_this.empty(val)) {
        switch (rule.dataType) {
          case "decimal":
            flag = flag && _this.decimal(val);
            break;
          case "int":
            flag = flag && _this.int(val);
            break;
          case "email":
            flag = flag && _this.email(val);
            break;
          case "datetime":
            var format = rule.format ? rule.format : "YYYY-MM-DD";
            if (format === "YYYY-MM-DD hh:mm:ss") {
              flag = flag && _this.dateTime(val);
            } else if (format === "hh:mm:ss") {
              flag = flag && _this.time(val);
            } else if (format === "YYYY-MM-DD hh:mm") {
              flag = flag && _this.IsDateWithMinitue(val);
            } else flag = flag && _this.date(val);
            break;
        }
        // 正则表达式匹配 by 吴章鹏 on 20190327
        if (rule.pattern) {
          flag = flag && rule.pattern.test(val);
        } // 如果符合正则匹配表达式，则置为true
      }
      if (flag) {
        if (rule.callback) {
          flag = rule.callback(val, rowData);
        }
      }

      return flag;
    },

    // 导入数据相关
    beforeUpload(file) {
      const isCsv =
        file.name.toLowerCase().indexOf(".xls") > -1 ||
        file.name.toLowerCase().indexOf(".xlsx") > -1;
      if (!isCsv) {
        this.$message.error("只能上传xls或xlsx格式的文件!");
        return false;
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("文件大小不能超过1MB!");
      }
      return isCsv && isLt1M;
    },
    upLoadChange(content) {
      var _this = this;
      var files = content.file;
      var fileReader = new FileReader(); // new一个FileReader实例
      if (typeof FileReader === "undefined") {
        alert("你的浏览器暂不支持该功能");
        return;
      }
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          let wsname = workbook.SheetNames[0]; // 取第一张表
          let tableDatas = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
          if (_this.fromAddTable) {
            // 如果是新建应用表来的，则删除第一个没有用的数据。
            _this.tableData = [];
          }
          tableDatas.forEach(data => {
            var obj = { dataStatus: 2 };
            obj["insert"] = true;
            $.each(_this.columns, function(i, column) {
              if (data[column["excelLabel"]]) {
                var regex = new RegExp("^[0-9]$");
                if (regex.test(data[column["excelLabel"]])) {
                  obj[column.prop] = parseInt(data[column["excelLabel"]]);
                } else {
                  obj[column.prop] = data[column["excelLabel"]];
                }
              }
            });
            _this.tableData.push(obj);
          });
        } catch (e) {
          this.$message.warning("解析excel!数据为空" + e.toString());
          return false;
        }
      };
      fileReader.readAsBinaryString(files);
    },
    download() {
      this.$emit("download");
    }
  },
  mounted() {
    if (
      this.tableData.length > 0 &&
      this.defaultSort &&
      this.defaultSort.prop &&
      this.defaultSort.prop !== ""
    ) {
      this.sortChange(this.defaultSort);
    }
    if (this.columns && this.columns.length > 0) {
      this.refreshColumns(this.columns);
    }
  },
  watch: {
    columns: function(value) {
      this.refreshColumns(value);
    }
  }
};
</script>

<style scoped>
.meticulous-creation-second-div {
  background-image: linear-gradient(225deg, #5d6eff 0%, #4d92ff 100%);
}
</style>
