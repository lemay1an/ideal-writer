const Contact = require("../model/contactModel");
const factory = require("./handlerFactory");

exports.makeContact = factory.createOne(Contact);
exports.getAllContact = factory.getAll(Contact);
exports.deleteContact = factory.deleteOne(Contact);
exports.getContact = factory.getOne(Contact);
