export class ApiFeatures{
    constructor(query,searchString){
        this.query = query
        this.queryString = searchString
        // console.log('API: '+this.query+'string: '+this.queryString.keyword)
    }
    
    searchFeature(){
        // console.log('Hi search')

        const keyword = this.queryString.keyword ?
        {
            name:{
                $regex:this.queryString.keyword,
                $options:"i"
            }
        }:{}


        this.query=this.query.find({...keyword})

        // console.log(this.query)
        
        return this;
    }

    filterFeature(){
        // console.log('Hi filter')
        const queryCopy = {...this.queryString}

        // remove fields for category
        const removeFields = ['keyword','page','limit']

        removeFields.forEach((key)=>{
            delete queryCopy[key]
        })

        let queryStr = JSON.stringify(queryCopy)

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g,(key)=>{
            return `$${key}`
        })

        // console.log(queryStr)
        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    pagination(resultPerPage){
        // console.log('Hi pagination: '+resultPerPage)
        const currentPage = Number(this.queryString.page) || 1
        const skip = resultPerPage*(currentPage-1)
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}
