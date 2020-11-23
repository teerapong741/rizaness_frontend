import React, {useState} from 'react'
import {Button, Card, Drawer} from 'antd'
import {SettingOutlined, LoadingOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import SettingDistributorModel from './SettingDistributorModel';
import { set } from 'js-cookie'

const gridStyle = {
  width: '50%',
  textAlign: 'center'
};

export const QUERY_DISTRIBUTOR = gql`
	query QUERY_DISTRIBUTOR {
		user {
            id
			shops {
				id
				shopName
                dis_no_stock
                dis_stock
                dis_system
				layer_depth
     			workforce_per_row
				rank_distributors {
					id
				}
				point_distributors {
				  id
				  condition
				  usePoint
				  reward
				}
			}
		}
	}
`

const DistributorModel = () => {
    const [visibleSettingDisModel, setVisibleSettingDisModel] = useState(false);
    const [layerDepth, setLayerDepth] = useState(0)
    const [workforceDerRow, setWorkforceDerRow] = useState(0)
    const [disNoStock, setDisNoStock] = useState(false)
    const [disStock, setDisStock] = useState(false)
    const [rankDistributorsLength, setRankDistributorsLength] = useState(0)
    const [pointDistributorsLength, setPointDistributorsLength] = useState(0)

    const {data, loading, error, refetch } = useQuery(QUERY_DISTRIBUTOR, {
		onCompleted: async (data) => {
            await setLayerDepth(data.user.shops[0].layer_depth)
            await setWorkforceDerRow(data.user.shops[0].workforce_per_row)
            await setDisNoStock(data.user.shops[0].dis_no_stock)
            await setDisStock(data.user.shops[0].dis_stock)
            await setRankDistributorsLength(data.user.shops[0].rank_distributors.length)
            await setPointDistributorsLength(data.user.shops[0].point_distributors.length)
		}
	})
	refetch()

    const onCloseDrawerSettingDisModel = () => {
        setVisibleSettingDisModel(false);
    };

    const onOpenDrawerSettingDisModel = () => {
        setVisibleSettingDisModel(true);
    };

    if (loading) {
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
    }

    return (
        <div>
            <Drawer
				title="ตั้งค่ารูปแบบตัวแทน"
				placement="right"
				closable={false}
				onClose={onCloseDrawerSettingDisModel}
				visible={visibleSettingDisModel}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 20px 0px 20px'
				}}
			>
				<SettingDistributorModel />
			</Drawer>

            <div style={{position:'relative', width: '100%', height: '40px'}}>
                <Button 
                    style={{position:'absolute', right: '0px'}} 
                    size="large" 
                    type="primary" 
                    icon={<SettingOutlined />}
                    onClick={onOpenDrawerSettingDisModel}
                >
                    ตั้งค่ารูปแบบตัวแทน
                </Button>
            </div>
            
            <div style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>
                <Card style={{margin: '10px 0 0 0 '}} title="รูปแบบตัวแทนของร้านคุณ">
                    <Card.Grid style={gridStyle}>
                        {layerDepth < 0 && ('มีลูกทีมติดตัวได้สูงสุดได้ไม่จำกัด')} 
                        {layerDepth == 0 && ('ไม่มีระบบลูกทีม')} 
                        {layerDepth > 0 && (`มีลูกทีมติดตัวได้สูงสุด ${workforceDerRow} คน/ชั้น (ชั้นบนสุดมีได้ไม่จำกัด)`)} 
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        {layerDepth < 0 && ('มีตัวแทนลึกลงไปได้สูงสุดได้ไม่จำกัด')} 
                        {layerDepth == 0 && ('ไม่มีระบบความลึกตัวแทน')} 
                        {layerDepth > 0 && (`มีตัวแทนลึกลงไป ${layerDepth} ชั้น`)}
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        {rankDistributorsLength > 0 && layerDepth !== 0 && workforceDerRow !== 0 ? `มีระดับขั้นตัวแทน ${rankDistributorsLength} ระดับ`  : 'ไม่มีระดับขั้นตัวแทน'}
                        
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        {data && pointDistributorsLength !== 0 ? 'มี' : 'ไม่มี'}ระบบแต้มสะสมตัวแทน
                        {/* {data && data.user.shops[0].point_distributors.length !== 0 } */}
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        {data && disNoStock == true ? 'มี' : 'ไม่มี'}ตัวแทนแบบไม่สต้อกสินค้า (Dropship)
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        {data && disStock == true ? 'มี' : 'ไม่มี'}ตัวแทนแบบสต็อกสินค้า
                    </Card.Grid>
                </Card>
            </div>  
        </div>
    )
}

export default DistributorModel
