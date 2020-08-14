import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import styles from "./index.less";
import { Menu, ActivityIndicator, NavBar, Picker, List, Accordion } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react'
import { selectCountXsByXyAndZy,selectCountXsByNj,selectCountXsByMz, 
selectCountXsByZzmm,selectCountXsByXslb,selectCountXsBySyd,selectCountXsByTotalNumber,selectCountXsByXb
} from '@/services/api'

// 全局变量，传递信息给onOk
let ALLSCREENRES = [];
// 政治面貌人数统计模拟数据
// let mockPoliticsNum = [
//   {
//     identity: '党员',
//     num: 3421
//   },
//   {
//     identity: '群众',
//     num: 2202
//   },
//   {
//     identity: '废青',
//     num: 1202
//   },
//   {
//     identity: '无业游民',
//     num: 3831
//   }
// ]

// 年级人数统计模拟数据
// let mockGradeNum = [
//   {
//     grade: '2017级',
//     num: 20
//   },
//   {
//     grade: '2018级',
//     num: 30
//   },
//   {
//     grade: '2019级',
//     num: 6000
//   },

// ]

// 学生类别统计模拟数据
const studentTypeMockDetial = {
  title: '学生类别人数统计',
  num: 2342,
  detial: [
    {
      title: '本科',
      people: '1920',
    },
    {
      title: '博士',
      people: '20',
    },
    {
      title: '硕士',
      people: '230',
    },
    {
      title: '研究生',
      people: '130',
    }
  ]
}

// // 民族人数统计模拟数据
// const nationMockDetial = {
//   title: '民族人数统计',
//   num: 2342,
//   detial: [
//     {
//       title: '汉族',
//       people: '300',
//     },
//     {
//       title: '回族',
//       people: '420',
//     },
//     {
//       title: '满族',
//       people: '230',
//     },
//     {
//       title: '维吾尔族',
//       people: '10',
//     },
//     {
//       title: '苗族',
//       people: '30',
//     },
//     {
//       title: '壮族',
//       people: '90',
//     }
//   ]
// }

// const departmentMockDetial = [
//   {
//     title: '商学院',
//     num: 2342,
//     detial: [
//       {
//         title: '金融学',
//         people: '300',
//       },
//       {
//         title: '经济学',
//         people: '420',
//       },
//       {
//         title: '经营管理学',
//         people: '230',
//       },
//       {
//         title: '时间管理学',
//         people: '10',
//       },
//       {
//         title: '经营管理学',
//         people: '30',
//       },
//       {
//         title: '经营管理学',
//         people: '90',
//       },
//     ]
//   },
//   {
//     title: '管理学院',
//     num: 5342,
//     detial: [
//       {
//         title: '金融经商学',
//         people: '2200',
//       },
//       {
//         title: '经济学',
//         people: '100',
//       },
//       {
//         title: '经营管理学',
//         people: '230',
//       },
//       {
//         title: '时间管理学',
//         people: '220',
//       },
//     ]
//   },
//   {
//     title: '外国语学院',
//     num: 5342,
//     detial: [
//       {
//         title: '金融经商学',
//         people: '2200',
//       },
//       {
//         title: '经济学',
//         people: '100',
//       },
//       {
//         title: '经营管理学',
//         people: '230',
//       },
//       {
//         title: '时间管理学',
//         people: '220',
//       },
//     ]
//   },
// ]

const dataGroup = [
  [
    {
      value: '商学院',
      label: '商学院',
      children: [
        {
          label: '金融学',
          value: '金融学',
          disabled: false,
        },
        {
          label: '经济学',
          value: '经济学',
        }, {
          label: '经营管理',
          value: '经营管理',
        }, {
          label: '请问',
          value: '请问',
        }, {
          label: '阿萨德',
          value: '阿萨德',
        }, {
          label: '赵小臭',
          value: '赵小臭',
        }, {
          label: '水电费',
          value: '水电费',
        }, {
          label: '味儿',
          value: '味儿',
        }, {
          label: '让他有',
          value: '让他有',
        }, {
          label: '阿萨的德',
          value: '阿萨的德',
        }],
    }, {
      value: '管理学院',
      label: '管理学院',
      children: [
        {
          label: '管理学',
          value: '管理学',
        },
        {
          label: '管理学学',
          value: '管理学学',
        }, {
          label: '经营管理',
          value: '经营管理',
        }
      ],
    },
    {
      value: '外国语',
      label: '外国语',
      children: [
        {
          label: '阿萨德',
          value: '阿萨德',
        },
      ],
    },
  ],

  [
    {
      value: '2017级',
      label: '2017级',
    },
    {
      value: '2018级',
      label: '2018级',
    }, {
      value: '2019级',
      label: '2019级',
    },
    {
      value: '2020级',
      label: '2020级',
      isLeaf: true,
    },
  ],

  [
    {
      value: '汉族',
      label: '汉族',
    }, {
      value: '维吾尔族',
      label: '维吾尔族',
    },
    {
      value: '白族',
      label: '白族',
      isLeaf: true,
    }, {
      value: '傣族',
      label: '傣族',
      isLeaf: true,
    },
  ],
  [
    {
      value: '5',
      // 根据这个值做匹配的，mune自带
      label: '政治面貌',
      totalnum: 8271,
      children: [
        {
          value: '群众',
          label: '群众',
          num: 2272
        }, {
          value: '党员',
          label: '党员',
          num: 2331
        },
        {
          value: '无业游民',
          label: '无业游民',
          num: 3123
        }, {
          value: '废青',
          label: '废青',
          num: 1113
        },
      ],
    },
    {
      value: '6',
      label: '学生类别',
      children: [
        {
          value: '本科',
          label: '本科',
        }, {
          value: '博士',
          label: '博士',
        },
        {
          value: '研究生',
          label: '研究生',
          isLeaf: true,
        }, {
          value: '硕士',
          label: '硕士',
          isLeaf: true,
        },
      ],
    },
    {
      value: '7',
      label: '生源地',
      children: [
        {
          value: '本地',
          label: '本地',
        }, {
          value: '外地',
          label: '外地',
        }
      ],
    },
  ],
]

/**
 * @author zhouzhongkai
 * @date 2020年5月19日 09:47
 * @Description: 移动端-教师端-学生信息-学生信息统计
 */
class Index extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: [],
      resData: [],
      show: [false, false, false, false],
      mockGradeNum: [],//年级人数
      mockPoliticsNum: [],//政治面貌人数
      allScreenRes: [],
      departmentMockDetial:[],//学院专业人数
      nationMockDetial:{},//民族人数
      studentTypeMockDetial:{},//学生类别人数
      studentPlaceMockDetial:{},//学生生源地人数
      operating:-1,//当前在操作的菜单下标
    };
  }

  componentDidMount(){


    // 获取学院专业接口API数据
    selectCountXsByXyAndZy().then(res =>{
      if(res.code===200){
        this.setState({
          departmentMockDetial:[...res.data],
        },() => {
          let xyzy = []
          this.state.departmentMockDetial.map((item) =>{
            let temp = []
            // 为了增加全选功能 增加一个全选的选项
            temp.push({value:'全选',label:'全选'})
            item.detail.map((items) => {
              let tempItem  = {};
              tempItem.value = items.zyName
              tempItem.label = items.zyName
              temp.push(tempItem)
            })
            xyzy.push({value:item.xyName,label:item.xyName,children:temp})
          })
      
          dataGroup[0] = xyzy
        })
      }
    })
    
    

    // 获取年级人数接口API数据
    selectCountXsByNj().then(res =>{
      if(res.code===200){
        this.setState(() => ({
          mockGradeNum : [...res.data]
        }),() => {
            let nj = []
            this.state.mockGradeNum.map((item) => {
              nj.push({value:item.grade,label:item.grade})
            })
            dataGroup[1] = nj
            // dataGroup[3][2].children = nj
        })
      }
    })


    // 获取民族人数接口API数据
    selectCountXsByMz().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          nationMockDetial:res.data,
        }),() => {
          let mz = []
          this.state.nationMockDetial.detailList.map((item) => {
            mz.push({value:item.mz,label:item.mz})
          })
          dataGroup[2] = mz
          // dataGroup[3][3].children = mz
        })
      }
    })

    // 获取政治面貌人数接口API数据
    selectCountXsByZzmm().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          mockPoliticsNum:[...res.data],
        }),() => {
          let zzmm = []
          this.state.mockPoliticsNum.map((item) => {
            zzmm.push({value:item.zzmm,label:item.zzmm})
          })
          dataGroup[3][4-4].children = zzmm
        })
      }
    })

    // 获取学生类别人数接口API数据
    selectCountXsByXslb().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          studentTypeMockDetial:res.data,
        }),() => {
          let xslb = []
          this.state.studentTypeMockDetial.detailList.map((item) => {
            xslb.push({value:item.xslb,label:item.xslb})
          })
          dataGroup[3][5-4].children = xslb
        })
      }
    })

    // 获取学生生源地人数接口API数据
    selectCountXsBySyd().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          studentPlaceMockDetial:res.data,
        }),() =>{
          let syd = []
          this.state.studentPlaceMockDetial.detailList.map((item) => {
            syd.push({value:item.syd,label:item.syd})
          })
          dataGroup[3][6-4].children = syd
        })
      }
    })

    selectCountXsByXb().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          sexNum:res.data,
        }))
      }
    })
    selectCountXsByTotalNumber().then(res => {
      if(res.code === 200){
        this.setState(() => ({
          TotalNumber:res.data,
        }))
      }
    })

  }

  getOptionInTheSchool= () => {
    let TotalNumber = this.state.TotalNumber || {}
    // { value: 123, name: '男生数: \n' + 123 + '人' },

    let otherNumber = TotalNumber.totalNumber - TotalNumber.inSchoolTotalNumber

    let data = []
    data.push( { value: TotalNumber.inSchoolTotalNumber, name: '在校人数: \n' + TotalNumber.inSchoolTotalNumber + '人' })
    data.push( { value: otherNumber, name: '非在校人数: \n' + otherNumber + '人' })


    let option = option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br />{b}({d}%)'
      },
     
      title: {
        subtext: '学生总人数:'+TotalNumber.totalNumber,
        x: 'center',
        top:'80%',
        textStyle: {
          fontSize: 15,
          fontWeight: 500
        },
        subtextStyle: {
          fontSize: 13,
          color: '#999999',
          fontWeight: 400
        }
      },
      series: [
        {
          name: '在校生人数统计',
          type: 'pie',
          radius: '50%',
          center: ['50%', '44%'],
          data: data,
          barWidth: 30,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: '#FAD337'
              }
            }
          },
          itemStyle: {
            normal: {
              // borderWidth: 5, //设置border的宽度有多大
              borderColor: '#fff',
              color: function (params) {
                //自定义颜色
                var colorList = [
                  '#D53A35',
                  '#1790cf',
                  '#1bb2d8',
                  '#99d2dd',
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return option;
  }


  getOptionSex= () => {
    let sexNum = this.state.sexNum || {}
    // { value: 123, name: '男生数: \n' + 123 + '人' },
    
    let data = []
    data.push( { value: sexNum.boyNumber, name: '男生数: \n' + sexNum.boyNumber + '人' })
    data.push( { value: sexNum.girlNumber, name: '女生数: \n' + sexNum.girlNumber + '人' })


    let option = option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br />{b}({d}%)'
      },
      // title: {
      //   subtext: '总人数',
      //   x: 'center',
      //   y: 'center',
      //   top: '36%',
      //   left: '48%',
      //   textStyle: {
      //     fontSize: 15,
      //     fontWeight: 500
      //   },
      //   subtextStyle: {
      //     fontSize: 13,
      //     color: '#999999',
      //     fontWeight: 400
      //   }
      // },
      series: [
        {
          name: '男女生人数统计',
          type: 'pie',
          radius: '50%',
          center: ['50%', '44%'],
          data: data,
          barWidth: 30,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: '#FAD337'
              }
            }
          },
          itemStyle: {
            normal: {
              // borderWidth: 5, //设置border的宽度有多大
              borderColor: '#fff',
              color: function (params) {
                //自定义颜色
                var colorList = [
                  '#1790cf',
                  '#FF3E92'
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return option;
  }


  getOptionPolitics = () => {
    let mockPoliticsNum = this.state.mockPoliticsNum, Politics = [],
      resData = this.state.resData || [];

    // resData 的第四个数组是全部筛选的内容，遍历后找到[0]为5的项就是年级项
    // 5是年级数组的value，匹配到说明找到对应数组
    // 如果resData[3]里没有item[0] == 5 的项 就会空了 所以判断一下如果没有就用mockPoliticsNum
    if (resData[3]) {
      for (let i = 0; i < resData[3].length; i++) {
        if (resData[3][i][0] == 5) {
          Politics = resData[3][i][1];
          break;
        }
        if (i == resData[3].length - 1) {
          mockPoliticsNum.map((item) => {
            Politics.push(item.zzmm)
          })
        }
      }
    } else {
      mockPoliticsNum.map((item) => {
        Politics.push(item.zzmm)
      })
    }

    let data = [];
    mockPoliticsNum.map((item) => {
      Politics.map((items) => {
        if (items == item.zzmm) {
          data.push({ value: item.totalNum, name: item.totalNum + '人  \n' + item.zzmm })
        }
      })
    })

    // { value: 123, name: '男生数: \n' + 123 + '人' },

    let option = option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br />{b}({d}%)'
      },
      // title: {
      //   subtext: '总人数',
      //   x: 'center',
      //   y: 'center',
      //   top: '36%',
      //   left: '48%',
      //   textStyle: {
      //     fontSize: 15,
      //     fontWeight: 500
      //   },
      //   subtextStyle: {
      //     fontSize: 13,
      //     color: '#999999',
      //     fontWeight: 400
      //   }
      // },
      series: [
        {
          name: '人数统计',
          type: 'pie',
          radius: '50%',
          center: ['50%', '44%'],
          data: data,
          barWidth: 30,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: '#FAD337'
              }
            }
          },
          itemStyle: {
            normal: {
              // borderWidth: 5, //设置border的宽度有多大
              borderColor: '#fff',
              color: function (params) {
                //自定义颜色
                var colorList = [
                  '#77BEFF',
                  '#C7E08A',
                  '#FFC4A8',
                  '#88b0bb',
                  '#1c7099',
                  '#038cc4',
                  '#75abd0',
                  '#afd6dd',
                  '#C4BDF1',
                  '#1790cf',
                  '#1bb2d8',
                  '#99d2dd',
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return option;
  }

  getOption = () => {
    let { mockGradeNum } = this.state, grade = [],
      resData = this.state.resData || [];
    // resData 的第四个数组是全部筛选的内容，遍历后找到[0]为3的项就是年级项
    // 3是年级数组的value，匹配到说明找到对应数组
    // 如果resData[3]里没有item[0] == 3 的项 就会空了 所以判断一下如果没有就用mockGradeNum
    if (resData[3]) {
      for (let i = 0; i < resData[3].length; i++) {
        if (resData[3][i][0] == 3) {
          grade = resData[3][i][1] || [];
          break;
        }
        if (i == resData[3].length - 1) {
          mockGradeNum.map((item) => {
            grade.push(item.grade)
          })
        }
      }
    } else {
      mockGradeNum.map((item) => {
        grade.push(item.grade)
      })
      // console.log(grade);
    }
    let data = [];
    mockGradeNum.map((item) => {
      grade.map((items) => {
        if (items == item.grade) {
          data.push({ value: item.totalNum, name: item.totalNum + '人  \n' + item.grade +'级' })
        }
      })
    })

    // { value: 123, name: '男生数: \n' + 123 + '人' },

    let option = option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br />{b}({d}%)'
      },
      // title: {
      //   subtext: '总人数',
      //   x: 'center',
      //   y: 'center',
      //   top: '36%',
      //   left: '48%',
      //   textStyle: {
      //     fontSize: 15,
      //     fontWeight: 500
      //   },
      //   subtextStyle: {
      //     fontSize: 13,
      //     color: '#999999',
      //     fontWeight: 400
      //   }
      // },
      series: [
        {
          name: '人数统计',
          type: 'pie',
          radius: ['30%', '50%'],
          center: ['50%', '44%'],
          data: data,
          barWidth: 30,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              normal: {
                color: '#FAD337'
              }
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 5, //设置border的宽度有多大
              borderColor: '#fff',
              color: function (params) {
                //自定义颜色
                var colorList = [
                  '#77BEFF',
                  '#C7E08A',
                  '#FFC4A8',
                  '#C4BDF1',
                  '#1790cf',
                  '#1bb2d8',
                  '#99d2dd',
                  '#88b0bb',
                  '#1c7099',
                  '#038cc4',
                  '#75abd0',
                  '#afd6dd'
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return option;
  }

  onChange(value, index) { 

  }
  onChangeAll = (value) => {
    if(!value)return
    let resData = this.state.resData || [],
      allScreenRes = ALLSCREENRES;
    allScreenRes.map((item, index) => {
      // 第一个表示是第几个菜单项
      if (item[0] == value[0]) {
        allScreenRes.splice(index, 1, value)
      }
      if (index == allScreenRes.length - 1 && allScreenRes.indexOf(value) == -1) {
        allScreenRes.push(value)
      }
    })
    if (allScreenRes.length == 0) allScreenRes.push(value)

    ALLSCREENRES = allScreenRes
    // onChange时间不能setstate 用全局变量传递到ok 以此来更新
  }
  onOk(value, index) {
    let resData = this.state.resData || [],grade = [], { mockGradeNum } = this.state;
    if(!value){
      this.onCancel(index)
      return
    }
    // if(index == 1 && value && value.length == 0){
    //   this.onCancel(index)
    //   return
    //   // if (resData[3]) {
    //   //   for (let i = 0; i < resData[3].length; i++) {
    //   //     if (resData[3][i][0] == 3) {
    //   //       grade = resData[3][i][1] || [];
    //   //       break;
    //   //     }
    //   //     if (i == resData[3].length - 1) {
    //   //       mockGradeNum.map((item) => {
    //   //         grade.push(item.grade)
    //   //       })
    //   //     }
    //   //   }
    //   // }
    // }

    let operating = index
   
    switch(value && value[0] && +value[0]){
      case 5:
        operating = 3.5
      break;
      case 6:
        operating = 3.6
      break;
      case 7:
        operating = 3.7
      break;
    }
 
    let choicedDepartment;
    // console.log(value);
    if (index == 1) {
      resData[index] = value;
      // resData[3];是全部筛选的对应项
      if (resData[3]) {
        for (let i = 0; i < resData[3].length; i++) {
          if (resData[3][i][0] == 3) {
            resData[3][i][1] = value
            break;
          }
          if (i == resData[3].length - 1) {
            resData[3].push([3, value])
          }
        }
      }
      else {
        resData[3] = [[3, value]]
      }
    }

    else if (index == 2) {
      resData[index] = value;
      // resData[3];是全部筛选的对应项
      if (resData[3]) {
        for (let i = 0; i < resData[3].length; i++) {
          if (resData[3][i][0] == 4) {
            resData[3][i][1] = value
            break
          }
          if (i == resData[3].length - 1) {
            resData[3].push([4, value])
          }
        }
      }
      else {
        resData[3] = [[4, value]]
      }
    }

    else if (index == 0) {
      if(value[1][0] === '全选'){
      // 2020年7月1日16:38:47新增 如果不选中专业 则默认全选改院系
      let initData = this.state.initData
      initData[0] && initData[0].map((initDataItem,initDataIndex)=>{
        if(initDataItem.value == value[0]){
          let temp = []
          initDataItem.children.map((childrenItem)=>{
            temp.push(childrenItem.value)
          })
          resData[index] = temp
          choicedDepartment = [value[0],resData[index]]
        }
      })
      }else{
        
        resData[index] = value && value[1]
        choicedDepartment = value
        // 选中的院系，用于做院系数据关联
      }
    }

    else if (index == 3) {
      resData[index] = ALLSCREENRES
    }
    else {
      resData[index] = value;
    }
    // console.log(resData)
    let show = [false, false, false, false];
    this.setState({ 
      show: show,
      resData: resData,
      choicedDepartment: choicedDepartment,
      operating:operating
     });
  }
  onCancel(index) {
    let show = [false, false, false, false];
   
    this.setState({
      resData:[],
      show: show, 
      choicedDepartment: [] ,
      operating:index//当前在操作的菜单下标
    });
  }
  handleClick(e, index) {
    e.preventDefault(); // Fix event propagation on Android
    let temp = !this.state.show[index]
    let show = [false, false, false, false];
    show[index] = temp;
    this.setState({
      show: show,
    });
    // mock for async data loading
    if (!this.state.initData[index]) {
      let initData = this.state.initData;
      initData[index] = dataGroup[index]
      this.setState({
        initData: initData,
      });
      
    }

  }

  onMaskClick(index) {
    let show = this.state.show;
    show[index] = false;
    this.setState({ show: show });
  }

  showFourth() {
    let show = [false, false, false, true];
    this.setState({ show: show });
  }

  render() {

    const { initData, show } = this.state;
    let resData = this.state.resData || [],
      title_1 = '院系专业',
      title_2 = '年级选择',
      title_3 = '民族属性',
      title_4 = '其他筛选';
    // if (resData && resData[0] && resData[0][0]) {
    //   dataGroup[0].map((item) => {
    //     if (item.value == resData[0][0]) {
    //       title_1 = item.label
    //     }
    //   })
    // }
    let marginLeft = (this.state.show.indexOf(true) * 100) + '%'
    // 展示菜单的话就不展示content
    let showContent = true;
    if (show.indexOf(true) != -1) showContent = false

    // 学院人数统计数据联动
    let departmentDetial = [], choicedDepartment = this.state.choicedDepartment || [];
    // 根据choicedDepartment筛选需要展示的院系内容

    if (choicedDepartment.length > 0) {

      // 这里操作 departmentDetial的话 会影响到 departmentMockDetial
      this.state.departmentMockDetial.map((item) => {
        if (item.xyName == choicedDepartment[0]) {

          departmentDetial = [{}];
          departmentDetial[0].xyName = item.xyName;
          departmentDetial[0].xyTotalNum = item.xyTotalNum;
          departmentDetial[0].detail  =  []

          let temp = item.detail
       
          // 筛选专业
          temp.map((items) => {
            if (choicedDepartment[1].indexOf(items.zyName) != -1) {
              // console.log(items.zyName)
              departmentDetial[0].detail.push(items)
            }
          })
        }
      })

    } else {
      departmentDetial = this.state.departmentMockDetial
      // bug 这里的 departmentMockDetial 已经被choicedDepartment筛选掉了 所以上面选过一次后只能在上一次选剩下的列表中继续选择
    }

    // 学生类别人数统计数据联动
    let studentTypeDetial = { xslbTotalNum: 2342, detailList: [] }, choicedStudentTypeDetial;
    // resData 的第四个数组是全部筛选的内容，遍历后找到[0]为6的项就是学生类别
    // 6是年级数组的value，匹配到说明找到对应数组
    // 如果resData[3]里没有item[0] == 6 的项 就会空了 所以判断一下如果没有就
    if (resData[3]) {
      for (let i = 0; i < resData[3].length; i++) {
        if (resData[3][i][0] == 6) {
          choicedStudentTypeDetial = resData[3][i][1]
          break;
        }
      }
    }
    // 得到选中的项，筛选数组
    if (choicedStudentTypeDetial) {
      let xslbTotalNum = 0
      this.state.studentTypeMockDetial.detailList.map((item, index) => {
        if (choicedStudentTypeDetial.indexOf(item.xslb) != -1) {
          studentTypeDetial.detailList.push(item)
          xslbTotalNum = xslbTotalNum + item.totalNum
        }
      })
      studentTypeDetial.xslbTotalNum = xslbTotalNum
    } else {
      studentTypeDetial = this.state.studentTypeMockDetial
    }

    // 学生生源地人数统计数据联动
      let studentPlaceDetial = { sdyTotalNum: 2342, detailList: [] }, choicedStudentPlaceDetial;
      // resData 的第四个数组是全部筛选的内容，遍历后找到[0]为6的项就是学生类别，这里能用到是7
      // 6是年级数组的value，匹配到说明找到对应数组
      // 如果resData[3]里没有item[0] == 6 的项 就会空了 所以判断一下如果没有就，这里能用到是7
      if (resData[3]) {
        for (let i = 0; i < resData[3].length; i++) {
          if (resData[3][i][0] == 7) {
            choicedStudentPlaceDetial = resData[3][i][1]
            break;
          }
        }
      }
      // 得到选中的项，筛选数组
      if (choicedStudentPlaceDetial) {
        let sydTotalNum = 0 
        this.state.studentPlaceMockDetial.detailList.map((item, index) => {
          if (choicedStudentPlaceDetial.indexOf(item.syd) != -1) {
            studentPlaceDetial.detailList.push(item)
            sydTotalNum = sydTotalNum + item.totalNum
          }
        })
        studentPlaceDetial.sydTotalNum = sydTotalNum
      } else {
        studentPlaceDetial = this.state.studentPlaceMockDetial
      }


    // 民族人数统计数据联动
    let nationDetial = { mzTotalNum: 2342, detailList: [] }, choicednationDetial;
    // resData 的第四个数组是全部筛选的内容，遍历后找到[0]为4的项就是学生类别
    // 4是年级数组的value，匹配到说明找到对应数组
    // 如果resData[3]里没有item[0] == 4 的项 就会空了 所以判断一下如果没有就
    if (resData[3]) {
      for (let i = 0; i < resData[3].length; i++) {
        if (resData[3][i][0] == 4) {
          choicednationDetial = resData[3][i][1]
          break;
        }
      }
    }
    // 得到选中的项，筛选数组
    if (choicednationDetial) {
      let mzTotalNum = 0 
      this.state.nationMockDetial.detailList.map((item, index) => {
        if (choicednationDetial.indexOf(item.mz) != -1) {
          nationDetial.detailList.push(item)
          mzTotalNum = mzTotalNum + item.totalNum
        }
      })
        nationDetial.mzTotalNum = mzTotalNum

    } else {
      nationDetial = this.state.nationMockDetial
     
    }

    return (
      <div location={location} style={{ background: 'rgba(242,244,247,1)' }}>
        <style>
          {
            `
              // .am-navbar-left{
              //   font-size:14px !important; 
              //   font-weight:400 !important; 
              //   color:rgba(102,102,102,1) !important; 
              //   justify-content: center;
              //   padding-left:0 !important; 
              // }
              // .am-navbar-title{
              //   display: none;
              // }
              // .am-navbar-right{
              //   display: none;
              // }
              // .am-navbar{
              // }
              .am-flexbox.am-flexbox-align-stretch{
                width: 400%;
                margin-left:-${marginLeft};
                height:370px  !important; 
              }
              .am-checkbox-inner{
                display:none;
              }

              .am-menu .am-flexbox .am-flexbox-item:last-child{
                width: 100% !important;
              }
              .am-flexbox-item{
                width: 50% !important; 
                flex: inherit !important; 
              }
              .am-menu .am-menu-select-container{
              background-color: rgb(247,247,247) !important; 
              height:330px;

            }
              .multi-menu-active {
                width: 93.5px;
              }
              .am-list-item{
                padding-left:22px  !important;
              }
              .am-menu .am-flexbox .am-flexbox-item .am-list{
                height:330px;

              }
              .am-flexbox am-menu-select-container am-flexbox-align-start{
                height:330px;
              }
              .am-list-item .am-list-line .am-list-content{
                font-size: 13px !important;
              }
              .am-list-item .am-list-line{
                display: block !important;
                padding-top: 8px;
                height: 50px;
              }
              .am-menu .am-flexbox .am-flexbox-item:first-child .am-list .am-list-item .am-list-line .am-list-content{
                text-align: center;
                padding-bottom:20px;
              }
              .am-list-item .am-list-line .am-list-extra{
                font-size: 13px !important;
              }
              .am-accordion .am-accordion-item .am-accordion-content .am-accordion-content-box::after{
                height:0px !important;
              }
              .am-accordion .am-accordion-item .am-accordion-header i{
                width: 16px !important;
                height: 12px !important;
              }
            `
          }
        </style>
        <div className={styles.titleBox}>
          <div className={show[0] ? 'multi-menu-active' : ''}>
            <div>
              {/* <NavBar
                leftContent={title_1}
                mode="light"
                onLeftClick={(e) => this.handleClick(e, 0)}
                className="multi-top-nav-bar"
              >
              </NavBar> */}
              <div className = {styles.muneTitle}
                onClick={(e) => this.handleClick(e, 0)}
              >
                {title_1}
              </div>
            </div>
            {show[0] ? initData[0] ?
              <Menu
                className="multi-foo-menu"
                data={initData[0]}
                selectedKeys = {['',new Array('asd')]}
                onChange={(e) => {this.onChange(0)}}
                onOk={(value) => { this.onOk(value, 0)}}
                onCancel={(e) => this.onCancel(0)}
                height={document.documentElement.clientHeight * 0.6}
                multiSelect
              />
              :
              <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </div>
              : null}
            {show[0] ? <div className="menu-mask" onClick={(e) => this.onMaskClick(0)} /> : null}
          </div>

    
          

           <div className={show[1] ? 'multi-menu-active' : ''}>
            <div>
              {/* <NavBar
                leftContent={title_2}
                mode="light"
                onLeftClick={(e) => this.handleClick(e, 1)}
                className="multi-top-nav-bar"
                
              >
              </NavBar> */}
             <div className = {styles.muneTitle}
                onClick={(e) => this.handleClick(e, 1)}
              >
                {title_2}
              </div>
            </div>
            {show[1] ? initData[1] ?
              <Menu
                className="multi-foo-menu"
                data={initData[1]}
                onChange={(e) => this.onChange(1)}
                onOk={(value) => this.onOk(value, 1)}
                onCancel={(e) =>{ 
                  this.onCancel(1)
                }}
                height={document.documentElement.clientHeight * 0.6}
                level={1}
                multiSelect
              />
              :
              <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </div>
              : null}
            {show[1] ? <div className="menu-mask" onClick={(e) => this.onMaskClick(1)} /> : null}
          </div> 

          <div className={show[2] ? 'multi-menu-active' : ''}>
            <div>
              {/* <NavBar
                leftContent={title_3}
                mode="light"
                onLeftClick={(e) => this.handleClick(e, 2)}
                className="multi-top-nav-bar"
              >

              </NavBar> */}

              <div className = {styles.muneTitle}
                onClick={(e) => this.handleClick(e, 2)}
              >
                {title_3}
              </div>
            </div>
            {show[2] ? initData[2] ?
              <Menu
                className="multi-foo-menu"
                data={initData[2]}
                onChange={(e) => this.onChange(2)}
                onOk={(value) => this.onOk(value, 2)}
                onCancel={(e) => this.onCancel(2)}
                height={document.documentElement.clientHeight * 0.6}
                level={1}
                multiSelect
              />
              :
              <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </div>
              : null}
            {show[2] ? <div className="menu-mask" onClick={(e) => this.onMaskClick(2)} /> : null}
          </div>   

          <div className={show[3] ? 'multi-menu-active' : ''}>
            <div>
              {/* <NavBar
                leftContent={title_4}
                mode="light"
                onLeftClick={(e) => this.handleClick(e, 3)}
                className="multi-top-nav-bar"
              >

              </NavBar> */}
              <div className = {styles.muneTitle}
                onClick={(e) => this.handleClick(e, 3)}
              >
                {title_4}
              </div>
            </div>
            {show[3] ? initData[3] ?
              <Menu
                className="multi-foo-menu"
                data={initData[3]}
                value={['5', []]}
                onChange={this.onChangeAll}
                onOk={(value) => this.onOk(value, 3)}
                onCancel={(e) => this.onCancel(3)}
                height={document.documentElement.clientHeight * 0.6}
                multiSelect
              />
              :
              <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </div>
              : null}
            {show[3] ? <div className="menu-mask" onClick={(e) => this.onMaskClick(3)} /> : null}
          </div>

        </div>
        <style>
            {`
              .am-accordion-header{
                  font-size:14px !important;
                }
                  .am-accordion-header{
                    border-bottom: 0PX solid #ddd !important;
                  }
               
                `
              }
                </style>
        {
          showContent &&
          <div  className={styles.contentBox}>
            { 
              this.state.resData.length > 0 &&
              <div
                onClick={()=>this.onCancel(0)}
              className = {styles.reset}>
                重置筛选
              </div> 
            }

            {/* 在校生人数统计 */}
            <div className={styles.gradeAdminstraction}>
              <Accordion style={{ marginTop: '10px' }} defaultActiveKey={this.state.operating == -1?"0":'-1'}   className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'在校人数统计'} className="pad">
                  <ReactEcharts option={this.getOptionInTheSchool()} />
                </Accordion.Panel>
              </Accordion>
            </div>
            
             {/* 男女生人数统计 */}
             <div className={styles.gradeAdminstraction}>
              <Accordion style={{ marginTop: '10px' }}  className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'男女生人数统计'} className="pad">
                  <ReactEcharts option={this.getOptionSex()} />
                </Accordion.Panel>
              </Accordion>
            </div>

            <div className={styles.departmentAdminstraction}>
            <Accordion defaultActiveKey={this.state.operating == 0?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
            <Accordion.Panel header={'院系专业人数统计'} className="pad">
                <Accordion defaultActiveKey="0" className="my-accordion" onChange={(e) => this.onChange()}>
                  {
                    departmentDetial.map((items) => {
                      // console.log(items)

                      return (
                        <Accordion.Panel header={items.xyName + ':' + items.xyTotalNum + '人'} className="pad">
                          <div className={styles.detialBOx}>
                            {
                              items.detail.map((item, index) => {
                                return (
                                  <div className={styles.detialLine}>
                                    <div className={styles.detialLineTitle}>{item.zyName}</div>
                                    <div className={styles.blueBox}>
                                      <div
                                        style={{ width: ((item.zyTotalNum / items.xyTotalNum) * 64 * items.detail.length) < 73 ? ((item.zyTotalNum / items.xyTotalNum) * 64 * items.detail.length) + '%' : 73 + '%' }}
                                        className={styles.blue}></div>
                                    </div>
                                    <div className={styles.detialLinePeople} >{item.zyTotalNum}人</div>
                                  </div>
                                )
                              })
                            }

                          </div>
                        </Accordion.Panel>
                      )
                    })
                  }
          
                  </Accordion>
              </Accordion.Panel>
              </Accordion>
            </div>

            {/* 年级人数统计环形图 */}
            <div className={styles.gradeAdminstraction}>
              <Accordion style={{ marginTop: '10px' }} defaultActiveKey={this.state.operating == 1?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'年级人数统计'} className="pad">
                  <ReactEcharts option={this.getOption()} />
                </Accordion.Panel>
              </Accordion>
            </div>

            {/* 民族人数统计 */}
            <div className={styles.nationAdminstraction}>
              <Accordion defaultActiveKey={this.state.operating == 2?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'民族人数统计'} >
                  <div className={styles.detialBOx}>
                    {                        
                        (nationDetial.detailList != undefined)  ? nationDetial.detailList.map((item, index) => {
                          return (
                            <div className={styles.detialLine}>
                              <div className={styles.detialLineTitle}>{item.mz}</div>
                              <div className={styles.blueBox}>
                                <div
                                  style={{ width: ((item.totalNum / nationDetial.mzTotalNum) * 64 * nationDetial.detailList.length) < 73 ? ((item.totalNum / nationDetial.mzTotalNum) * 64 * nationDetial.detailList.length) + '%' : 73 + '%' }}
                                  className={styles.blue}></div>
                              </div>
                              <div className={styles.detialLinePeople} >{item.totalNum  }人</div>
                            </div>
                          )
                        })
                        : null
                    }
                  </div>
                </Accordion.Panel>
              </Accordion>
            </div>

            {/* 政治面貌人数统计 */}
            <div className={styles.gradeAdminstraction}>
              <Accordion style={{ marginTop: '10px' }} defaultActiveKey={this.state.operating == 3.5 || this.state.operating == 3?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'政治面貌人数统计'} className="pad">
                  <ReactEcharts option={this.getOptionPolitics()} />
                </Accordion.Panel>
              </Accordion>
            </div>

            {/* 学生类别人数统计 */}
            <div className={styles.nationAdminstraction}>
              <Accordion defaultActiveKey={this.state.operating == 3.6|| this.state.operating == 3?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'学生类别人数统计'} >
                  <div className={styles.detialBOx}>
                    {
                      (studentTypeDetial.detailList != undefined) ? studentTypeDetial.detailList.map((item, index) => {
                        return (
                          <div className={styles.detialLine}>
                            <div className={styles.detialLineTitle}>{item.xslb}</div>
                            <div className={styles.blueBox}>
                              <div
                                style={{ width: ((item.totalNum / studentTypeDetial.xslbTotalNum) * 64 * studentTypeDetial.detailList.length) <  73? ((item.totalNum / studentTypeDetial.xslbTotalNum) * 64 * studentTypeDetial.detailList.length) + '%' : 73 + '%' }}
                                className={styles.blue}></div>
                            </div>
                            <div className={styles.detialLinePeople} >{item.totalNum}人</div>
                          </div>
                        )
                      }):null
                    }
                  </div>
                </Accordion.Panel>
              </Accordion>
            </div>

            {/* 学生生源地人数统计 */}
             <div className={styles.nationAdminstraction}>
              <Accordion defaultActiveKey={this.state.operating == 3.7|| this.state.operating == 3?"0":'-1'} className="my-accordion" onChange={(e) => this.onChange()}>
                <Accordion.Panel header={'学生生源地人数统计'} >
                  <div className={styles.detialBOx}>
                    {
                      (studentPlaceDetial.detailList != undefined) ? studentPlaceDetial.detailList.map((item, index) => {
                        return (
                          <div className={styles.detialLine}>
                            <div className={styles.detialLineTitle}>{item.syd}</div>
                            <div className={styles.blueBox}>
                              <div
                                style={{ width: ((item.totalNum / studentPlaceDetial.sydTotalNum) * 64 * studentPlaceDetial.detailList.length) < 73 ? ((item.totalNum / studentPlaceDetial.sydTotalNum) * 64 * studentPlaceDetial.detailList.length) + '%' : 73 + '%' }}
                                className={styles.blue}></div>
                            </div>
                            <div className={styles.detialLinePeople} >{item.totalNum}人</div>
                          </div>
                        )
                      }):null
                    }
                  </div>
                </Accordion.Panel>
              </Accordion>
            </div> 

          </div>

        }
      </div>
    );
  }
}

Index.propTypes = {
  location: PropTypes.object.isRequired
};

const app = createForm()(Index);
export default app;

