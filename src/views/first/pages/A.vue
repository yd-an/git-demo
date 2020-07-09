<template>
  <div>
    <!-- jtable表格 -->
      <jtable
        ref="jtableListRef"
        class="jtable-list"
        type="remote"
        :url="url"
        :columns="columns"
        :form-options="formOptions"
        :check="true" :no="false"
        :showBtn="true"
        :saveParams="true"
        @selection-change="selectionTable"
        @getParams="getParams"
      ></jtable>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      contentTotal: '',
      url: '/rules/by/page', // 主页表格部分
      formOptions: {
        submitBtnText: '查询',
        forms: [
          // 0
          {
            prop: 'likeKey',
            label: '',
            itemType: 'input',
            placeholder: '请输入规则名称/报警规则',
            itemWidth: 200,
          },
          {
            prop: 'applicationCode',
            itemType: 'select2-2',
            placeholder: '请选择应用名称',
            itemWidth: 150,
            options: [],
            defaultValue: '',
          },
          {
            prop: 'alarmStatus',
            itemType: 'select',
            placeholder: '请选择状态',
            itemWidth: 150,
            options: [],
          },
          {
            prop: 'times',
            modelValue: 'times',
            itemType: 'datetimerange',
            placeholder: '请选择范围时间',
            itemWidth: 350,
            defaultValue: [],
            paramVal: ['startTime', 'endTime'],
          },
        ],
      },
      columns: [
        {
          prop: 'applicationName',
          label: '应用名称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 70,
        },
        {
          prop: 'ruleName',
          label: '规则名称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 70,
          links: [
            {
              type: 1,
              class: 'b-blue',
              click: this.handleView,
            },
          ],
        },
        {
          prop: 'errorTypeName',
          label: '错误类型',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 90,
        },
        {
          prop: 'alarmRule',
          label: '预警时机/报警规则',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 130,
        },
        {
          prop: 'membersInfo',
          label: '通知对象',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 140,
          renderTable: (h, { row }) => {
            const arr = row.membersInfo.slice(1);
            return (
              <span>
                <span onClick={() => { this.handleViewDialog(row.membersInfo[0], row); }} style={'ont-size:12px;cursor: pointer;color: #0766FF;'}>
                  {row.membersInfo[0] && row.membersInfo[0].memberName}
                </span>
                {
                  arr.length !== 0 ? <el-dropdown trigger="click" style={'font-size:12px;cursor: pointer;color: #0766FF;'} onCommand={(command) => this.handleViewDialog(command, row)}>
                    <span class="el-dropdown-link" >
                      ，更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      {
                        arr.map(item => {
                          return <el-dropdown-item command={item}>{item.memberName}</el-dropdown-item>;
                        })
                      }
                    </el-dropdown-menu>
                  </el-dropdown> : ''
                }
              </span>
            );
          },
        },
        {
          prop: 'alarmStatus',
          label: '状态',
          showOverflowTooltip: true,
          minWidth: 60,
          align: 'center',
          render: row => {
            return row.alarmStatus === 1 ? '已启用' : '已禁用';
          },
        },
        {
          prop: 'createdTime',
          label: '创建时间',
          showOverflowTooltip: true,
          minWidth: 140,
          align: 'center',
        },
        {
          label: '操作',
          prop: '',
          minWidth: 230,
          align: 'center',
          cmds: [
            {
              type: 'text',
              class: 'b-width',
              cmd: this.isForbidden,
              transferKey: 'alarmStatus',
              transfer: 1,
              transferLabel: {
                1: '禁用',
                2: '启用',
              },
              disableMethod: this.isEditDisabled,
            },
          ],
        },
      ],
    };
  },
  created() {
    this.getAlertsNum();
  },
  methods: {
    // 获取报警评分

    async getAlertsNum() {
      console.log('aaaaaaa');
      const param = {
        applicationCode: '1',
        processed: '2',
      };
      const res = await this.$api.post('/content/summary/program/today', param);
      if (res) {
        console.log(res);
        this.contentTotal = res.rspData.contentTotal;
      }
    },
    // 选择列表行
    selectionTable(val) {
      this.selectionList = val;
    },
    // 获取搜索条件
    getParams(val) {
      this.getStartAndStop(val);
    },
    // 查询启用禁用数量
    getStartAndStop(params) {
      this.$api.post('/rules/num', params.params)
        .then(res => {
          res.rspData.ruleTotal !== 0 ? this.alarmTotal = res.rspData : this.alarmTotal = {
            ruleTotal: 0,
            enableNum: 0,
            disableNum: 0,
          };
        });
    },
    // 是否禁用
    isForbidden(row) {
      if (row.alarmStatus === 1) {
        this.$confirm('确定禁用选择的报警规则？</br><span style="font-size:10px;color:#909399">禁用报警之后将收不到报警通知</span>', '禁用报警规则', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.toStartOrStop(row);
          })
          .catch(() => {
          });
      } else {
        this.$confirm('请确认是否启用？', '启用提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.toStartOrStop(row);
          })
          .catch(() => {
          });
      }
    },
  },
};
</script>
