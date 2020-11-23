import React, {useState} from 'react'

const ColorSelect = [
    {color: '#000000'},
    {color: '#FFFFCC'}
]

const ListColorRank = ({rankDisMoInfo, setRankDisMoInfo,onClose}) => {
    const setColor = (e) => {
        setRankDisMoInfo({...rankDisMoInfo, color: e})
        onClose()
    }

    return (
        <div style={{padding: '10px'}}>
            <link rel="stylesheet" href="style/la_color_picker.css" />
            <p>กรุณาคลิ๊กที่สีที่ต้องการ :</p>
            {ColorSelect.map(color => {
                return(
                    <div
                        class="color-option" 
                        style={{backgroundColor: `${color.color}`, border: '1px solid black'}}
                        onClick={e => {setColor(color.color)}}
                    />
                )
            })}
        </div>
    )
}

export default ListColorRank
