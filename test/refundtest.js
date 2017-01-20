contract('fundinghub', function(accounts) {

    //*************************************************************************************************************************
    // test : it should be possible to request a refund from the project after a  contribution has been made to that project
    // 
    // Scenario 
    // --------
    // 1. Create a new project with owner account two
    // 2. Account one makes a contribution
    // 3. Assert that the balance of the account has been decreased by at least 0,01 ether
    // 4. Assert that the raised amount of the project has increased by 0,01 ether
    // 5. Account one requests a refund.
    // 6. Assert that the end balance of the account is higher then start balance
    // 7. Assert that the project raised amount has been decreased by 0,01 ether
    //*************************************************************************************************************************

    it("should be possible to request a refund from a project if contributed", function() {

      var fundingHub = FundingHub.deployed();
      var account_one = accounts[1];
      var account_one_starting_balance;
      var account_one_ending_balance;
      var project_total_raised_before;
      var project_total_raised_after;
      var amount = 10000000000000000; // 0,01 ether
      var id = 998; //project id of the test project

      // first, get the start balances 

      fundingHub.getProjectDetails.call(id, {from: account_one})
      .then(function(values) {
        project_total_raised_before = Number(values[4]);
        return web3.eth.getBalance(account_one);
        }).then(function(balance) {
          account_one_starting_balance = balance.toNumber(); 

          // create a project

          fundingHub.createProject(id, 2000000000000000000, 1, {from: accounts[2], gas: 3000000})
          }).then(function(tx) {
          
          // Make a contribution of 1 ether to the project

          return fundingHub.contribute(id, {from: account_one, value:amount, gas:3000000})
          }).then(function(tx) {

            // get the end balances

            return web3.eth.getBalance(account_one);
            }).then(function(balance) {
                account_one_ending_balance = balance.toNumber(); 
                return fundingHub.getProjectDetails.call(id, {from: account_one})
                .then(function(values) {
                  project_total_raised_after = Number(values[4]);
 
                  // Check if the balance of the account has been decreased by at least 1 ether
                  assert.isAtLeast(account_one_starting_balance - account_one_ending_balance, amount, "test 1: Amount wasn't correctly taken from the sender");

                  // Check if the raised amount of the project has increased by the amount
                  assert.equal(project_total_raised_after, (project_total_raised_before + amount), "test 1: he project has not been funded correctly");

                  // set the start balances again
                  project_total_raised_before = project_total_raised_after;
                  account_one_starting_balance = account_one_ending_balance;

                  // now request a refund from the project
                  return fundingHub.refund(id, {from: account_one, gas: 3000000})
                  .then(function(success) {

                    // get end balances
                    return web3.eth.getBalance(account_one);
                  }).then(function(balance) {
                      account_one_ending_balance = balance.toNumber(); 
                      return fundingHub.getProjectDetails.call(id, {from: account_one})
                      .then(function(values) {
                        project_total_raised_after = Number(values[4]);

                        // assuming transaction cost is not bigger then 1 ether, check if end balance is higher then start balance
                        assert.isAbove(account_one_ending_balance, account_one_starting_balance, "test 1: Amount wasn't correctly refunded to the sender");

                        // Check if the project raised amount has been decreased by 1 ether
                        assert.equal(project_total_raised_after, (project_total_raised_before - amount), "test 1: The project has not been refunding correctly");
                      });
                  });
                });
              });
    });

});