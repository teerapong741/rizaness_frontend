import React, {useState} from 'react'
import {Input, Popover, Drawer, Button, Form, Upload, Modal, Typography, Empty} from 'antd'
import {InfoCircleOutlined, PlusOutlined, LoadingOutlined} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import gql from 'graphql-tag'
import fetch from 'isomorphic-unfetch';
import swal from 'sweetalert';
import {useMutation} from '@apollo/react-hooks'

import ListColorRank from './ListColorRank'
import AddTreatmentRankDisModel from './AddTreatmentRankDisModel';
import AddRewardRankDisModel from './AddRewardRankDisModel';
import AddConditionRankDisModel from './AddConditionRankDisModel';
import PreviewDemoDisRankModel from './PreviewDemoDisRankModel';
import {ADD_CON_RANK_DIS_MODEL, ADD_TREAT_RANK_DIS_MODEL, ADD_RE_RANK_DIS_MODEL} from './AddRankDistributorModel'
import {QUERY_DISTRIBUTOR} from './RankDistributorModel'

const { Text } = Typography;

const contentNameRank = (
  <div>
    <p>ชื่อของระดับที่กำลังจะสร้างนี้</p>
  </div>
);

const contentNoRank = (
    <span>ลำดับของระดับนี้ยิ่งลำดับมีค่ามากก็ยิ่งอยู่ในระดับที่สูงมาก เช่น
        <br/>- ลำดับที่ 1 Standard **ระดับเริ่มต้น
        <br/>- ลำดับที่ 2 Gold **ระดับมีความสำคัญที่สูงกว่า Standard
    </span>
)

const contentDiscountRank = (
    <span>ส่วนลดจะถูกนำไปเพิ่มให้กับตัวแทนของระดับชั้นนี้ เช่น
        <br/>- ตัวแทน A มีส่วนลดจากลำดับชั้น 3% และส่วนลดจากระดับชั้น Standard 2% รวมเป็น 5% 
        <br/>- แต่เมื่อตัวแทน A เลื่อนระดับชั้นมาเป็น Gold ส่วนลดจากระดับชั้น Standard 2% จะถูกลบไปแต่จะได้รับส่วนลดจากระดับชั้น Gold 3% แทน รวมเป็น 6%
    </span>
)

const contentColorRank = (
    <span>สีประจำระดับคือสีเพื่อแสดงระดับนั้น ๆ ให้ดูง่ายขึ้น</span>
)

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

export const UPDATE_RANK_DIS_MODEL = gql`
    mutation UPDATE_RANK_DIS_MODEL(
        $idShop: ID!
		$idRankDisMo: ID!
		$icon: String
		$no: Int
		$rank_name: String
		$discount: Float
		$color: String
    ) {
        updateRankDistributorModel(
            idShop: $idShop,
            idRankDisMo: $idRankDisMo,
            icon: $icon,
            no: $no,
            rank_name: $rank_name,
            discount: $discount,
            color: $color
        ) {
            id
        }
    }
`
export const UPDATE_REWARD_RANK_DIS_MODEL = gql`
    mutation UPDATE_REWARD_RANK_DIS_MODEL(
        $idRank: ID!
		$idReRank: ID!
		$reward: String!
		$img: String
    ) {
        updateRewardRankDisModel(
            idRank: $idRank
            idReRank: $idReRank
            reward: $reward
            img: $img
        ) {
           id 
        }
    }
`
export const UPDATE_CONDITION_RANK_DIS_MODEL = gql`
    mutation UPDATE_CONDITION_RANK_DIS_MODEL(
        $idRank: ID!
		$idConRank: ID!
		$condition: String!
		$img: String
    ) {
        updateConditionRankDisModel(
            idRank: $idRank
            idConRank: $idConRank
            condition: $condition
            img: $img
        ) {
            id
        }
    }
`
export const UPDATE_TREATMENT_RANK_DIS_MODEL = gql`
    mutation UPDATE_TREATMENT_RANK_DIS_MODEL(
        $idRank: ID!
		$idTreRank: ID!
		$treatment: String!
		$img: String
    ) {
       updateTreatmentRankDisModel(
        idRank: $idRank
		idTreRank: $idTreRank
		treatment: $treatment
		img: $img
       ) {
            id
        }
    }
`


const EditRankDistributorModel = ({user, users}) => {
    const [visibleAddDisModel, setVisibleAddDisModel] = useState(false);
    const [visibleDemoDisModel, setVisibleDemoDisModel] = useState(false);
    const [success, setSuccess] = useState(false)
    const [rankDisMoInfo, setRankDisMoInfo] = useState({
        icon: "",
        rank_name: "",
        no: null,
        discount: null,
        color: "#FFFFFF",
        reward: [],
        condition: [],
        treatment: []
    })
    const [fileList, setFileList] = useState([]);
    const [stateImg, setStateImg] = useState({
		previewVisible: false,
		previewImage: '',
		previewTitle: ''
	});
    const { previewVisible, previewImage, previewTitle } = stateImg;

    const [updateRankDistributorModel, {loading: loadingUpdateRank, error: errorUpdateRank}] = useMutation(UPDATE_RANK_DIS_MODEL, {
        onCompleted: async (data) => {
             
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })
    const [updateRewardRankDisModel, {loading: loadingUpdateReward, error: errorUpdateReward}] = useMutation(UPDATE_REWARD_RANK_DIS_MODEL, {
        onCompleted: async (data) => {
             
        }
    })
    const [updateConditionRankDisModel, {loading: loadingUpdateCondition, error: errorUpdateCondition}] = useMutation(UPDATE_CONDITION_RANK_DIS_MODEL, {
        onCompleted: async (data) => {
             
        }
    })
    const [updateTreatmentRankDisModel, {loading: loadingUpdateTreatment, error: errorUpdateTreatment}] = useMutation(UPDATE_TREATMENT_RANK_DIS_MODEL, {
        onCompleted: async (data) => {
             
        }
    })

    const [addRewardRankDisModel, {loading: loadingReward, error: errorReward}] = useMutation(ADD_RE_RANK_DIS_MODEL, {
        onCompleted: (data) => {
            if(data) {
                console.log('reward')
            }
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })
    const [addConditionRankDisModel, {loading: loadingCondition, error: errorCondition}] = useMutation(ADD_CON_RANK_DIS_MODEL, {
        onCompleted: (data) => {
            if(data) {
                console.log('condition')
            }
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })
    const [addTreatmentRankDisModel, {loading: loadingTreatment, error: errorTreatment}] = useMutation(ADD_TREAT_RANK_DIS_MODEL, {
        onCompleted: (data) => {
            if(data) {
                console.log('treatment')
            }
        },
        refetchQueries: [{query: QUERY_DISTRIBUTOR}],
        awaitRefetchQueries: true
    })

    const onCloseDrawerAddDisModel = () => {
        setVisibleAddDisModel(false);
	};
	const onOpenDrawerAddDisModel = () => {
        setVisibleAddDisModel(true);
    };

    const onCloseDrawerDemoDisModel = () => {
        setVisibleDemoDisModel(false);
	};
	const onOpenDrawerDemoDisModel = () => {
        setVisibleDemoDisModel(true);
    };

    const handleChangeValue = (e) => {
        setRankDisMoInfo({
            ...rankDisMoInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeColor = (e) => {
        setRankDisMoInfo({...rankDisMoInfo, color: e.target.value})
    }

    const uploadButton = (
		<div>
			<PlusOutlined />
			<div className="ant-upload-text">อัพโหลด</div>
		</div>
	);

    const handleUploadImgPreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setStateImg({
			previewImage: file.url || file.preview,
			previewVisible: true,
			previewTitle:
				file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
		});
	};
    const handleUploadeImgCancel = () => {
		setStateImg({ previewVisible: false });
	};
	const handleChangeUploadImgPro = async ({ fileList: newFileList }) => {
        const x = await setFileList(newFileList);
        await setRankDisMoInfo({...rankDisMoInfo, icon: newFileList})
    };

    const onSubmit = async () => {
        try {
            if (fileList !== undefined) {
                const url = await uploadFiles()
            }
            const listNoRank = await users.user.shops[0].rank_distributors.filter(rank => {
                if (rankDisMoInfo.no !== "" &&  rankDisMoInfo !== null) {
                    if (rankDisMoInfo.no < user.no) {
                        return rank.no < user.no && rank.no >= rankDisMoInfo.no && rank.id !== user.id 
                    }
                    if (rankDisMoInfo.no > user.no) {
                        return rank.no > user.no && rank.no <= rankDisMoInfo.no  && rank.id !== user.id
                    }
                } 
                // else {
                //     console.log("false")
                //     return rank.no >= user.no && rank.id !== user.id
                // }
            })
            // console.log(listNoRank)
            if (rankDisMoInfo.no !== "" &&  rankDisMoInfo !== null) {
                if (rankDisMoInfo.no < user.no) {
                    for (let i=0; i<listNoRank.length; i++) {
                        // console.log(`no${listNoRank[i].no} -> no${listNoRank[i].no + 1}`)
                        let updateRankDismo = await updateRankDistributorModel({
                            variables: {
                                idShop: users.user.shops[0].id,
                                idRankDisMo: listNoRank[i].id,
                                icon: listNoRank[i].icon,
                                no: +listNoRank[i].no + 1,
                                rank_name: listNoRank[i].rank_name,
                                disconut: +listNoRank[i].discount,
                                color: listNoRank[i].color
                            }
                        })
                    }
                }
                if (rankDisMoInfo.no > user.no) {
                    for (let i=0; i<listNoRank.length; i++) {
                        if (listNoRank[i].no <= rankDisMoInfo.no && listNoRank[i].no >= user.no) {
                            // console.log(`no${listNoRank[i].no} -> no${listNoRank[i].no - 1}`)
                            let updateRankDismo = await updateRankDistributorModel({
                                variables: {
                                    idShop: users.user.shops[0].id,
                                    idRankDisMo: listNoRank[i].id,
                                    icon: listNoRank[i].icon,
                                    no: +listNoRank[i].no - 1,
                                    rank_name: listNoRank[i].rank_name,
                                    disconut: +listNoRank[i].discount,
                                    color: listNoRank[i].color
                                }
                            })
                        }
                    }
                }
            } 
            
            const updateRankDismo = await updateRankDistributorModel({
                variables: {
                    idShop: users.user.shops[0].id,
                    idRankDisMo: user.id,
                    rank_name: rankDisMoInfo.rank_name !== null && rankDisMoInfo.rank_name !== null ? rankDisMoInfo.rank_name : user.rank_name,
                    icon: rankDisMoInfo.icon !== null && rankDisMoInfo.icon !== "" ? rankDisMoInfo.icon : user.icon,
                    no: rankDisMoInfo.no == null || rankDisMoInfo.no == "" ? +user.no : +rankDisMoInfo.no,
                    discount: rankDisMoInfo.discount == null || rankDisMoInfo.discount == "" ? +user.discount : +rankDisMoInfo.discount,
                    color: !!rankDisMoInfo.color ? rankDisMoInfo.color : user.color
                }
            })

            const reward = await rankDisMoInfo.reward.filter(re => {return re !== null && re !== undefined && re !== Empty})
            if (reward) {
                for (let i=0; i<reward.length; i++) {
                    await addRewardRankDisModel({
                        variables: {
                            idRank: user.id.toString(),
                            // img: "",
                            reward: reward[i]
                        }
                    })
                }
            }
            

            const condition = await rankDisMoInfo.condition.filter(con => {return con !== null && con !== undefined && con !== Empty})
            if (condition && condition !== undefined) {
                for (let i=0; i<condition.length; i++) {
                    await addConditionRankDisModel({
                        variables: {
                            idRank: user.id.toString(),
                            // img: "",
                            condition: condition[i]
                        }
                    })
                }
            }

            const treatment = await rankDisMoInfo.treatment.filter(tre => {return tre !== null && tre !== undefined && tre !== Empty})
            if (treatment) {
                for (let i=0; i<treatment.length; i++) {
                    await addTreatmentRankDisModel({
                        variables: {
                            idRank: user.id.toString(),
                            // img: "",
                            treatment: treatment[i]
                        }
                    })
                }
            }

            await setRankDisMoInfo({
                icon: "",
                rank_name: "",
                no: null,
                discount: null,
                color: "#FFFFFF",
                reward: [],
                condition: [],
                treatment: []
            })
            await setFileList([])
            await setStateImg({
                previewVisible: false,
                previewImage: '',
                previewTitle: ''
            })
            await setSuccess(true)
            await setSuccess(false)
        }catch (error) {
            console.log(error)
        }
    }

    const uploadFiles = async () => {
		let secure_url;
		for (let i = 0; i < fileList.length; i++) {
			const data = new FormData();
			data.append('file', fileList[i].originFileObj);
			data.append('upload_preset', 'rizaness-test');
			const res = await fetch(
				'https://api.cloudinary.com/v1_1/automedia/image/upload',
				{
					method: 'post',
					body: data
				}
			);
			const result = await res.json();
			secure_url = await result.secure_url;
			rankDisMoInfo.icon = secure_url;
		}
		return secure_url;
    };
    
    if (loadingUpdateRank || loadingUpdateReward || loadingUpdateCondition || loadingUpdateTreatment || loadingReward || loadingCondition || loadingTreatment) {
		return (
			<p style={{ textAlign: 'center', marginTop: '200px' }}>
				<LoadingOutlined style={{ fontSize: '200px' }} />
				<p style={{ fontSize: '50px', fontWeight: 'bold' }}>Loading</p>
			</p>
		);
    }

    if (success === true) {
		swal('แก้ไขระดับชั้นตัวแทนจำหน่ายเสร็จสิ้น', 'ขอให้สนุกกับการขาย', 'success');
	}

    console.log('Rank Info-->',rankDisMoInfo)
    // console.log('stateImg-->',stateImg)
    // console.log('fileList-->',fileList)

    return (
        <div style={{padding: '10px'}}>
             <Drawer
				title="เลือกสีระดับชั้น"
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
				<ListColorRank rankDisMoInfo={rankDisMoInfo} setRankDisMoInfo={setRankDisMoInfo} onClose={onCloseDrawerAddDisModel}/>
			</Drawer>

            <Drawer
				title="ดูตัวอย่างผลลัพธ์"
				placement="right"
				closable={false}
				onClose={onCloseDrawerDemoDisModel}
				visible={visibleDemoDisModel}
				width={800}
				bodyStyle={{
					fontSize: '18px',
					fontWeight: '500',
					padding: '0px 20px 0px 20px'
				}}
			>
                <PreviewDemoDisRankModel onClose={onCloseDrawerDemoDisModel} rankDisMoInfo={rankDisMoInfo} user={user}/>
			</Drawer>

            <Form layout="inline">
                <Form.Item>
                    <Input 
                        name="rank_name"
                        value={rankDisMoInfo.rank_name}
                        onChange={handleChangeValue}
                        placeholder="ชื่อระดับ"
                        size="large"
                        suffix={
                            <Popover content={contentNameRank} title="ชื่อของระดับชั้นที่จะแก้ไข" placement="leftBottom">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Popover>
                        }
                        style={{margin: '0 0 10px 0'}}
                    />
                    <Input 
                        name="no"
                        value={rankDisMoInfo.no}
                        onChange={handleChangeValue}
                        placeholder="ใส่ลำดับที่ของระดับชั้นนี้ (ใส่เลขทับระดับเก่าได้เลย เลขเก่าจะถูกขยับลำดับที่อัตโนมัติ)"
                        size="large"
                        suffix={
                            <Popover content={contentNoRank} title="ลำดับความสำคัญของลำดับชั้น" placement="leftBottom">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Popover>
                        }
                        style={{margin: '0 0 10px 0'}}
                    />
                    <Input 
                        name="discount"
                        value={rankDisMoInfo.discount}
                        onChange={handleChangeValue}
                        placeholder="ใส่ส่วนลดของระดับชั้นนี้ (หน่วยเป็น %) **ถ้ามี"
                        size="large"
                        suffix={
                            <Popover content={contentDiscountRank} title="ส่วนลดสำหรับระดับนี้" placement="leftBottom">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Popover>
                        }
                        style={{margin: '0 0 10px 0'}}
                    />
                </Form.Item>
                
                <Form.Item >
                    <Button
                        size="large"
                        onClick={onOpenDrawerAddDisModel}
                        value={rankDisMoInfo.color}
                        style={{margin: '0 0 10px 0', backgroundColor: `${rankDisMoInfo.color}`}}
                    >
                        คลิ๊กเลือกสีของระดับชั้นนี้
                    </Button>
                    <span style={{margin: '0 20px 0 20px'}}>หรือ</span>
                    <Input
                        placeholder="ใส่รหัสสีของระดับชั้นนี้ **ถ้ามี"
                        size="large"
                        value={rankDisMoInfo.color}
                        onChange={handleChangeColor}
                        suffix={
                            <Popover content={contentColorRank} title="สีประจำระดับ" placement="leftBottom">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Popover>
                        }
                        style={{margin: '0 0 10px 0', width: '405px'}}
                    />
                </Form.Item>

                <Form.Item >
                    <ImgCrop style={{display: 'inline'}} rotate>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handleUploadImgPreview}
                            onChange={handleChangeUploadImgPro}
                        >
                            {fileList != null && fileList.length >= 1
                                ? null
                                : uploadButton}
                        </Upload>
                    </ImgCrop>
                    <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={handleUploadeImgCancel}
                    >
                        <img
                            alt="example"
                            style={{ width: '100%' }}
                            src={previewImage}
                        />
                    </Modal>
                </Form.Item>
                            <Text style={{display: 'inline', margin: '50px 10px 0 0'}}>เลือกไอคอนประจำระดับตัวแทน (ถ้ามี) : {fileList.length === 0 ? null : fileList[0].name}</Text>
                
                {/* <AddRewardRankDisModel rankDisMoInfo={rankDisMoInfo} setRankDisMoInfo={setRankDisMoInfo}/>
                <AddConditionRankDisModel rankDisMoInfo={rankDisMoInfo} setRankDisMoInfo={setRankDisMoInfo}/>
                <AddTreatmentRankDisModel rankDisMoInfo={rankDisMoInfo} setRankDisMoInfo={setRankDisMoInfo}/> */}

                <Form.Item style={{margin: '20px 0 0 0 ', width: '100%'}}>
                    <Button size='large' style={{width: '100%'}} onClick={onOpenDrawerDemoDisModel}>ดูตัวอย่าง</Button>
                    <Button
                        size='large'
                        htmlType="submit"
                        style={{
                            width: '100%',
                            margin: '10px 0px 0px 0px',
                            background: 'linear-gradient(to right, #67b26b, #4ca2cb)',
                            color: 'white'
                        }}
                        onClick={onSubmit}
					>แก้ไขระดับตัวแทน</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default EditRankDistributorModel
