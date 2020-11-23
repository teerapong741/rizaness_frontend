import React, {useState} from 'react'
import {Card, Form, Button, Input, Space, Upload, Modal} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

const AddRewardRankDisModel = ({rankDisMoInfo, setRankDisMoInfo}) => {

    return (
        <Card
            style={{ marginTop: 16, width: '100%' }}
            type="inner"
            title="รางวัล (ถ้ามี)"
            // extra={<a href="#">Close</a>}
        >
            <Form.List name='AddReward'>
                {(fields, {add, remove}) => {
                    return(
                        <div>
                            {fields.map(field => {
                                console.log('field.key',field.key)
                                console.log('field.fieldKey',field.fieldKey)
                                return (
                                        <Space key={field.key} style={{display: 'flex', margin: '8px 0 0 0', width: '100%', position: 'relative'}} align='start'>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'img']}
                                                fieldKey={[field.fieldKey, 'img']}
                                            >
                                                <Button
                                                    style={{width: '100%', height: '40px'}}
                                                    name="img"
                                                    onChange={(e) => {
                                                        let newArrReward = [
                                                            ...rankDisMoInfo.reward
                                                        ];
                                                        newArrReward[
                                                            field.fieldKey
                                                        ] = e.target.value;
                                                        setRankDisMoInfo({
                                                            ...rankDisMoInfo,
                                                            reward: newArrReward
                                                        });
                                                    }}
                                                >ใส่รูปรางวัล (ถ้ามี)</Button>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'reward']}
                                                fieldKey={[field.fieldKey, 'reward']}
                                                rules={[{required: true, message: 'Missing reward name'}]}
                                            >
                                                <Input 
                                                    placeholder="รางวัล" 
                                                    style={{width: '250%', height: '40px'}}
                                                    name="reward"
                                                    onChange={(e) => {
                                                        let newArrReward = [
                                                            ...rankDisMoInfo.reward
                                                        ];
                                                        newArrReward[
                                                            field.fieldKey
                                                        ] = e.target.value;
                                                        setRankDisMoInfo({
                                                            ...rankDisMoInfo,
                                                            reward: newArrReward
                                                        });
                                                    }}
                                                />
                                            </Form.Item>

                                            <MinusCircleOutlined 
                                                style={{position: 'absolute', right: 10, top: 15}}
                                                size='large'
                                                onClick={() => {
                                                    remove(field.name)
                                                    let newArr = [
                                                        ...rankDisMoInfo.reward
                                                    ];

                                                    newArr[
                                                        field.fieldKey
                                                    ] = null;

                                                    setRankDisMoInfo({
                                                        ...rankDisMoInfo,
                                                        reward: newArr
                                                    });
                                                }}
                                            />
                                        </Space>
                                    )
                            })}

                            <Form.Item>
                                <Button
                                    type='dashed'
                                    onClick={() =>  {
                                        add()
                                    }}
                                    style={{margin: '10px 0 0 0', width: '100%'}}
                                >
                                    <PlusOutlined /> เพิ่มรางวัล
                                </Button>
                            </Form.Item>
                        </div>
                    )
                }}
            </Form.List>
        </Card>
    )
}

export default AddRewardRankDisModel
