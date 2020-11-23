import React from 'react'
import {Card, Avatar, Button} from 'antd'

const PreviewDemoDisRankModel = ({rankDisMoInfo, onClose, user, setRankDisMoInfo}) => {
    var icon = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    var rank_name = "Rank Name"
    var color = "#FFFFFF"
    var no = 0
    var discount = 0
    if (user) {
        icon = user.icon
        rank_name = user.rank_name
        color = user.color
        no = user.no
        discount = user.discount
    }
    if (rankDisMoInfo.icon.length !== 0) {
        icon = rankDisMoInfo.icon[0].thumbUrl
    }
     
    const reward = rankDisMoInfo.reward.filter((re) => {return re !== undefined && re !== null})
    const condition = rankDisMoInfo.condition.filter(con => {return con !== undefined && con !== null})
    const treatment = rankDisMoInfo.treatment.filter(treat => {return treat !== undefined && treat !== null})

    // console.log('rankDisMoInfo.reward', rankDisMoInfo.reward)
    // console.log('reward', reward)
    // console.log('condition', condition)
    // console.log('treatment', treatment)

    return (
        <Card 
            headStyle={{ backgroundColor: `${rankDisMoInfo.color.trim() == "" ? color : rankDisMoInfo.color}`, fontWeight: '700', fontSize: '18px', color: 'black'}} 
            type="inner" 
            title={`${rankDisMoInfo.rank_name === "" ? rank_name : rankDisMoInfo.rank_name} (ระดับที่ ${rankDisMoInfo.no === null || rankDisMoInfo.no === "" ? no : rankDisMoInfo.no})`} 
            style={{margin: '20px 0 0 0', position: 'relative', width: '100%'}}
        >
            <div style={{position: 'absolute', right: '10px', bottom: '10px'}}>
                <Avatar style={{backgroundColor: 'gray'}} size={80} src={icon} />
            </div>
            <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>สิ่งที่ได้รับจากระดับขั้น</p>
            {rankDisMoInfo.discount !== 0 && rankDisMoInfo.discount !== "" && rankDisMoInfo.discount !== null
                ? (<p>- ได้รับส่วนลด {rankDisMoInfo.discount}% เมื่อซื้อสินค้า</p>) 
                : (<p>{discount !== 0 && discount.trim() !== "" && discount !== null  
                    ? (<p>- ได้รับส่วนลด {discount}% เมื่อซื้อสินค้า</p>) 
                    : (<p>- ไม่มีส่วนลดพิเศษ</p>)}</p>)}
            {reward.length !== 0 ? reward.map(reward => {
                return <p>- {reward}</p>
            }) : (
                <p>{reward.length !== 0 ? reward.map(reward => {
                    return <p>- {reward}</p>
                }) : <p>- ไม่มีรางวัล</p>}</p>
            )} 
            <br/>
            <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการเป็นตัวแทน</p>
            {condition.length !== 0 ? condition.map(condition => {
                return <p>- {condition}</p>
            }) : (
                <p>{condition.length !== 0 ? condition.map(condition => {
                    return <p>- {condition}</p>
                }) : <p>- ไม่มีรางวัล</p>}</p>
            )} 
            <br/>
            <p style={{color: 'black', fontSize: '13px', fontWeight: 'bold'}}>เงื่อนไขการรักษาสภาพระดับขั้น</p>
            {treatment.length !== 0 ? treatment.map(treatment => {
                return <p>- {treatment}</p>
            }) : (
                <p>{treatment.length !== 0 ? treatment.map(treatment => {
                    return <p>- {treatment}</p>
                }) : <p>- ไม่มีรางวัล</p>}</p>
            )} 
        </Card>
    )
}

export default PreviewDemoDisRankModel
