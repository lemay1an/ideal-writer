const { TokenExpiredError } = require("jsonwebtoken");
const Pricing = require("../model/pricingModel");
const factory = require("./handlerFactory");

exports.createPricing = factory.createOne(Pricing);
exports.updatePricing = factory.updateOne(Pricing);
exports.getAllPricing = factory.getAll(Pricing);
exports.getPricing = factory.getOne(Pricing);
exports.deletePricing = factory.deleteOne(Pricing);
