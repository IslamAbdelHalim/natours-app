const { expect } = require('chai');
const sinon = require('sinon');
const toursController = require('../controllers/toursControllers');
const Tour = require('../models/Tour');

describe('Tours Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    next = sinon.spy();
  });

  it('should return a list of tours', async () => {
    const tours = [{ id: 1, name: 'Tour 1' }];
    sinon.stub(toursController, 'getAllTours').returns(Promise.resolve(tours));

    await toursController.getAllTours(req, res, next);
    expect(res.json.calledWith(tours)).to.be.true;
  });

  it('should handle error when fetching tours', async () => {
    sinon
      .stub(toursController, 'getAllTours')
      .returns(Promise.reject(new Error('Error fetching tours')));

    await toursController.getAllTours(req, res, next);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: 'Error fetching tours' })).to.be.true;
  });
  describe('Tours Controller', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: {}, body: {} };
      res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      next = sinon.spy();
    });

    it('should create a new tour', async () => {
      const tour = { id: 1, name: 'New Tour' };
      sinon.stub(Tour, 'create').returns(Promise.resolve(tour));

      await toursController.createNewTour(req, res, next);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ status: 'success', data: { tour } })).to.be
        .true;
    });

    it('should get a tour by id', async () => {
      const tour = { id: 1, name: 'Tour 1' };
      req.params.id = 1;
      sinon.stub(Tour, 'findById').returns(Promise.resolve(tour));

      await toursController.getTourById(req, res, next);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ status: 'success', data: { tour } })).to.be
        .true;
    });

    it('should update a tour by id', async () => {
      const tour = { id: 1, name: 'Updated Tour' };
      req.params.id = 1;
      req.body = { name: 'Updated Tour' };
      sinon.stub(Tour, 'findByIdAndUpdate').returns(Promise.resolve(tour));

      await toursController.updateTourById(req, res, next);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Update this tour', tour })).to.be
        .true;
    });

    it('should delete a tour by id', async () => {
      const tour = { id: 1, name: 'Tour 1' };
      req.params.id = 1;
      sinon.stub(Tour, 'findByIdAndDelete').returns(Promise.resolve(tour));

      await toursController.deleteTourById(req, res, next);
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.json.calledWith({ message: 'Deleted' })).to.be.true;
    });

    it('should get tour statistics', async () => {
      const statistics = [{ _id: 'easy', numTour: 1, avgRating: 4.5 }];
      sinon.stub(Tour, 'aggregate').returns(Promise.resolve(statistics));

      await toursController.getStatistics(req, res, next);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'success', statistics })).to.be
        .true;
    });

    it('should get tours in a specific year', async () => {
      const tours = [{ id: 1, name: 'Tour 1' }];
      req.params.year = 2022;
      sinon.stub(Tour, 'aggregate').returns(Promise.resolve(tours));

      await toursController.getToursInYear(req, res, next);
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'success',
          result: tours.length,
          tours,
        }),
      ).to.be.true;
    });

    afterEach(() => {
      sinon.restore();
    });
  });
  afterEach(() => {
    sinon.restore();
  });
});
