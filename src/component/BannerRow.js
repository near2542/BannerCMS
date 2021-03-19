import React,{useState} from 'react'
import axios from 'axios'
import {bannerEndpoint} from '../config/endpoint'
import Editor from './editor'
let prefixURL = bannerEndpoint
export default function BannerRow({data,handleRefresh}) {
    const [edit, SetEdit] = useState(false)
    const handleDelete = async (id) => {
        const banners = {
            'id': id,
        }
        console.log(banners)
        const { data } = await axios.delete(prefixURL + '/upload/content/'+id);
        await handleRefresh();
     
    }
    const { id, titlethoutput, orderno, isiframe, content,featured_image_src ,url,isguru} = data
    return (
        <>
            <tr className="border hover:bg-gray-400 text-center" onClick={() => console.log('test')}>
                <td className="border-4 ">{orderno}</td>
                <td className="border-4  text-left">{titlethoutput}</td>
                <td className="border-4 "><img src={`${featured_image_src}`} className="previewImage" /></td>
                <td className="border-4 ">
                    <a className="cursor-pointer action" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        SetEdit(true);
                    }
                    }>Edit</a>
                </td>
                <td className="border-4 ">
                    <a className="cursor-pointer action" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(id);
                    }
                    }>Delete</a>
                </td>
            </tr>
            {edit && <Editor content={content} featured_image_src={featured_image_src} orderNO={orderno} id={id} titleTHOutput={titlethoutput} 
            url={url} isiframe={isiframe}  setShow={SetEdit} isGuru={isguru} handleRefresh={handleRefresh}/> }
        </>
    )
}
