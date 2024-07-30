import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import axios from "axios";
import {
    DashboardGenParams,
    GetWebSocket,
    Root,
    WORKFLOW,
    NUKKI_WORKFLOW,
    IMAGETO3D_WORKFLOW,
    ADVANCEDIMAGE_WORKFLOW,
    imageToImageGenParams,
    clientId,
    VIDEO_WORKLOW
} from "./api";

interface DataContextProps {
    fetchCheckpoints: () => Promise<string[][]>;
    queuePrompt: (params: DashboardGenParams) => Promise<any>;
    removeNukkiPrompt: (inputImage: string) => Promise<any>;
    advancedImagePrompt: (params: imageToImageGenParams) => Promise<any>;
    imageTo3dPrompt: (inputImage: string) => Promise<any>;
    createVideoPrompt: (inputImage: string, inputAudio: string) => Promise<any>; 
    uploadImage: (file: File) => Promise<string>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

const fetchCheckpoints = async () => {
    // Implement your API fetching logic here
    return axios.get<Root>('object_info/CheckpointLoaderSimple', {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        return res.data.CheckpointLoaderSimple.input.required.ckpt_name;
    })
};

export const ComfyProvider: React.FC<DataProviderProps> = ({ children }) => {
    useEffect(() => {
        GetWebSocket()
    }, []);
    const queuePrompt = async (params: DashboardGenParams) => {
        console.log(params)
        WORKFLOW["3"].inputs.seed =  params.seed
        WORKFLOW["3"].inputs.cfg =  params.cfg
        WORKFLOW["3"].inputs.steps =  params.steps
        WORKFLOW["4"].inputs.ckpt_name =  params.checkpoint
        WORKFLOW["5"].inputs.height =  params.height
        WORKFLOW["5"].inputs.width =  params.width
        WORKFLOW["6"].inputs.text =  params.positivePrompt
        WORKFLOW["7"].inputs.text =  params.negativePrompt
        const data = { 'prompt': WORKFLOW, 'client_id': clientId};

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    const removeNukkiPrompt = async (filename: string) => {
        const data = { 'prompt': NUKKI_WORKFLOW, 'client_id': clientId};
        NUKKI_WORKFLOW["29"].inputs.image =  filename

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    const advancedImagePrompt = async (params: imageToImageGenParams) => {
        const data = { 'prompt': ADVANCEDIMAGE_WORKFLOW, 'client_id': clientId};
        ADVANCEDIMAGE_WORKFLOW["122"].inputs.image =  params.filename
        ADVANCEDIMAGE_WORKFLOW["6"].inputs.text =  params.positivePrompt
        ADVANCEDIMAGE_WORKFLOW["7"].inputs.text =  params.negativePrompt

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    const imageTo3dPrompt = async (filename: string) => {
        const data = { 'prompt': IMAGETO3D_WORKFLOW, 'client_id': clientId};
        IMAGETO3D_WORKFLOW["2"].inputs.image =  filename

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    const createVideoPrompt = async (inputImage: string, inputAudio: string) => {
        const data = { 'prompt': VIDEO_WORKLOW, 'client_id': clientId};
        VIDEO_WORKLOW["2"].inputs.image =  inputImage
        VIDEO_WORKLOW["1"].inputs.audio =  inputAudio

        const response = await fetch('/prompt', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    const uploadImage = async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/upload/image', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        return response.json();
    };

    return (
        <DataContext.Provider value={{fetchCheckpoints ,queuePrompt, removeNukkiPrompt, advancedImagePrompt, imageTo3dPrompt, createVideoPrompt, uploadImage}}>
            {children}
        </DataContext.Provider>
    );
};

export const useComfy = (): DataContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
