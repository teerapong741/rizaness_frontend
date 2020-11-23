import React from 'react'
import {Card, Form, Button, Input, Space} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'

const AddTreatmentRankDisModel = ({rankDisMoInfo, setRankDisMoInfo}) => {
    return (
        <Card
            style={{ marginTop: 16, width: '100%' }}
            type="inner"
            title="เงื่อนไขเพื่อรักษาระดับชั้น (ถ้ามี)"
            // extra={<a href="#">Close</a>}
        >
            <Form.List name='AddTreatment'>
                {(fields, {add, remove}) => {
                    return(
                        <div>
                            {fields.map(field => (
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
                                                let newArrTreatment = [
                                                    ...rankDisMoInfo.treatment
                                                ];
                                                newArrTreatment[
                                                    field.fieldKey
                                                ] = e.target.value;
                                                setRankDisMoInfo({
                                                    ...rankDisMoInfo,
                                                    treatment: newArrTreatment
                                                });
                                            }}
                                        >ใส่รูปรางวัล (ถ้ามี)</Button>
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'treatment']}
                                        fieldKey={[field.fieldKey, 'treatment']}
                                        rules={[{required: true, message: 'Missing treatment name'}]}
                                    >
                                        <Input 
                                            placeholder="เงื่อนไข" 
                                            style={{width: '250%', height: '40px'}}
                                            name="treatment"
                                            onChange={(e) => {
                                                let newArrTreatment = [
                                                    ...rankDisMoInfo.treatment
                                                ];
                                                newArrTreatment[
                                                    field.fieldKey
                                                ] = e.target.value;
                                                setRankDisMoInfo({
                                                    ...rankDisMoInfo,
                                                    treatment: newArrTreatment
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
                                                ...rankDisMoInfo.treatment
                                            ];

                                            newArr[
                                                field.fieldKey
                                            ] = null;

                                            setRankDisMoInfo({
                                                ...rankDisMoInfo,
                                                treatment: newArr
                                            });
                                        }}
                                    />
                                </Space>
                            ))}

                            <Form.Item>
                                <Button
                                    type='dashed'
                                    onClick={() =>  {
                                        add()
                                    }}
                                    style={{margin: '10px 0 0 0', width: '100%'}}
                                >
                                    <PlusOutlined /> เพิ่มเงื่อนไข
                                </Button>
                            </Form.Item>
                        </div>
                    )
                }}
            </Form.List>
        </Card>
    )
}

export default AddTreatmentRankDisModel
