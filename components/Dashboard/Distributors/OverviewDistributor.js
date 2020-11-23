import React, {useState} from 'react'
import {Drawer, Button, Card} from 'antd'
import {SettingOutlined, LoadingOutlined} from '@ant-design/icons'
import OrgChart from '../../../node_modules/@balkangraph/orgchart.js'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import SettingDistributorModel from './SettingDistributorModel'

const {Meta} = Card

const gridStyle = {
  width: '50%',
  textAlign: 'center'
};

const OverviewDistributor = ({data, layerDepth}) => {
    let discount = []
    for (let i=0; i<layerDepth.length; i++) {
        discount.push(data.user.shops[0].layer_depth_rewards[0].discount)
        console.log(data.user.shops[0].layer_depth_rewards[0].discount)
    }
    console.log('data', data)
    console.log('layerDepth', layerDepth.length)
    console.log('discount',discount)
    return (
        <div>
            <script src="https://balkangraph.com/js/latest/OrgChart.js"/>
            <div id="tree" style={{backgroundColor: 'white',width: '100%', height: '400px'}}/>
            <div style={{backgroundColor: 'red', width: '100%', height: '100%'}}>
                <Card>
                    {data && data.user.shops[0].layer_depth >= 0 && data.user.shops[0].workforce_per_row >= 0 && (
                        <Card.Grid
                            style={gridStyle}
                        >
                            <Meta
                            style={{height: '100%'}}
                            title="จะมีตัวแทนได้สูงสุด"
                            description={data && data.user.shops[0].workforce_per_row - 1 > 1 ? <code>{Math.floor(Math.pow(data.user.shops[0].workforce_per_row, data.user.shops[0].layer_depth)/(data.user.shops[0].workforce_per_row-1))} คนต่อ 1 สายงาน<br/>.</code> : <code>{Math.floor(Math.pow(data.user.shops[0].workforce_per_row, data.user.shops[0].layer_depth)-(data.user.shops[0].workforce_per_row-1))} คนต่อ 1 สายงาน<br/>.</code>}
                            />
                        </Card.Grid>
                    )}  
                    {data && data.user.shops[0].layer_depth >= 0 && data.user.shops[0].workforce_per_row < 0 && (
                        <Card.Grid
                            style={gridStyle}
                        >
                            <Meta
                            style={{height: '100%'}}
                            title="จะมีตัวแทนได้สูงสุด"
                            description={<code> มีตัวแทนได้ไม่จำกัดคนต่อ 1 สายงาน<br/>.</code>}
                            />
                        </Card.Grid>
                    )}
                    {data && data.user.shops[0].layer_depth < 0 && (
                        <Card.Grid
                            style={gridStyle}
                        >
                            <Meta
                            style={{height: '100%'}}
                            title="จะมีตัวแทนได้สูงสุด"
                            description={<code>- มีลูกทีมไม่จำกัดต่อ 1 สายงาน<br/>- แต่ละสายงานลึกลงไปได้ไม่จำกัดชั้น</code>}
                            />
                        </Card.Grid>
                    )}


                    {data && data.user.shops[0].layer_depth >= 0 && data.user.shops[0].workforce_per_row >= 0 && layerDepth.map(e => {
                        // console.log('e->', e)
                        // console.log(`data.user.shops[0].layer_depth_rewards[${e}].discount`, data.user.shops[0].layer_depth_rewards[e])
                            return(
                                <Card.Grid
                                    style={gridStyle}
                                >
                                    <Meta
                                    avatar={<div style={{width: '20px', height: '20px', backgroundColor: `#F57C0E`}} />}
                                    title={`ตัวแทนชั้นที่${e+1}`}
                                    description={e+1 == 1 ? <code>- มีจำนวนตัวแทนในชั้นนีได้ไม่จำกัด<br/>- ได้รับส่วนลดในการซื้อสินค้า {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} ต่อการเปิด 1 บิล</code> : <code>- มีจำนวนตัวแทนในชั้นนีได้ {data.user.shops[0].workforce_per_row} คนต่อ 1 ตัวแทน<br/>- ได้รับส่วนลดในการซื้อสินค้า {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} /การเปิด 1 บิล</code>}
                                    />
                                </Card.Grid>
                            )
                    })}
                    {data && data.user.shops[0].layer_depth >= 0 && data.user.shops[0].workforce_per_row < 0 && layerDepth.map(e => {
                            return(
                                <Card.Grid
                                    style={gridStyle}
                                >
                                    <Meta
                                    avatar={<div style={{width: '20px', height: '20px', backgroundColor: `#F57C0E`}} />}
                                    title={`ตัวแทนชั้นที่${e+1}`}
                                    description={e+1 == 1 ? <code>- มีจำนวนตัวแทนในชั้นนีได้ไม่จำกัด<br/>- ได้รับส่วนลดในการซื้อสินค้า {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} ต่อการเปิด 1 บิล</code> : <code>- มีจำนวนตัวแทนในชั้นนีได้ไม่จำกัดคนต่อ 1 ตัวแทน<br/>- ได้รับส่วนลดในการซื้อสินค้า {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} /การเปิด 1 บิล</code>}
                                    />
                                </Card.Grid>
                            )
                    })}
                    {data && data.user.shops[0].layer_depth < 0 && (
                        <Card.Grid
                            style={gridStyle}
                        >
                            <Meta
                            avatar={<div style={{width: '20px', height: '20px', backgroundColor: `#F57C0E`}} />}
                            title={`ตัวแทนแต่ละชั้น`}
                            description={data && data.user.shops[0].workforce_per_row < 0 ? <code>- มีจำนวนตัวแทนในแต่ชั้นได้ไม่จำกัด<br/>- มีส่วนลดให้ในแต่ละชั้น {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} /การเปิด 1 บิล</code> : <code>- มีจำนวนตัวแทนในแต่ละชั้น {data.user.shops[0].workforce_per_row} คนต่อ 1 ตัวแทน<br/>- มีส่วนลดให้ในแต่ละชั้น {discount[e]} {data && data.user.shops[0].layer_depth_rewards[e].type == 'บาท' ? 'THB' : '%'} /การเปิด 1 บิล</code>}
                            />
                        </Card.Grid>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default OverviewDistributor
