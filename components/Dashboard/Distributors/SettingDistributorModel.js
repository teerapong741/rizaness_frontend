import React, {useState} from 'react'
import {Form, Input, Popover,Upload, Modal, Typography, Button, Select, InputNumber, Space, Card } from 'antd'
import {InfoCircleOutlined, LoadingOutlined} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import gql from 'graphql-tag'
import {useMutation, useQuery} from '@apollo/react-hooks'
import swal from 'sweetalert'

import {QUERY_DISTRIBUTOR} from './DistributorModel'

const {Text} = Typography
const { Option } = Select;

const contentNameRank = (
  <div>
    <p>ชื่อของระดับที่กำลังจะสร้างนี้</p>
  </div>
);

const UPDATE_DISTRIBUTOR_MODEL = gql`
    mutation UPDATE_DISTRIBUTOR_MODEL(
        $idShop: ID! 
		$layer_depth: Int, 
		$workforce_per_row: Int,
		$dis_stock: Boolean,
		$dis_no_stock: Boolean,
		$dis_system: Boolean
    ) {
        updateShop(
            idShop: $idShop,
            layer_depth: $layer_depth, 
            workforce_per_row: $workforce_per_row,
            dis_stock: $dis_stock,
            dis_no_stock: $dis_no_stock,
            dis_system: $dis_system
        ) {
            id
            layer_depth
            workforce_per_row
            dis_system
            dis_stock
            dis_no_stock
        }
    }
`

const ADD_LAYER_DEPTH_REWARD = gql`
    mutation ADD_LAYER_DEPTH_REWARD(
        $layer: Int!
        $type: String!
		$discount: Float!
		$idShop: ID!
    ) {
        addLayerDepthReward(
            layer: $layer
            type: $type
            discount: $discount
            idShop: $idShop
        ) {
            id
        }
    }
`

const DELETE_LAYER_DEPTH_REWARD = gql`
    mutation DELETE_LAYER_DEPTH_REWARD(
        $idLayerDepthReward: ID!
		$idShop: ID!
    ) {
        deleteLayerDepthReward(
            idLayerDepthReward: $idLayerDepthReward
		    idShop: $idShop
        ) {
            id
        }
    }
`

const QUERY_SHOP_ID = gql`
    query QUERY_SHOP_ID {
        user {
            id
            shops {
                id
                layer_depth
                workforce_per_row
                dis_system
                dis_stock
                dis_no_stock
                layer_depth_rewards {
                    id
                    layer
                    type
                    discount
                    shop {
                        id
                    }
                    createdAt
                }
            }
        }
    }
`

const SettingDistributorModel = () => {
    const [infoDisPattern, setInfoDisPattern] = useState({
        layer_depth_limit: false,
        workforce_per_row_limit: false,
        layer_depth: 0,
        workforce_per_row: 0,
        dis_system: false,
        dis_stock: false,
        dis_no_stock: false,
        discountType: 'บาท',
        discountArr: [0]
    })
    const [success, setSuccess] = useState(false)
    let IndexArr = 0

    const {data, loading, error, refetch} = useQuery(QUERY_SHOP_ID, {
        onCompleted: async (data) => {
        }
    })
    refetch()
    const [updateShop, {loading: loadingUpdateShop, error: errorUpdateShop}] = useMutation(UPDATE_DISTRIBUTOR_MODEL, {
        onCompleted: async (data) => {
            if (data) {
                await setInfoDisPattern({
                    ...infoDisPattern,
                    layer_depth_limit: false,
                    workforce_per_row_limit: false,
                    layer_depth: 0,
                    workforce_per_row: 0,
                    dis_system: false,
                    dis_stock: false,
                    dis_no_stock: false,
                    discountType: 'บาท'
                })
                setSuccess(true)
                setSuccess(false)
            }
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })
    const [addLayerDepthReward, {loading: loadingAddLayerDepthReward, error: errorAddLayerDepthReward}] = useMutation(ADD_LAYER_DEPTH_REWARD, {
        onCompleted: async (data) => {
        }
    })
    const [deleteLayerDepthReward, {loading: loadingDeleteLayerDepthReward, error: errorDeleteLayerDepthReward}] = useMutation(DELETE_LAYER_DEPTH_REWARD, {
        onCompleted: async (data) => {
        }
    })

    const handleChangeTypeWorkPerRow = async (value) => {
        if (value===true){
            await setInfoDisPattern({
                ...infoDisPattern,
                dis_system: value,
                layer_depth: 1,
                workforce_per_row: 2,
                layer_depth_limit: true,
                workforce_per_row_limit: true,
                dis_stock: false,
                dis_no_stock: false
            })
        } else (
            await setInfoDisPattern({
                ...infoDisPattern,
                dis_system: value,
                layer_depth: 0,
                workforce_per_row: 0,
                layer_depth_limit: false,
                workforce_per_row_limit: false,
                dis_stock: false,
                dis_no_stock: false
            })
        )
    }

    const handleChangeWorkPerRow = async (value) => {
        await setInfoDisPattern({
            ...infoDisPattern,
            workforce_per_row: value
        })

    }

    const handleChangeLayerDepth = async (value) => {
        let layerDepthArr = []
        for (let i=0; i<value; i++) {
            await layerDepthArr.push(0)
        }
        await setInfoDisPattern({
            ...infoDisPattern,
            layer_depth: value,
            discountArr: layerDepthArr
        })
    }

    const handleChangeDisStock = async (value) => {
        await setInfoDisPattern({
            ...infoDisPattern,
            dis_stock: value
        })

    }

    const handleChangeNoDisStock = async (value) => {
        await setInfoDisPattern({
            ...infoDisPattern,
            dis_no_stock: value
        })

    }

    const handleChangeWorkPerRowLimit = async (value) => {
        if (value == true) {
            await setInfoDisPattern({
                ...infoDisPattern,
                workforce_per_row_limit: value,
                workforce_per_row: 2
            })
        } else {
            await setInfoDisPattern({
                ...infoDisPattern,
                workforce_per_row_limit: value,
                workforce_per_row: -1
            })
        }
    }

    const handleChangeLayerDepthLimit = async (value) => {
        if (value == true) {
            await setInfoDisPattern({
                ...infoDisPattern,
                layer_depth_limit: value,
                layer_depth: 1
            })
    
        } else {
            let layerDepthArr = []
            await layerDepthArr.push(0)
            await setInfoDisPattern({
                ...infoDisPattern,
                layer_depth_limit: value,
                layer_depth: -1,
                discountArr: layerDepthArr
            })
    
        }
    }

    const handleChangeLayerDepthDiscountTypeReward = async (value) => {
        await setInfoDisPattern({
            ...infoDisPattern,
            discountType: value
        })
    }

    const handleChangeLayerDepthDiscountReward = async (index ,value) => {
        const newArr = infoDisPattern.discountArr
        newArr[index] = value
        await setInfoDisPattern({
            ...infoDisPattern,
            discountArr: newArr
        })
    }
    
    const onSubmit = async () => {
        try {
            // console.log(infoDisPattern)
            for(let i=0; i<data.user.shops[0].layer_depth_rewards.length; i++) {
                await deleteLayerDepthReward({
                    variables: {
                        idLayerDepthReward: data.user.shops[0].layer_depth_rewards[i].id,
                        idShop: data.user.shops[0].id
                    }
                })
            }
            for(let i=0; i<infoDisPattern.layer_depth; i++) {
                await addLayerDepthReward({
                    variables: {
                        layer: i+1,
                        type: infoDisPattern.discountType,
                        discount: infoDisPattern.discountArr[i],
                        idShop: data.user.shops[0].id
                    }
                })
            }
            await updateShop({
                variables: {
                    idShop: data.user.shops[0].id,
                    layer_depth: data.user.shops[0].layer_depth === infoDisPattern.layer_depth ? data.user.shops[0].layer_depth : +infoDisPattern.layer_depth, 
                    workforce_per_row: data.user.shops[0].workforce_per_row === infoDisPattern.workforce_per_row ? data.user.shops[0].workforce_per_row : +infoDisPattern.workforce_per_row,
                    dis_stock: data.user.shops[0].dis_stock === infoDisPattern.dis_stock ? data.user.shops[0].dis_stock : infoDisPattern.dis_stock,
                    dis_no_stock: data.user.shops[0].dis_no_stock === infoDisPattern.dis_no_stock ? data.user.shops[0].dis_no_stock : infoDisPattern.dis_no_stock,
                    dis_system: data.user.shops[0].dis_system === infoDisPattern.dis_system ? data.user.shops[0].dis_system : infoDisPattern.dis_system
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (loadingUpdateShop || loadingAddLayerDepthReward || loadingDeleteLayerDepthReward) {
        return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
    }

    if (success === true) {
		swal('ปรับแต่งรูปแบบตัวแทนเสร็จสิ้น', 'ขอให้สนุกกับการขาย', 'success');
	}

    console.log('infoDisPattern',infoDisPattern)

    return (
        <div style={{padding: '10px'}}>
           <Form layout="inline">
                <Form.Item style={{margin: '0 0 0 0 ', width: '100%'}}>
                    <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>มีระบบลูกทีมหรือตัวแทนจำหน่ายหรือไม่ :</span>
                    <Select
                        size="large"
                        style={{ width: 200 }}
                        defaultValue={infoDisPattern.dis_system == true ? 'มี' : 'ไม่มี'}
                        placeholder="มีระบบตัวแทนหรือไม่"
                        optionFilterProp="children"
                        onChange={e => {handleChangeTypeWorkPerRow(e)}}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value={true}>มี</Option>
                        <Option value={false}>ไม่มี</Option>
                    </Select>
                </Form.Item>

                {infoDisPattern && infoDisPattern.dis_system === true && (
                    <div>
                        <Form.Item style={{margin: '20px 0 0 0 ', width: '100%'}}>
                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>มีลูกทีมติดตัวได้สูงสุด :</span>
                            <Select
                                name="workforce_per_row_limit"
                                size="large"
                                style={{ width: 150 }}
                                defaultValue={infoDisPattern.workforce_per_row_limit == true ? 'จำกัดลูกทีม' : 'ไม่จำกัดลูกทีม'}
                                placeholder="มีลูกทีมติดตัวได้สูงสุด"
                                optionFilterProp="children"
                                onChange={handleChangeWorkPerRowLimit}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={true}>จำกัดลูกทีม</Option>
                                <Option value={false}>ไม่จำกัดลูกทีม</Option>
                            </Select>
                            {infoDisPattern && infoDisPattern.workforce_per_row_limit === true && (
                                <div style={{display: 'inline'}}>
                                    <span style={{margin: '0 10px 0 10px'}}>สูงสุด</span>
                                    <InputNumber 
                                        name="workforce_per_row"
                                        min={1}
                                        max={99999}
                                        defaultValue={infoDisPattern.workforce_per_row}
                                        onChange={handleChangeWorkPerRow}
                                        placeholder="โปรดใส่จำนวนลูกทีมติดตัวสูงสุด"
                                        size="large"
                                        suffix={
                                            <Popover content={contentNameRank} title="จำนวนลูกทีมติดตัว" placement="leftBottom">
                                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                            </Popover>
                                        }
                                        style={{margin: '0 10px 10px 0'}}
                                    />
                                    <span>คน/ลูกทีม 1 คน</span>
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin: '15px 0 0 0 ', width: '100%'}}>
                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>มีตัวแทนลึกลงไปได้สูงสุด :</span>
                                <Select
                                    name="layer_depth_limit"
                                    size="large"
                                    style={{ width: 150 }}
                                    defaultValue={infoDisPattern.layer_depth_limit == true ? 'จำกัดชั้นความลึก' : 'ไม่จำกัดชั้นความลึก'}
                                    placeholder="มีตัวแทนลึกลงไปได้สูงสุด"
                                    optionFilterProp="children"
                                    onChange={handleChangeLayerDepthLimit}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value={true}>จำกัดชั้นความลึก</Option>
                                    <Option value={false}>ไม่จำกัดชั้นความลึก</Option>
                                </Select>
                            {infoDisPattern && infoDisPattern.layer_depth_limit === true && 
                                (
                                    <div style={{display: 'inline'}}>
                                        <span style={{margin: '0 10px 0 10px'}}>ลึกสูงสุด</span>
                                        <InputNumber 
                                            name="layer_depth"
                                            min={1}
                                            max={99999}
                                            defaultValue={infoDisPattern.layer_depth}
                                            onChange={handleChangeLayerDepth}
                                            placeholder="โปรดใส่จำนวนชั้นลึกลงไปสูงสุด"
                                            size="large"
                                            suffix={
                                                <Popover content={contentNameRank} title="จำนวนชั้นลึกลงไปสูงสุด" placement="leftBottom">
                                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                </Popover>
                                            }
                                            style={{margin: '0 10px 10px 0'}}
                                        />
                                        <span>ชั้นนับจากคุณ</span>

                                        <Card 
                                            style={{ marginTop: 16, width: '100%' }}
                                            type="inner"
                                            title="ส่วนลดของแต่ละชั้นความลึก"
                                        >
                                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>หน่วยของส่วนลด :</span>
                                            <Select
                                                name="layer_depth_reward"
                                                size="large"
                                                style={{ width: 150 }}
                                                defaultValue={infoDisPattern.discountType == 'บาท' ? 'บาท' : 'เปอร์เซ็น'}
                                                placeholder="หน่วยส่วนลด"
                                                optionFilterProp="children"
                                                onChange={handleChangeLayerDepthDiscountTypeReward}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                <Option value='บาท'>บาท</Option>
                                                <Option value='เปอร์เซ็น'>เปอร์เซ็น</Option>
                                            </Select>
                                            {infoDisPattern && infoDisPattern.discountArr.map(e => {
                                                let index = IndexArr++
                                                return (
                                                    <div style={{display: 'block', margin: '20px 0 0 0 '}}>
                                                        <p style={{display: 'inline-flex', margin: '0 10px 0 0 '}}>ชั้นที่ {index+1} ได้รับส่วนลด :</p>
                                                        <InputNumber 
                                                            name="layer_depth_reward"
                                                            min={0}
                                                            max={99999}
                                                            value={infoDisPattern.discountArr[index]}
                                                            onChange={x => {handleChangeLayerDepthDiscountReward(index, x)}}
                                                            placeholder="โปรดใส่ส่วนลดประจำชั้น"
                                                            size="large"
                                                            suffix={
                                                                <Popover content={contentNameRank} title="จำนวนชั้นลึกลงไปสูงสุด" placement="leftBottom">
                                                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                                </Popover>
                                                            }
                                                                style={{margin: '0 10px 10px 0', display: 'inline-flex'}}
                                                            />
                                                            <p style={{display: 'inline-flex'}}>{infoDisPattern && infoDisPattern.discountType == 'บาท' ? 'THB' : '%'} /การเปิดบิล 1 ครั้ง</p>
                                                    </div>
                                                )
                                            })}
                                        </Card>
                                    </div>
                                )
                            }
                            {infoDisPattern && infoDisPattern.layer_depth_limit === false && 
                                (
                                    <div style={{display: 'inline'}}>
                                        <Card 
                                            style={{ marginTop: 16, width: '100%' }}
                                            type="inner"
                                            title="ส่วนลดของแต่ละชั้นความลึก"
                                        >
                                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>หน่วยของส่วนลด :</span>
                                            <Select
                                                name="layer_depth_reward"
                                                size="large"
                                                style={{ width: 150 }}
                                                defaultValue={infoDisPattern.discountType == 'บาท' ? 'บาท' : 'เปอร์เซ็น'}
                                                placeholder="หน่วยส่วนลด"
                                                optionFilterProp="children"
                                                onChange={handleChangeLayerDepthDiscountTypeReward}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                <Option value='บาท'>บาท</Option>
                                                <Option value='เปอร์เซ็น'>เปอร์เซ็น</Option>
                                            </Select>
                                            {infoDisPattern && infoDisPattern.discountArr.map(e => {
                                                let index = IndexArr++
                                                return (
                                                    <div style={{display: 'block', margin: '20px 0 0 0 '}}>
                                                        <p style={{display: 'inline-flex', margin: '0 10px 0 0 '}}>แต่ละชั้นจะได้รับส่วนลด :</p>
                                                        <InputNumber 
                                                            name="layer_depth_reward"
                                                            min={0}
                                                            max={99999}
                                                            value={infoDisPattern.discountArr[index]}
                                                            onChange={x => {handleChangeLayerDepthDiscountReward(index, x)}}
                                                            placeholder="โปรดใส่ส่วนลดประจำชั้น"
                                                            size="large"
                                                            suffix={
                                                                <Popover content={contentNameRank} title="จำนวนชั้นลึกลงไปสูงสุด" placement="leftBottom">
                                                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                                                </Popover>
                                                            }
                                                                style={{margin: '0 10px 10px 0', display: 'inline-flex'}}
                                                            />
                                                            <p style={{display: 'inline-flex'}}>{infoDisPattern && infoDisPattern.discountType == 'บาท' ? 'THB' : '%'} /การเปิดบิล 1 ครั้ง</p>
                                                    </div>
                                                )
                                            })}
                                        </Card>
                                    </div>
                                )
                            }
                        </Form.Item>
                        <Form.Item style={{margin: '20px 0 0 0 ', width: '100%'}}>
                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>มีตัวแทนแบบสต็อกสินค้าหรือไม่ :</span>
                            <Select
                            size="large"
                                style={{ width: 200 }}
                                defaultValue={infoDisPattern.dis_stock == true ? 'มี' : 'ไม่มี'}
                                placeholder="มีตัวแทนแบบสต็อกสินค้าหรือไม่"
                                optionFilterProp="children"
                                onChange={e => {handleChangeDisStock(e)}}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={true}>มี</Option>
                                <Option value={false}>ไม่มี</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item style={{margin: '20px 0 0 0 ', width: '100%'}}>
                            <span style={{margin: '0 10px 0 0', fontSize: '18px', fontWeight: 'normal'}}>มีตัวแทนแบบไม่สต็อกสินค้าหรือไม่ :</span>
                            <Select
                                size="large"
                                style={{ width: 200 }}
                                defaultValue={infoDisPattern.dis_no_stock == true ? 'มี' : 'ไม่มี'}
                                placeholder="มีตัวแทนแบบไม่สต็อกสินค้าหรือไม่"
                                optionFilterProp="children"
                                onChange={e => {handleChangeNoDisStock(e)}}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={true}>มี</Option>
                                <Option value={false}>ไม่มี</Option>
                            </Select>
                        </Form.Item>
                    </div>
                )}
                
                <Form.Item style={{margin: '20px 0 0 0 ', width: '100%'}}>
                    <Button 
                        size='large' 
                        style={{
                            width: '100%',
                            margin: '10px 0px 0px 0px',
                            background: 'linear-gradient(to right, #67b26b, #4ca2cb)',
                            color: 'white'
                        }}
                        onClick={onSubmit}
                    >เพิ่มระดับตัวแทน</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SettingDistributorModel