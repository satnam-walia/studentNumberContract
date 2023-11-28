var MyContract = artifacts.require("StudentContract");

module.exports = function(deployer) {
  // étapes de déploiement
  deployer.deploy(MyContract).then(function(instance) {
    console.log("contrat déployé a address:", instance.address);
  }).catch(function(error) {
    console.error("Error deploying contract:", error.message);
  });
};