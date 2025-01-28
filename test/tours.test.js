const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const { getAllTours } = require('../controllers/toursControllers');
const Tour  = require('../models/Tour');
const apiFeature = require('../utils/apiFeature');

describe('getAllTours controller', () => {
  let req, res, TourStub;

  beforeEach(() => {
    req = {
      query: {}
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    TourStub = sinon.stub(Tour, 'find');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return a list of tours with status 200', async () => {
    const mockTours = [{id: 1, name: 'tour 1'}]

    await getAllTours(req, res);

    expect(TourStub.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    console.log(res.json);
    console.log(res.json[0]);
    expect(res.json.args[0][0]).to.deep.equal({
      status: 'success',
      results: mockTours.length,
      data: {
        tours: mockTours
      }
    })
  })

})
