import { Schema,model } from "./dbUtils.js";

const blogSchema = new Schema({
    headline:{
        type:String,
        required:[true,"Please enter the blog title"]
    },
    category:{
        type:String,
        required:[true,"Please enter the blog category"]
    },
    description:{
        type:String,
        required:[true,"Please enter the blog description"]
    },
    num_of_views:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisLiked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    disLikes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    image:{
        public_id:{
            type:String,
            default:null
        },
        url:{
            type:String,
            default:"https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg"
        }
    },
    showcaseImages:[
        {
            public_id:{
                type:String,
                default:null
            },
            url:{
                type:String,
                default:null
            }
        }
    ],
    author:{
        type:String,
        default:"Admin"
    }
    
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
})

export const blogModel = model('Blog',blogSchema)