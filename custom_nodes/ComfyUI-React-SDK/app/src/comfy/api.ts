import { v4 as uuidv4 } from 'uuid';

export const WS_MESSAGE_TYPE_EXECUTING="executing"
export const WS_MESSAGE_TYPE_EXECUTED="executed"
export const WS_MESSAGE_TYPE_STATUS="status"
export const WS_MESSAGE_TYPE_PROGRESS="progress"
export const WS_MESSAGE_TYPE_EXECUTION_START="execution_start"
export const WS_MESSAGE_TYPE_EXECUTION_CACHED="execution_cached"

interface Callbacks {
    [key: string]: (message: any) => void;
}
const subscribers: Callbacks = {}

let webseocket: WebSocket
export const clientId = uuidv4();

export function Subscribe(key: string, callback:(message: any) => void){
    subscribers[key] = callback
}

export function UnSubscribe(key: string){
    delete subscribers[key];
}
export function GetWebSocket(){
    if (webseocket) {
        return webseocket
    }
    let { hostname, port } = window.location;

    if(process.env.NODE_ENV === "development"){ // temp fix until more normal way to proxy web socket.
        hostname = "localhost"
        port = "8188"
    }

    webseocket = new WebSocket("ws://"+hostname+":"+port+`/ws?clientId=${clientId}`);
    // Define event handlers for the WebSocket connection
    webseocket.onopen = () => {
        console.log('WebSocket connected');
    };

    webseocket.onmessage = (event) =>{
        Object.entries(subscribers).forEach(([key, callback]) => {
            callback(event); // Call the function
        });
    }

    webseocket.onclose = () => {
        console.log('WebSocket disconnected');
    };
    return webseocket
}

export interface DashboardGenParams {
    cfg: number
    steps: number
    seed: number
    checkpoint: string
    height: number
    width: number
    positivePrompt: string
    negativePrompt: string
}

export interface imageToImageGenParams {
    filename: string
    positivePrompt: string
    negativePrompt: string
}

export interface Root {
    CheckpointLoaderSimple: CheckpointLoaderSimple
}

export interface Input {
    required: Required
}

export interface Required {
    ckpt_name: string[][]
}

export interface CheckpointLoaderSimple {
    input: Input
    output: string[]
    output_is_list: boolean[]
    output_name: string[]
    name: string
    display_name: string
    description: string
    category: string
    output_node: boolean
}

// #This is the ComfyUI api prompt format.
//
//     #If you want it for a specific workflow you can "enable dev mode options"
// #in the settings of the UI (gear beside the "Queue Size: ") this will enable
// #a button on the UI to save workflows in api format.
//
//     #keep in mind ComfyUI is pre alpha software so this format will change a bit.
//
//     #this is the one for the default workflow
export const WORKFLOW =
    {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "cfg": 3,
                "denoise": 1,
                "latent_image": [
                    "5",
                    0
                ],
                "model": [
                    "4",
                    0
                ],
                "negative": [
                    "7",
                    0
                ],
                "positive": [
                    "6",
                    0
                ],
                "sampler_name": "euler",
                "scheduler": "normal",
                "seed": Math.round(Math.random()*100000),
                "steps": 5
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": "DreamShaperXL_Turbo_v2_1.safetensors"
            }
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "batch_size": 1,
                "height": 1024,
                "width": 1024
            }
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": [
                    "4",
                    1
                ],
                "text": "masterpiece best quality fish"
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": [
                    "4",
                    1
                ],
                "text": "bad hands"
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": [
                    "3",
                    0
                ],
                "vae": [
                    "4",
                    2
                ]
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": "ComfyUI",
                "images": [
                    "8",
                    0
                ]
            }
        }
    };
export const NUKKI_WORKFLOW =
    {"10":{"inputs":{"rembg_session":["15",0],"image":["29",0]},"class_type":"ImageRemoveBackground+"},"15":{"inputs":{"model":"u2net: general purpose","providers":"CPU"},"class_type":"RemBGSession+"},"28":{"inputs":{"filename_prefix":"ComfyUI","images":["10",0]},"class_type":"SaveImage"},"29":{"inputs":{"image":"cat.png","upload":"image"},"class_type":"LoadImage"}}
export const IMAGETO3D_WORKFLOW =
    {
        "1":{"inputs":{"model":"model.ckpt","chunk_size":8192},"class_type":"TripoSRModelLoader"},
        "2":{"inputs":{"image":"ComfyUI_00018_.png","upload":"image"},"class_type":"LoadImage"},
        "3":{"inputs":{"geometry_resolution":512,"threshold":25,"model":["1",0],"reference_image":["10",0],"reference_mask":["10",1]},"class_type":"TripoSRSampler"},
        "4":{"inputs":{"preview3d":null,"mesh":["3",0]},"class_type":"TripoSRViewer"},
        "10":{"inputs":{"rembg_session":["11",0],"image":["2",0]},"class_type":"ImageRemoveBackground+"},
        "11":{"inputs":{"model":"u2net: general purpose","providers":"CPU"},"class_type":"RemBGSession+"}
    }
export const ADVANCEDIMAGE_WORKFLOW =
    {"4":{"inputs":{"ckpt_name":"realcartoonXL_v6.safetensors"},"class_type":"CheckpointLoaderSimple"},"6":{"inputs":{"text":"game illustration of a can coke","clip":["68",1]},"class_type":"CLIPTextEncode"},"7":{"inputs":{"text":"blurry, noisy, messy, lowres, jpeg, artifacts, ill, distorted, malformed, nsfw, nude","clip":["68",1]},"class_type":"CLIPTextEncode"},"37":{"inputs":{"seed":708271151329109,"steps":4,"cfg":1,"sampler_name":"dpmpp_2m_sde","scheduler":"sgm_uniform","denoise":0.78,"model":["68",0],"positive":["6",0],"negative":["7",0],"latent_image":["90",0]},"class_type":"KSampler"},"38":{"inputs":{"samples":["37",0],"vae":["4",2]},"class_type":"VAEDecode"},"68":{"inputs":{"lora_name":"sdxl_lightning_8step_lora.safetensors","strength_model":1,"strength_clip":1,"model":["4",0],"clip":["4",1]},"class_type":"LoraLoader"},"90":{"inputs":{"pixels":["91",0],"vae":["4",2]},"class_type":"VAEEncode"},"91":{"inputs":{"upscale_method":"nearest-exact","width":1024,"height":1024,"crop":"disabled","image":["122",0]},"class_type":"ImageScale"},"122":{"inputs":{"image":"cat.png","upload":"image"},"class_type":"LoadImage"},"123":{"inputs":{"filename_prefix":"ComfyUI","images":["38",0]},"class_type":"SaveImage"}}
export const VIDEO_WORKLOW =
{
    "1": {
      "inputs": {
        "audio": "hello.mp3",
        "style_clip": "W011_front_neutral_level1_001.mat",
        "pose": "RichardShelby_front_neutral_level1_001.mat",
        "cfg_scale": 1,
        "max_gen_len": 1000,
        "img_crop": true,
        "image": [
          "2",
          0
        ]
      },
      "class_type": "DD_DreamTalk",
      "_meta": {
        "title": "Dream Talk"
      }
    },
    "2": {
      "inputs": {
        "image": "ComfyUI_00011_.png",
        "upload": "image"
      },
      "class_type": "LoadImage",
      "_meta": {
        "title": "Load Image"
      }
    },
    "4": {
      "inputs": {
        "frame_rate": 25,
        "loop_count": 0,
        "filename_prefix": "DREAM",
        "format": "video/h264-mp4",
        "pix_fmt": "yuv420p",
        "crf": 19,
        "save_metadata": true,
        "pingpong": false,
        "save_output": true,
        "images": [
          "6",
          0
        ],
        "audio": [
          "5",
          0
        ]
      },
      "class_type": "VHS_VideoCombine",
      "_meta": {
        "title": "Video Combine 🎥🅥🅗🅢"
      }
    },
    "5": {
      "inputs": {
        "audio_file": [
          "1",
          3
        ],
        "seek_seconds": 0
      },
      "class_type": "VHS_LoadAudio",
      "_meta": {
        "title": "Load Audio (Path)🎥🅥🅗🅢"
      }
    },
    "6": {
      "inputs": {
        "facedetection": "retinaface_resnet50",
        "model": "GFPGANv1.4.pth",
        "visibility": 0.8,
        "codeformer_weight": 0.5,
        "image": [
          "1",
          0
        ]
      },
      "class_type": "ReActorRestoreFace",
      "_meta": {
        "title": "Restore Face 🌌 ReActor"
      }
    },
    "7": {
      "inputs": {
        "width": 512,
        "height": 512,
        "interpolation": "nearest",
        "method": false,
        "condition": "always",
        "multiple_of": 0
      },
      "class_type": "ImageResize+",
      "_meta": {
        "title": "🔧 Image Resize"
      }
    },
    "30": {
      "inputs": {
        "audio": "hello.mp3",
        "start_time": 0,
        "duration": 0
      },
      "class_type": "VHS_LoadAudioUpload",
      "_meta": {
        "title": "Load Audio (Upload)🎥🅥🅗🅢"
      }
    }
  }
