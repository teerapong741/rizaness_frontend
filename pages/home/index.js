import React, {useContext} from 'react'
import {Input,Button, Typography} from 'antd'
import {ImportOutlined} from '@ant-design/icons'
import { AuthContext } from '../../appState/AuthProvider';

const {Title} = Typography

const HomePage = () => {
    const { signout } = useContext(AuthContext);

    return (
        <div style={{textAlign: 'center', position: 'relative'}}>
            <Title style={{margin: '100px 0 0  0'}}>สมัครตัวแทนจำหน่าย</Title>
            <Input placeholder="ใส่รหัสโค๊ดของร้านที่ต้องการเป็นตัวแทนจำหน่าย" size="large" style={{width: '370px'}}/>
            <br/>
            <Button type="primary" style={{width: '370px', margin: '20px 0 0 0 '}}>สมัครตัวแทน</Button>
            <br/>
            <Button type="primary" danger icon={<ImportOutlined/>} onClick={signout} style={{width: '370px', margin: '20px 0 0 0 '}}>Logout</Button>
            
        </div>
    )
}

export default HomePage
