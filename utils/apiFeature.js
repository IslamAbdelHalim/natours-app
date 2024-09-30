class APIFeature {
  constructor(query, queryKeys) {
    this.query = query;
    this.queryKeys = queryKeys;
  }

  filter() {
    let queryObj = { ...this.queryKeys };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //remove excludedFields
    excludedFields.forEach((el) => delete queryObj[el]);

    // modify the advanced Search
    let queryString = JSON.stringify(queryObj);
    queryString.replace(/\b(get|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryString);

    //apply the query
    this.query = this.query.find(queryObj);
    return this;
  }

  limitFields() {
    if (this.queryKeys.fields) {
      const fields = this.queryKeys.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-_v');
    }
    return this;
  }

  sort() {
    if (this.queryKeys.sort) {
      const sortedBy = this.queryKeys.sort.split(',').join(' ');
      this.query = this.query.sort(sortedBy);
    }
    return this;
  }

  paginate() {
    const page = this.queryKeys.page || 1;
    const limit = this.queryKeys.limit || 100;

    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}
module.exports = APIFeature;
