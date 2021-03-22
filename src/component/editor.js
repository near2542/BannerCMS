
import React, { Component, useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import {bannerEndpoint as prefixURL} from '../config/endpoint'
import CheckType,{resolveType} from './checkType'
import Button from '@material-ui/core/Button'
function Editor({ content = null, featured_image_src = null, orderNO = null, titleTHOutput = null, url = null, isiframe = false, id = null ,setShow,isGuru,handleRefresh}) {
    const [newContent, SetContent] = useState(content);
    const [picture, setPicture] = useState(featured_image_src || 'No file selected');
    const [isIframe, setIframe] = useState(isiframe);
    const [newURL, setURL] = useState(url)
    const [order, setOrder] = useState(orderNO)
    const [Guru, SetisGuru] = useState(isGuru)

    const [Choice,NewChoice] = useState(CheckType(isIframe,isGuru));
    
    console.log('mounted')
    let whiteSpaceHandle = '.text-only,.text-card-text{white-space: pre;}.rich-text-paragraph{min-height: 15px;}'
    const [title, setTitle] = useState(titleTHOutput || '')
    const getPreviewImage = async (e) => {
        if(!e.target.files[0]) return;
        
            const form = new FormData()
            form.append('previewImage', e.target.files[0]) 
            const { data } = await axios.post(prefixURL + '/upload/previewImage',
                form,
                {
                    'headers': {
                        'content-type': 'multipart/form-data'
                    }
                }
            )
            if (!data.uploaded) alert('upload not success not work')
            else {
                setPicture(data.url)
            }
        

    }

    const handleUpload = async () => {
       let [isIframe,Guru] = resolveType(Choice)
        const banners = {
            'id': id,
            'title': title,
            'image': picture,
            'order': order? order : 999,
            'isIframe': isIframe,
            'content': newContent,
            'isguru':Guru,
            'url': newURL
        }
        const { data } = await axios.post(prefixURL + '/upload/content',banners
        );
        await handleRefresh();
        setShow(false)
        // if(data.status === 'success') '<script>alert("success!")</script>';
        // else '<script>alert("failed!")</script>'
    }

    // const handleDelete = async (id) => {
    //     const banners = {
    //         'id': id,
    //     }
    //     console.log(banners)
    //     const { data } = await axios.delete(prefixURL + '/upload/content/'+id);
    //     await handleRefresh();
    //     if(data.status === 'success') '<script>alert("success!")</script>';
    //     else '<script>alert("failed!")</script>'
    // }
   

    return (
        <div className="editor-wrapper">
        <div className=" CkEditor text-black h-auto  z-30  top-0 overflow-auto  py-8 my-4 w-3/4 bg-gray-200  mx-auto px-8 absolute bg-transparent "
        >
            <span className="absolute top-0 right-0 px-4 text-2xl font-bold opacity-100 close"><a href="#" onClick={(e)=>{console.log('test'); e.preventDefault(); setShow(false)}}>
            X
            </a></span>
            <div className="w-3/4 mx-auto overflow-auto content  ">
                <div className="input-groups">
                <label className="  sm:block   ">Header: <input type="text" name="title" placeholder="test" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white px-4 text-xl" />
                </label>
                </div>
                <div className="text-2xl sm:block mt-4 relative input-groups fileupload-groups ">
                    <input
                        type="file"
                        name="previewImage"
                        placeholder="test"
                        accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff"
                        onChange={(e) => { getPreviewImage(e); }}
                        className="focus:outline-none focus:ring focus:border-blue-300 opacity-0 relative uploadfile" />
                    <div className="top-0 left-0"><a href="#" className="text-blue-400 border hover:text-blue-200 rounded-lg px-2">
                        Click here to upload file:</a> <span className="">{picture.split('/').pop().substring(0,20)}</span></div>
                </div>
                {picture !== 'No file selected' ?
                    (<div id="preview" className="w-1/4 h-auto ml-10 mb-4 input-groups">
                        <img className="w-auto h-auto preViewimg" src={`${picture}`} />
                    </div>
                    ) : null}
                <div className="m-auto flex justify-items-center align-items-center input-groups">
                    <label className="mt-3 inline-flex items-center cursor-pointer pr-4">
                        Banner Action On Click:
                        <select className="px-4" value={Choice} name="URL" onChange={(e)=>NewChoice(e.target.value)}>
                            <option value="modal">Text Banner (Modal)</option>
                            <option value="iframe">URL Banner</option>
                            <option value="external">External URL</option>
                        </select>
                    </label>
                </div>
                <div className="mb-4 input-groups">
                    <label className="mt-3 inline-flex items-center cursor-pointer pr-4">Input Order Number: <input type="number" className="ml-4 px-4"
                    value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    /></label>
                </div>
                <div className="mb-4 input-groups">
                    <label className="sm:block   ">URL: <input type="text" name="title" placeholder="test" value={newURL}
                        onChange={(e) => setURL(e.target.value)}
                        className="bg-white px-4 text-xl" />
                    </label>
                </div>
                <CKEditor
                    className="editor"
                    editor={ClassicEditor}
                    config={
                        {
                            ckfinder:
                            {
                                uploadUrl: prefixURL + '/upload/'
                            },
                            removePlugins: ['ImageCaption'],
                        }
                    }

                    data={newContent || ``}
                    onReady={editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                        let data = editor.getData();
                        let cleanedData =  data.replace(whiteSpaceHandle,'')
                        SetContent(cleanedData);
                        data = null
                        cleanedData = null
                        console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                />
                {/* <Button type="button" variant="contained" color="primary">Save</Button> */}
                <button type="button" className="bg-white border-none rounded-md mt-4 py-2 px-4 float-right " onClick={(e) => { e.preventDefault(); handleUpload() }} >Save</button>
            </div>
        </div>
        </div>
    );

}



export default Editor;
