"use client"

import { devicesList } from "./devices"
import { Device } from "./types"

type Props = {
    onAdd:(device:Device)=>void
    onClose:()=>void
}

export default function AddDevicePopup({onAdd,onClose}:Props){

    return(

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 w-[600px] max-h-[80vh] overflow-y-auto rounded">

                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Add Device
                </h2>

                <div className="grid grid-cols-2 gap-3">

                    {devicesList.map((device,index)=>(
                        <button
                            key={index}
                            className="border p-2 rounded hover:bg-gray-100 text-left"
                            onClick={()=>{

                                onAdd({
                                    name:device.name,
                                    watt:device.watt,
                                    qty:1
                                })

                            }}
                        >
                            {device.name}
                        </button>
                    ))}

                </div>

                <div className="mt-6 text-center">

                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}