"use client"

import { useState } from "react"
import { Device } from "./types"
import AddDevicePopup from "./AddDevicePopup"

type Result = {
    va: number
    batteryAh: number
    inverter: number
}

export default function LoadCalculator(){

    const [devices,setDevices] = useState<Device[]>([
        { name:"LED Bulb 5W", watt:5, qty:4 },
        { name:"Laptop", watt:45, qty:1 },
        { name:"Ceiling Fan", watt:75, qty:2 },
        { name:"Table Fan", watt:50, qty:2 },
        { name:"Room Fan", watt:250, qty:1 }
    ])

    const [showPopup,setShowPopup] = useState(false)

    const [backupHours,setBackupHours] = useState(2)

    const [consumption,setConsumption] = useState(20)

    const [result,setResult] = useState<Result | null>(null)



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


    const totalWatts = devices.reduce(
        (sum,d)=> sum + d.watt * d.qty,
        0
    )


    const calculatePlan = () => {

        const load = totalWatts

        const va = Math.ceil(load * 1.25)

        const batteryAh = Math.ceil((load * backupHours) / 12)

        const inverter = Math.max(1, Math.ceil(va / 1000))

        setResult({
            va,
            batteryAh,
            inverter
        })

    }



    return(

        <section className="py-20 bg-gray-50">

            <div className="max-w-6xl mx-auto px-4">

                {/* TITLE */}

                <div className="text-center mb-10">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Load Calculator
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Estimate inverter and battery requirements
                    </p>

                </div>


                {/* TOTAL WATTS */}

                <div className="text-center mb-6 text-lg font-medium text-gray-700">

                    Total Watts :
                    <span className="text-primary font-semibold ml-2">
{totalWatts} W
</span>

                </div>


                {/* DEVICE TABLE */}

                <div className="bg-white rounded-xl shadow border overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100 text-sm">

                        <tr>

                            <th className="p-4 text-left">Device</th>
                            <th className="p-4 text-center">Usage</th>
                            <th className="p-4 text-center">Quantity</th>
                            <th className="p-4 text-center">Total</th>

                        </tr>

                        </thead>

                        <tbody>

                        {devices.map((device,index)=>(

                            <tr key={index} className="border-t">

                                <td className="p-4 font-medium">
                                    {device.name}
                                </td>

                                <td className="p-4 text-center">
                                    {device.watt} W
                                </td>

                                <td className="p-4 text-center">

                                    <div className="flex items-center justify-center gap-2">

                                        <button
                                            onClick={()=>decreaseQty(index)}
                                            className="px-3 py-1 border rounded hover:bg-gray-100"
                                        >
                                            -
                                        </button>

                                        <span className="w-8 text-center">
{device.qty}
</span>

                                        <button
                                            onClick={()=>increaseQty(index)}
                                            className="px-3 py-1 border rounded hover:bg-gray-100"
                                        >
                                            +
                                        </button>

                                    </div>

                                </td>

                                <td className="p-4 text-center font-medium">
                                    {device.qty * device.watt} W
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                {/* ADD DEVICE */}

                <div className="mt-6">

                    <button
                        onClick={()=>setShowPopup(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                    >
                        Add Device
                    </button>

                </div>


                {/* BACKUP + CONSUMPTION */}

                <div className="grid md:grid-cols-2 gap-6 mt-10">


                    {/* BACKUP HOURS */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="font-medium mb-4">
                            Set Your Hours of Backup
                        </p>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={()=>backupHours>1 && setBackupHours(backupHours-1)}
                                className="px-4 py-1 border rounded hover:bg-gray-100"
                            >
                                -
                            </button>

                            <span className="text-lg font-semibold">
{backupHours}
</span>

                            <button
                                onClick={()=>setBackupHours(backupHours+1)}
                                className="px-4 py-1 border rounded hover:bg-gray-100"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* CONSUMPTION */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex justify-between mb-4">

                            <p className="font-medium">
                                Average Consumption
                            </p>

                            <span className="font-semibold">
{consumption}%
</span>

                        </div>

                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={consumption}
                            onChange={(e)=>setConsumption(Number(e.target.value))}
                            className="w-full"
                        />

                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>20%</span>
                            <span>100%</span>
                        </div>

                    </div>

                </div>


                {/* PLAN BUTTON */}

                <div className="text-center mt-10">

                    <button
                        onClick={calculatePlan}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium shadow"
                    >
                        Lets Plan
                    </button>

                </div>


                {/* RESULT */}

                {result && (

                    <div className="mt-10 text-center bg-white border shadow rounded-xl p-6 max-w-xl mx-auto">

                        <p className="text-lg font-semibold mb-3">

                            Total Capacity : {result.va} VA , {result.batteryAh} Ah

                        </p>

                        <p className="text-gray-700">

                            {result.inverter} x Inverter Required
                            (Minimum {result.va} VA)

                        </p>

                        <p className="text-gray-700 mt-1">

                            1 x Battery Required
                            (Minimum {Math.ceil(result.batteryAh * 1.7)} Ah)

                        </p>

                    </div>

                )}

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