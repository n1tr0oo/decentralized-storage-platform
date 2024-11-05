const StoragePlatform = artifacts.require("StoragePlatform");

module.exports = function (deployer) {
    deployer.deploy(StoragePlatform);
};
