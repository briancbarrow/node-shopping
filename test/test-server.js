var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var expect = chai.expect();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.not.equal('null');
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Peppers');
                res.body[2].name.should.equal('Tomatoes');
                res.body[3].name.should.equal('Cheese');
                done();
            });
    });
    it('should list items on get', function(done) {
        chai.request(app)
            .get('/items/0')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.body.should.not.equal('null');
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.body.should.not.equal('null');
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.should.have.property('userId');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.users[0].items.should.be.a('array');
                storage.users[0].items.should.have.length(4);
                storage.users[0].items[3].should.be.a('object');
                storage.users[0].items[3].should.have.property('id');
                storage.users[0].items[3].should.have.property('name');
                storage.users[0].items[3].id.should.be.a('number');
                storage.users[0].items[3].name.should.be.a('string');
                storage.users[0].items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/0/2')
            .send({'name': 'Peppe'})
            .end(function(err, res) {
                should.equal(err, null);
                res.body.should.not.equal('null');
                // expect(req).to.have.param('id');
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.should.have.property('userId');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.userId.should.be.a('number');
                Object.keys(storage.users).should.have.length(2);
                res.body.name.should.equal('Peppe');
                storage.users[0].items.should.be.a('array');
                storage.users[0].items.should.have.length('4');
                storage.users[0].items[1].name.should.equal('Peppe');
                storage.users[0].items[1].should.be.a('object');
                storage.users[0].items[1].should.have.property('name');
                storage.users[0].items[1].should.have.property('id');
                storage.users[0].items[1].id.should.be.a('number');
                storage.users[0].items[1].should.have.property('userId');
                storage.users[0].items[1].userId.should.be.a('number');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/0/2')
            .end(function(err, res) {
                should.equal(err, null);
                res.body.should.not.equal('null');
                res.should.be.a('object');
                res.should.be.json;
                res.should.have.status(200);
                res.body.id
                storage.users[0].items.should.not.contain(res.body);
                done();
            });
    });
    it('should fail on PUT with different ID in endpoint than body');
    it('should fail on delete of non-existing id');
    it('should fail on delete without id in endpoint');
});