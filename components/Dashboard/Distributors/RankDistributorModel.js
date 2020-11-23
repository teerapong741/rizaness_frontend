import React, {useState} from 'react'
import {Button, Card, Drawer, Avatar, Typography} from 'antd'
import {SettingOutlined, LoadingOutlined} from '@ant-design/icons'
import gql from 'graphql-tag'
import {useMutation, useQuery} from '@apollo/react-hooks'

import AddRankDistributorModel from './AddRankDistributorModel'
import EditRankDistributorModel from './EditRankDistributorModel'
import {UPDATE_RANK_DIS_MODEL} from './EditRankDistributorModel'
import swal from 'sweetalert'

const {Text, Title} = Typography

export const QUERY_DISTRIBUTOR = gql`
	query QUERY_DISTRIBUTOR {
		user {
            id
			shops {
				id
				rank_distributors {
					id
					rank_name
					reward {
						id
						reward
						createdAt
					}
					discount
					condition {
						id
						condition
						createdAt
					}
					treatment {
						id
						treatment
						createdAt
					}
					color
					no
					icon
				}
			}
		}
	}
`

const DELETE_RANK_DIS_MODEL = gql`
    mutation DELETE_RANK_DIS_MODEL(
        $idRankDisMo: ID!,
        $idShop: ID!
    ) {
        deleteRankDistributorModel(
            idRankDisMo: $idRankDisMo,
            idShop: $idShop
        ){
            id
        }
    }
`

const DELETE_REWARD_RANK_DIS_MODEL = gql`
    mutation DELETE_REWARD_RANK_DIS_MODEL(
        $idReRank: ID!,
        $idRank: ID!
    ) {
        deleteRewardRankDisModel(
            idReRank: $idReRank,
            idRank: $idRank
        ){
            id
        }
    }
`

const DELETE_CONDITION_RANK_DIS_MODEL = gql`
    mutation DELETE_CONDITION_RANK_DIS_MODEL(
        $idConRank: ID!,
        $idRank: ID!
    ) {
        deleteConditionRankDisModel(
            idConRank: $idConRank,
            idRank: $idRank
        ){
            id
        }
    }
`

const DELETE_TREATMENT_RANK_DIS_MODEL = gql`
    mutation DELETE_TREATMENT_RANK_DIS_MODEL(
        $idTreRank: ID!,
        $idRank: ID!
    ) {
        deleteTreatmentRankDisModel(
            idTreRank: $idTreRank,
            idRank: $idRank
        ){
            id
        }
    }
`


const RankDistributorModel = () => {
    const [visibleAddDisModel, setVisibleAddDisModel] = useState(false);
    const [visibleEditDisModel, setVisibleEditDisModel] = useState(false);
    const [dataRankDis, setDataRankDis] = useState('')
    const [success, setSuccess] = useState(false)

    const {data, loading, error, refetch } = useQuery(QUERY_DISTRIBUTOR, {
		onCompleted: (data) => {
		}
	})
	refetch()
    const [deleteRankDistributorModel, {loading: loadingDeleteRank, error: errorDeleteRank}] = useMutation(DELETE_RANK_DIS_MODEL, {
        onCompleted: async (data) => {
            setSuccess(false)
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })
    const [deleteRewardRankDisModel, {loading: loadingDeleteReward, error: errorDeleteReward}] = useMutation(DELETE_REWARD_RANK_DIS_MODEL, {
        onCompleted: async (data) => {

        }
    })
    const [deleteConditionRankDisModel, {loading: loadingDeleteCondition, error: errorDeleteCondition}] = useMutation(DELETE_CONDITION_RANK_DIS_MODEL, {
        onCompleted: async (data) => {

        }
    })
    const [deleteTreatmentRankDisModel, {loading: loadingDeleteTreatment, error: errorDeleteTreatment}] = useMutation(DELETE_TREATMENT_RANK_DIS_MODEL, {
        onCompleted: async (data) => {

        }
    })

    const [updateRankDistributorModel, {loading: loadingUpdateRank, error: errorUpdateRank}] = useMutation(UPDATE_RANK_DIS_MODEL, {
        onCompleted: async (data) => {

        }
    })
    
    const handleDeleteRank = async (e) => {
        swal({
            title: "คุณต้องการลบระดับชั้นตัวแทนนี้หรือไม่?",
            text: "คุณแน่ใจแล้วใช่ไหมที่จะลบระดับตัวแทนนี้ การลบระหว่างที่มีตัวแทนจำหน่ายใช้ระดับตัวแทนอยู่อาจทำให้ร้านของคุณมีปัญหา",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
        .then(async (willDelete) => {
            if (willDelete) {
                await setSuccess(true)
                const listNoRank = data.user.shops[0].rank_distributors.filter(rank => {return rank.no > e.no})
                for (let i=0; i<listNoRank.length; i++) {
                    await updateRankDistributorModel({
                        variables: {
                            idShop: data.user.shops[0].id,
                            idRankDisMo: listNoRank[i].id,
                            icon: listNoRank[i].icon,
                            no: +listNoRank[i].no - 1,
                            rank_name: listNoRank[i].rank_name,
                            disconut: +listNoRank[i].discount,
                            color: listNoRank[i].color
                        }
                    })
                }
                for (let j=0; j< e.reward.length; j++) {
                    // console.log(data.user.shops[0].rank_distributors[i].reward[j].id)
                    await deleteRewardRankDisModel({
                        variables: {
                            idReRank: e.reward[j].id,
                            idRank: e.id
                        }
                    })
                }
                for (let j=0; j<e.condition.length; j++) {
                    // console.log(data.user.shops[0].rank_distributors[i].condition[j].id)
                    await deleteConditionRankDisModel({
                        variables: {
                            idConRank: e.condition[j].id,
                            idRank: e.id
                        }
                    })
                }
                for (let j=0; j<e.treatment.length; j++) {
                    // console.log(data.user.shops[0].rank_distributors[i].treatment[j].id)
                    await deleteTreatmentRankDisModel({
                        variables: {
                            idTreRank: e.treatment[j].id,
                            idRank: e.id
                        }
                    })
                }
                await deleteRankDistributorModel({
                    variables: {
                        idRankDisMo: e.id,
                        idShop: data.user.shops[0].id
                    }
                })
            }
        })
        // console.log('success')
    }

    const onCloseDrawerAddDisModel = () => {
		setVisibleAddDisModel(false);
	};

	const onOpenDrawerAddDisModel = () => {
		setVisibleAddDisModel(true);
    };
    
    const onCloseDrawerEditDisModel = () => {
		setVisibleEditDisModel(false);
	};

	const onOpenDrawerEditDisModel = async (data) => {
        await setDataRankDis(data);
        await setVisibleEditDisModel(true);
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
				title="เพิ่มระดับขั้นตัวแทน"
				placement="right"
				closable={false}
				onClose={onCloseDrawerAddDisModel}
				visible={visibleAddDisModel}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 20px 0px 20px'
				}}
			>
				<AddRankDistributorModel data={data}/>
			</Drawer>

            <Drawer
				title="แก้ไขระดับขั้นตัวแทน"
				placement="right"
				closable={false}
				onClose={onCloseDrawerEditDisModel}
				visible={visibleEditDisModel}
				width={720}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 20px 0px 20px'
				}}
			>
				<EditRankDistributorModel user={dataRankDis} users={data} />
			</Drawer>

            <div style={{position:'relative', width: '100%', height: '40px'}}>
                <Button 
                    style={{position:'absolute', right: '0px', 'background-color': '#33CC00'}} 
                    size="large" 
                    type="primary"
                    onClick={onOpenDrawerAddDisModel}
                >
                    เพิ่มระดับตัวแทนจำหน่าย +
                </Button>
            </div>
            <Card headStyle={{backgroundColor: 'none', fontWeight: '700', fontSize: '18px', color: 'black', textAlign: 'center'}} title="ระดับขั้นตัวแทนจำหน่าย">
                {data && data.user.shops[0].rank_distributors.length !== 0 && data.user.shops[0].rank_distributors.map(e => {
                    return(
                        <div style={{display: 'inline-flex',width: '49%', margin: '0 12px 0 0'}}>
                            <Card headStyle={{ backgroundColor: `${e.color}`, fontWeight: '700', fontSize: '18px', color: 'black'}} type="inner" title={`${e.rank_name} (ระดับที่ ${e.no})`} style={{margin: '20px 0 0 0', position: 'relative', width: '100%'}}>
                                <div style={{position: 'absolute', right: '10px'}}>
                                    <Button type="primary" style={{margin: '0 10px 0 0'}} onClick={x => {onOpenDrawerEditDisModel(e)}}>แก้ไข</Button>
                                    <Button type="primary" danger onClick={x => {handleDeleteRank(e)}} loading={success}>ลบ</Button>
                                </div>
                                <div style={{position: 'absolute', right: '10px', bottom: '10px'}}>
                                    <Avatar style={{backgroundColor: 'gray'}} size={80} src={e.icon} />
                                </div>
                                <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>สิ่งที่ได้รับจากระดับขั้น</p>
                                {e.discount !== 0 ? (<p>- ได้รับส่วนลด {e.discount}% เมื่อซื้อสินค้า</p>) : (<p>- ไม่มีส่วนลดพิเศษ</p>)}
                                {e.reward.length !== 0 ? e.reward.map(reward => {
                                    return <p>- {reward.reward}</p>
                                }) : (
                                    <p>- ไม่มีรางวัล</p>
                                )} 
                                <br/>
                                <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการเป็นตัวแทน</p>
                                {e.condition.length !== 0 ? e.condition.map(condition => {
                                    return <p>- {condition.condition}</p>
                                }) : (
                                    <p>- ไม่มีเงื่อนไข</p>
                                )}
                                <br/>
                                <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการรักษาสภาพระดับขั้น</p>
                                {e.treatment.length !== 0 ? e.treatment.map(treatment => {
                                    return <p>- {treatment.treatment}</p>
                                }) : (
                                    <p>- ไม่มีเงื่อนไขการรักษาระดับ</p>
                                )}
                            </Card>
                        </div>
                    )
                })}
                {data && data.user.shops[0].rank_distributors.length === 0 && 
                    (
                        <div style={{width: '49%', height: '100%', margin: '0 12px 0 0'}}>
                            <Card headStyle={{ backgroundColor: `gray`, fontWeight: '700', fontSize: '18px', color: 'black'}} type="inner" title={`Rank Name (ระดับที่ 0)`} style={{margin: '20px 0 0 0', position: 'relative', width: '100%'}}>
                                <div style={{position: 'absolute', right: '10px', bottom: '10px'}}>
                                    <Avatar style={{backgroundColor: 'gray'}} size={80} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                </div>
                                <Title level={3} style={{textAlign: 'center', margin: '20px 0 20px 0 '}} strong> ไม่มีระดับชั้นตัวแทนจำหน่าย </Title>
                            </Card>
                        </div>
                    )
                }
            </Card>
        </div>
    )
}

export default RankDistributorModel
