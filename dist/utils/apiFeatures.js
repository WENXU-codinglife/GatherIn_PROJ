"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }
    filter() {
        const local_queryObj = { ...this.queryObj };
        const excludedFields = ["page", "sort", "limit", "fields"];
        if (this.queryObj) {
            excludedFields.forEach((el) => {
                delete local_queryObj[el];
            });
        }
        // Filtering
        let queryStr = JSON.stringify(local_queryObj);
        queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryObj.sort) {
            const query_sort = this.queryObj.sort;
            const sortBy = query_sort.split(",").join(" ");
            this.query.sort(sortBy);
        }
        else {
            this.query.sort("-createAt");
        }
        return this;
    }
    limit() {
        if (this.queryObj.fields) {
            const query_fields = this.queryObj.fields;
            const fields = query_fields.split(",").join(" ");
            this.query.select(fields);
        }
        else {
            this.query.select("-__v");
        }
        return this;
    }
    paginate() {
        const page = this.queryObj.page ? +this.queryObj.page : 1;
        const limit = this.queryObj.limit ? +this.queryObj.limit : 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;
