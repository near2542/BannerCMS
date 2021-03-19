import React, { useState,useEffect } from 'react'
import BannerRow from './BannerRow'
import axios from 'axios'
import Editor from './editor'
import './BannerCMS.css';
import {bannerEndpoint} from '../config/endpoint'
let prefixURL = bannerEndpoint

export default function Dashboard()  {
    const [create, OnCreate] = useState(false);
    const [curData,setData] = useState([])

    useEffect( ()=>
    {
        const getInitalData = async() =>
        {
            const {data} = await axios.get(prefixURL+`/banners/cms?timestamp=${Date.now()}`,{
                headers:{
                    'Cache-Control' : 'no-store',
                    'Pragma' :'no-cache'
                }
            })
            setData(data);
        }
        getInitalData()
    },[])


 
    const handleRefresh = async () =>
    {   
        const banners = await axios.get(prefixURL+`/banners/cms?timestamp=${Date.now()}`,{
            headers:{
                'Cache-Control' : 'no-store',
                'Pragma' :'no-cache'
            }
        });
        console.log('--------------')
        console.log(banners.data);
        console.log('--------------')
        await setData(banners.data)
        console.log('---set data')
      
    }
    return (
        <div className="relative">
            <div className="wrapper">
                <h1 >BannerCMS</h1>
                {curData.length>0? (
                    <>
                <table className="w-4/5 mt-16 table-banner mx-auto border wrapper">
                    <thead>
                    <tr className="border">
                        <th className="title">Banner No.</th>
                        <th className="border name">Banner Banner Name</th>
                        <th className="border picture">Picture</th>
                        <th className="border action" colSpan={2} >Action</th></tr>
                        </thead>
                        <tbody>
                    {curData.map(banner => <BannerRow key={banner.id} handleRefresh={handleRefresh} data={banner} />) }
                    {create && <Editor content={``} featured_image_src={null} orderNO={``} titleTHOutput={``} url={``} isiframe={false} id={null} setShow={OnCreate}
                    isGuru={false} handleRefresh={handleRefresh}/>}
                    </tbody>
                  
                </table><div className="btn-wrapper"><a href="#" target="__blank" className="btn-create mt-4 ml-auto border-2 p-4 rounded-lg bg-blue-400 text-white"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    OnCreate(!create);
                }
            }>Create New Banner</a></div></>): "Loading"}
                
                
                
            </div>
        </div>
    )
}
