import React, {useState} from 'react'
import {List, Avatar, Tabs, Collapse, Button} from 'antd'
import { event } from 'jquery';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const RequestDistributor = () => {
    const [key, setKey] = useState('1'); 
    const [colorRead, setColorRead] = useState("#DCDCDC")
    const [colorNotRead, setColorNotRead] = useState("#F5F5F5")
    let TotalPrice = []

    function callback(key, item) {
        setKey(key)
        item.statusRead = true
    }

    const data = [
        {
            id: 0,
            imageUrl: 'https://www.vec.go.th/Portals/0/Users/226/42/47842/15.jpg?ver=2563-04-19-133957-183',
            fname: 'Nat',
            lname: 'Tanchotchuang',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'sakanomakeit@gmal.com',
            packetSelect: 'Diamond',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 0,
            typeRequest: 'apply_dis'
        },
        {
            id: 1,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRedZ-8EmuNjXQr6jzVyhom8UV2TMzlABW8MA&usqp=CAU',
            fname: 'Jimmy',
            lname: 'NAja',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'jimmy@gmal.com',
            packetSelect: 'Platinum',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 0,
            typeRequest: 'apply_dis'
        },
        {
            id: 2,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSziuWr1LoE_IQGInrE1HRrP6j8jCGYY9hhHQ&usqp=CAU',
            fname: 'sky',
            lname: 'nahee',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'nahee@gmal.com',
            packetSelect: 'Standard',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 1,
            typeRequest: 'apply_dis'
        },
        {
            id: 3,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQY36CoXI2xA57vl3O_3WzUxWjnJk4GyuaWlg&usqp=CAU',
            fname: 'It',
            lname: 'Tidhee',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'it@gmal.com',
            packetSelect: 'Platinum',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 2 ,
            typeRequest: 'apply_dis'
        },
        {
            id: 4,
            imageUrl: 'https://www.vec.go.th/Portals/0/Users/226/42/47842/15.jpg?ver=2563-04-19-133957-183',
            fname: 'Nat',
            lname: 'Tanchotchuang',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'sakanomakeit@gmal.com',
            packetSelect: 'Diamond',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 0,
            typeRequest: 'apply_dis'
        },
        {
            id: 5,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRedZ-8EmuNjXQr6jzVyhom8UV2TMzlABW8MA&usqp=CAU',
            fname: 'Jimmy',
            lname: 'NAja',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'jimmy@gmal.com',
            packetSelect: 'Platinum',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 0,
            typeRequest: 'req_level_up'
        },
        {
            id: 6,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSziuWr1LoE_IQGInrE1HRrP6j8jCGYY9hhHQ&usqp=CAU',
            fname: 'sky',
            lname: 'nahee',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'nahee@gmal.com',
            packetSelect: 'Standard',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 1,
            typeRequest: 'req_transfer'
        },
        {
            id: 7,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQY36CoXI2xA57vl3O_3WzUxWjnJk4GyuaWlg&usqp=CAU',
            fname: 'It',
            lname: 'Tidhee',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'it@gmal.com',
            packetSelect: 'Platinum',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 2 ,
            typeRequest: 'req_transfer'
        },
        {
            id: 8,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQY36CoXI2xA57vl3O_3WzUxWjnJk4GyuaWlg&usqp=CAU',
            fname: 'It',
            lname: 'Tidhee',
            createdAt: '19/10/2020 18:00AM',
            age: '21',
            tel: '0932342011',
            email: 'it@gmal.com',
            packetSelect: 'Platinum',
            message: 'อยากเป็นจัง',
            bill: [
                {
                    id: 0,
                    price: 500
                },
                {
                    id: 1,
                    price: 2000
                },
                {
                    id: 2,
                    price: 1500
                }
            ],
            statusAccept: 2 ,
            typeRequest: 'req_resign'
        },

    ];

    if (data) {
        for (let i=0; i<data.length; i++){
            let price = 0
            for(let j=0; j<data[i].bill.length; j++){
                price += data[i].bill[j].price 
            }
            TotalPrice.push(price)
        }
    }

    return (
        <div>
            <Tabs
					defaultActiveKey={key}
					type="card"
					onChange={(e) =>{ 
						setKey({key: e.key})
					}}
				>
					<TabPane tab="คำขอเป็นตัวแทน" key="1">
						<List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => {
                                return (
                                    <div>
                                        {item.typeRequest == 'apply_dis' && (
                                            <Collapse 
                                                onChange={async (e) => {
                                                    await callback(e, item)
                                                }} 
                                                style={{backgroundColor: `${item.statusAccept !== 0 ? colorRead : colorNotRead}`}}
                                            >
                                                <Panel 
                                                    header={
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar shape="square" src={item.imageUrl} />}
                                                                title={
                                                                    <div style={{position: 'relative'}}>
                                                                        <p>{item.fname} {item.lname} {item.statusAccept == 0 && <span>(รออนุมัติ)</span>}{item.statusAccept == 1 && <span style={{color: 'green'}}>(อนุมัติเรียบร้อย)</span>}{item.statusAccept == 2 && <span style={{color: 'red'}}>(ไม่อนุมัติ)</span>}</p>
                                                                        <p style={{position: 'absolute',top: 0, right: 10}}>{item.createdAt}</p>
                                                                    </div>
                                                                }
                                                            />
                                                        
                                                        </List.Item>
                                                    } 
                                                    key={item.id}
                                                >
                                                    <div style={{position: 'relative'}}>
                                                        <span>ชื่อผู้ส่งคำขอ: {data[item.id].fname} {data[item.id].lname}</span>
                                                        <br/><span>อายุ: {data[item.id].age}</span>
                                                        <br/><span>เบอร์มือถือ: {data[item.id].tel}</span>
                                                        <br/><span>Email: {data[item.id].email}</span>
                                                        <br/><span>ระดับขั้นที่สมัคร: <span style={{color: "#FFD700"}}>{data[item.id].packetSelect}</span></span>
                                                        <br/><span>ราคาซื้อรวม: {TotalPrice[item.id]} THB</span><br/>
                                                        <Collapse style={{margin: '10px 0 0 0 '}}>
                                                            <Panel header="ประวัติการสั่งซื้อ">
                                                                <span>{item.bill.map(b => {
                                                                    return (
                                                                        <div>
                                                                            <p>ราคา: {b.price}</p>
                                                                            <p>รายการสั่งซื้อ: เสื้อยืดคอปกสีดำ 1 ตัว </p>
                                                                            <p>วันที่สั่งซื้อ: 18/5/2019 12:45PM</p>
                                                                            <hr></hr>
                                                                        </div>
                                                                    )
                                                                })}</span>
                                                            </Panel>
                                                        </Collapse>
                                                        {item.statusAccept == 0 && (
                                                            <div style={{margin: '10px 0 50px 0 ', position: 'relative'}}>
                                                                <div style={{margin: '10px 0 0 0 ', position: 'absolute', right: 0}}>
                                                                    <div>
                                                                        <Button type="primary">อนุมัติ</Button> <Button type="primary" danger>ไม่อนุมัติ</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Avatar shape="square" style={{position: 'absolute', right: 0, top: 0, width: '120px', height: '120px'}} src={data[item.id].imageUrl} />
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        )}
                                    </div>
                                )
                            }}
                        />
					</TabPane>
					<TabPane tab="คำขอเลื่อนระดับขั้น" key="2">
						<List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => {
                                return (
                                    <div>
                                        {item.typeRequest == 'req_level_up' && (
                                            <Collapse 
                                                onChange={async (e) => {
                                                    await callback(e, item)
                                                }} 
                                                style={{backgroundColor: `${item.statusAccept !== 0 ? colorRead : colorNotRead}`}}
                                            >
                                                <Panel 
                                                    header={
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar shape="square" src={item.imageUrl} />}
                                                                title={
                                                                    <div style={{position: 'relative'}}>
                                                                        <p>{item.fname} {item.lname} {item.statusAccept == 0 && <span>(รออนุมัติ)</span>}{item.statusAccept == 1 && <span style={{color: 'green'}}>(อนุมัติเรียบร้อย)</span>}{item.statusAccept == 2 && <span style={{color: 'red'}}>(ไม่อนุมัติ)</span>}</p>
                                                                        <p style={{position: 'absolute',top: 0, right: 10}}>{item.createdAt}</p>
                                                                    </div>
                                                                }
                                                            />
                                                        
                                                        </List.Item>
                                                    } 
                                                    key={item.id}
                                                >
                                                    <div style={{position: 'relative'}}>
                                                        <span>ชื่อผู้ส่งคำขอ: {data[item.id].fname} {data[item.id].lname}</span>
                                                        <br/><span>อายุ: {data[item.id].age}</span>
                                                        <br/><span>เบอร์มือถือ: {data[item.id].tel}</span>
                                                        <br/><span>Email: {data[item.id].email}</span>
                                                        <br/><span>ระดับขั้นที่สมัคร: <span style={{color: "#FFD700"}}>{data[item.id].packetSelect}</span></span>
                                                        <br/><span>ราคาซื้อรวม: {TotalPrice[item.id]} THB</span><br/>
                                                        <Collapse style={{margin: '10px 0 0 0 '}}>
                                                            <Panel header="ประวัติการสั่งซื้อ">
                                                                <span>{item.bill.map(b => {
                                                                    return (
                                                                        <div>
                                                                            <p>ราคา: {b.price}</p>
                                                                            <p>รายการสั่งซื้อ: เสื้อยืดคอปกสีดำ 1 ตัว </p>
                                                                            <p>วันที่สั่งซื้อ: 18/5/2019 12:45PM</p>
                                                                            <hr></hr>
                                                                        </div>
                                                                    )
                                                                })}</span>
                                                            </Panel>
                                                        </Collapse>
                                                        {item.statusAccept == 0 && (
                                                            <div style={{margin: '10px 0 50px 0 ', position: 'relative'}}>
                                                                <div style={{margin: '10px 0 0 0 ', position: 'absolute', right: 0}}>
                                                                    <div>
                                                                        <Button type="primary">อนุมัติ</Button> <Button type="primary" danger>ไม่อนุมัติ</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Avatar shape="square" style={{position: 'absolute', right: 0, top: 0, width: '120px', height: '120px'}} src={data[item.id].imageUrl} />
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        )}
                                    </div>
                                )
                            }}
                        />
					</TabPane>
					<TabPane tab="คำขอย้ายสายงาน" key="3">
						<List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => {
                                return (
                                    <div>
                                        {item.typeRequest == 'req_transfer' && (
                                            <Collapse 
                                                onChange={async (e) => {
                                                    await callback(e, item)
                                                }} 
                                                style={{backgroundColor: `${item.statusAccept !== 0 ? colorRead : colorNotRead}`}}
                                            >
                                                <Panel 
                                                    header={
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar shape="square" src={item.imageUrl} />}
                                                                title={
                                                                    <div style={{position: 'relative'}}>
                                                                        <p>{item.fname} {item.lname} {item.statusAccept == 0 && <span>(รออนุมัติ)</span>}{item.statusAccept == 1 && <span style={{color: 'green'}}>(อนุมัติเรียบร้อย)</span>}{item.statusAccept == 2 && <span style={{color: 'red'}}>(ไม่อนุมัติ)</span>}</p>
                                                                        <p style={{position: 'absolute',top: 0, right: 10}}>{item.createdAt}</p>
                                                                    </div>
                                                                }
                                                            />
                                                        
                                                        </List.Item>
                                                    } 
                                                    key={item.id}
                                                >
                                                    <div style={{position: 'relative'}}>
                                                        <span>ชื่อผู้ส่งคำขอ: {data[item.id].fname} {data[item.id].lname}</span>
                                                        <br/><span>อายุ: {data[item.id].age}</span>
                                                        <br/><span>เบอร์มือถือ: {data[item.id].tel}</span>
                                                        <br/><span>Email: {data[item.id].email}</span>
                                                        <br/><span>ระดับขั้นที่สมัคร: <span style={{color: "#FFD700"}}>{data[item.id].packetSelect}</span></span>
                                                        <br/><span>ราคาซื้อรวม: {TotalPrice[item.id]} THB</span><br/>
                                                        <Collapse style={{margin: '10px 0 0 0 '}}>
                                                            <Panel header="ประวัติการสั่งซื้อ">
                                                                <span>{item.bill.map(b => {
                                                                    return (
                                                                        <div>
                                                                            <p>ราคา: {b.price}</p>
                                                                            <p>รายการสั่งซื้อ: เสื้อยืดคอปกสีดำ 1 ตัว </p>
                                                                            <p>วันที่สั่งซื้อ: 18/5/2019 12:45PM</p>
                                                                            <hr></hr>
                                                                        </div>
                                                                    )
                                                                })}</span>
                                                            </Panel>
                                                        </Collapse>
                                                        {item.statusAccept == 0 && (
                                                            <div style={{margin: '10px 0 50px 0 ', position: 'relative'}}>
                                                                <div style={{margin: '10px 0 0 0 ', position: 'absolute', right: 0}}>
                                                                    <div>
                                                                        <Button type="primary">อนุมัติ</Button> <Button type="primary" danger>ไม่อนุมัติ</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Avatar shape="square" style={{position: 'absolute', right: 0, top: 0, width: '120px', height: '120px'}} src={data[item.id].imageUrl} />
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        )}
                                    </div>
                                )
                            }}
                        />
					</TabPane>
                    <TabPane tab="คำขอลาออก" key="4">
						<List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => {
                                return (
                                    <div>
                                        {item.typeRequest == 'req_resign' && (
                                            <Collapse 
                                                onChange={async (e) => {
                                                    await callback(e, item)
                                                }} 
                                                style={{backgroundColor: `${item.statusAccept !== 0 ? colorRead : colorNotRead}`}}
                                            >
                                                <Panel 
                                                    header={
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar shape="square" src={item.imageUrl} />}
                                                                title={
                                                                    <div style={{position: 'relative'}}>
                                                                        <p>{item.fname} {item.lname} {item.statusAccept == 0 && <span>(รออนุมัติ)</span>}{item.statusAccept == 1 && <span style={{color: 'green'}}>(อนุมัติเรียบร้อย)</span>}{item.statusAccept == 2 && <span style={{color: 'red'}}>(ไม่อนุมัติ)</span>}</p>
                                                                        <p style={{position: 'absolute',top: 0, right: 10}}>{item.createdAt}</p>
                                                                    </div>
                                                                }
                                                            />
                                                        
                                                        </List.Item>
                                                    } 
                                                    key={item.id}
                                                >
                                                    <div style={{position: 'relative'}}>
                                                        <span>ชื่อผู้ส่งคำขอ: {data[item.id].fname} {data[item.id].lname}</span>
                                                        <br/><span>อายุ: {data[item.id].age}</span>
                                                        <br/><span>เบอร์มือถือ: {data[item.id].tel}</span>
                                                        <br/><span>Email: {data[item.id].email}</span>
                                                        <br/><span>ระดับขั้นที่สมัคร: <span style={{color: "#FFD700"}}>{data[item.id].packetSelect}</span></span>
                                                        <br/><span>ราคาซื้อรวม: {TotalPrice[item.id]} THB</span><br/>
                                                        <Collapse style={{margin: '10px 0 0 0 '}}>
                                                            <Panel header="ประวัติการสั่งซื้อ">
                                                                <span>{item.bill.map(b => {
                                                                    return (
                                                                        <div>
                                                                            <p>ราคา: {b.price}</p>
                                                                            <p>รายการสั่งซื้อ: เสื้อยืดคอปกสีดำ 1 ตัว </p>
                                                                            <p>วันที่สั่งซื้อ: 18/5/2019 12:45PM</p>
                                                                            <hr></hr>
                                                                        </div>
                                                                    )
                                                                })}</span>
                                                            </Panel>
                                                        </Collapse>
                                                        {item.statusAccept == 0 && (
                                                            <div style={{margin: '10px 0 50px 0 ', position: 'relative'}}>
                                                                <div style={{margin: '10px 0 0 0 ', position: 'absolute', right: 0}}>
                                                                    <div>
                                                                        <Button type="primary">อนุมัติ</Button> <Button type="primary" danger>ไม่อนุมัติ</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <Avatar shape="square" style={{position: 'absolute', right: 0, top: 0, width: '120px', height: '120px'}} src={data[item.id].imageUrl} />
                                                    </div>
                                                </Panel>
                                            </Collapse>
                                        )}
                                    </div>
                                )
                            }}
                        />
					</TabPane>
				</Tabs>
        </div>
    )
}

export default RequestDistributor
