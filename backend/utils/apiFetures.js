const { models } = require("mongoose");

class ApiFetures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,  //regex == regular expression or a  opertor of mongodb
                $options: "i",
            },
        }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = ({ ...this.queryStr })

        //Remove some fields for categories.
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key])


        //Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);


        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }


    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFetures