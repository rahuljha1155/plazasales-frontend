"use client"

import { useState } from "react"
import { Device } from "./types"
import AddDevicePopup from "./AddDevicePopup"

export default function LoadCalculator(){

    const [devices,setDevices] = useState<Device[]>([
        { name:"LED Bulb 5W", watt:5, qty:4 },
        { name:"Laptop", watt:45, qty:1 },
        { name:"Ceiling Fan", watt:75, qty:2 }
    ])

    const [showPopup,setShowPopup] = useState(false)

    const [backupHours,setBackupHours] = useState(2)

    const [consumption,setConsumption] = useState(20)

    const increaseQty=(index:number)=>{

        const updated=[...devices]
        updated[index].qty+=1
        setDevices(updated)

    }

    const decreaseQty=(index:number)=>{

        const updated=[...devices]

        if(updated[index].qty>0){

            updated[index].qty-=1
            setDevices(updated)

        }

    }

    const addDevice=(device:Device)=>{

        setDevices([...devices,device])
        setShowPopup(false)

    }

    const totalWatts=devices.reduce(
        (sum,d)=>sum + d.watt * d.qty,
        0
    )

    return(

        <section className="py-16 bg-gray-50">

            <div className="max-w-6xl mx-auto px-4">

                <h2 className="text-3xl font-semibold text-center mb-8">
                    Load Calculator
                </h2>

                <p className="text-center mb-6 font-medium">
                    Total Watts: {totalWatts} W
                </p>

                <div className="border rounded overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>
                            <th className="p-3 text-left">Device</th>
                            <th className="p-3">Usage</th>
                            <th className="p-3">Qty</th>
                            <th className="p-3">Total</th>
                        </tr>

                        </thead>

                        <tbody>

                        {devices.map((device,index)=>(

                            <tr key={index} className="border-t">

                                <td className="p-3">{device.name}</td>

                                <td className="p-3">{device.watt}W</td>

                                <td className="p-3">

                                    <button
                                        onClick={()=>decreaseQty(index)}
                                        className="px-2 border"
                                    >
                                        -
                                    </button>

                                    <span className="px-3">
{device.qty}
</span>

                                    <button
                                        onClick={()=>increaseQty(index)}
                                        className="px-2 border"
                                    >
                                        +
                                    </button>

                                </td>

                                <td className="p-3">
                                    {device.qty * device.watt}W
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

                <div className="mt-6">

                    <button
                        onClick={()=>setShowPopup(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add Device
                    </button>

                </div>

                <div className="mt-10 flex gap-10">

                    <div>

                        <p className="mb-2 font-medium">
                            Backup Hours
                        </p>

                        <button
                            onClick={()=>setBackupHours(backupHours-1)}
                            className="border px-3"
                        >
                            -
                        </button>

                        <span className="px-3">
{backupHours}
</span>

                        <button
                            onClick={()=>setBackupHours(backupHours+1)}
                            className="border px-3"
                        >
                            +
                        </button>

                    </div>

                    <div>

                        <p className="mb-2 font-medium">
                            Average Consumption {consumption}%
                        </p>

                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={consumption}
                            onChange={(e)=>setConsumption(Number(e.target.value))}
                        />

                    </div>

                </div>

                <div className="mt-10 text-center">

                    <button className="bg-green-600 text-white px-6 py-2 rounded">
                        Lets Plan
                    </button>

                </div>

            </div>

            {showPopup && (
                <AddDevicePopup
                    onAdd={addDevice}
                    onClose={()=>setShowPopup(false)}
                />
            )}

        </section>

    )

}