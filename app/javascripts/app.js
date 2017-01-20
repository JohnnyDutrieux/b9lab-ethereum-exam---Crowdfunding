var accounts;
var account;
var balance;
var projectState = {
      'OPEN' : 0,
      'ELIGIBLEFORREFUND' : 1,
      'CLOSEDPAYOUT' : 2
    };

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var table = document.getElementById("accountoverview");
  var header = table.createTHead();
  var row = header.insertRow(-1);
  row.insertCell(-1).innerHTML = "<b>Account</b>";
  row.insertCell(-1).innerHTML = "<b>Balance (Wei)</b>";

  for (var i = 0; i < accounts.length; i++) {
    var balance = web3.eth.getBalance(accounts[i]);
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = accounts[i] ;
    row.insertCell(-1).innerHTML =  balance;
  }
};

function refreshProjectCount() {
  var fundingHub = FundingHub.deployed();

  fundingHub.getProjectCount.call( {from: account}).then(function(getProjectCount) {
    var projectCount_element = document.getElementById("projectCount");
    projectCount_element.innerHTML = getProjectCount.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error gettingprojectCount; see log.");
  });
};

function createProjectTableHeader() {
      var table = document.getElementById("projects");
      var header = table.createTHead();
      var row = header.insertRow(-1);
      row.insertCell(-1).innerHTML = "<b>Project Id</b>";
      row.insertCell(-1).innerHTML = "<b>Owner Account</b>";
      row.insertCell(-1).innerHTML = "<b>Amount Needed (Wei)</b>";
      row.insertCell(-1).innerHTML = "<b>Hours to go before deadline</b>";
      row.insertCell(-1).innerHTML = "<b>Amount Raised (Wei)</b>";
      row.insertCell(-1).innerHTML = "<b>Status</b>";
 };

function createProjectTableRow(projectId, projectOwner, amountNeeded, deadline, amountRaised, state) {
    var htmlButtonFund = "<button id = 'send' onclick='fundProject("  + projectId + ")'>Fund</button>";
    var htmlButtonRefund = "<button id = 'send' onclick='refundProject("  + projectId + ")'>Request refund</button>";
   // build table
    var table = document.getElementById("projects");
    var row = table.insertRow(-1);
    row.insertCell(-1).innerHTML = projectId;  
    row.insertCell(-1).innerHTML = projectOwner;  
    row.insertCell(-1).innerHTML = amountNeeded;  
    if  (state == projectState.OPEN ) {
      row.insertCell(-1).innerHTML = deadline;  
    } else {
      row.insertCell(-1).innerHTML = "-";
    };
    row.insertCell(-1).innerHTML = amountRaised ; 
    switch (state) {
    case projectState.OPEN :
        row.insertCell(-1).innerHTML = "Open" ; 
        break;
    case projectState.ELIGIBLEFORREFUND :
        row.insertCell(-1).innerHTML = "Eligible for refund" ; 
        break;
    case projectState.CLOSEDPAYOUT :
        row.insertCell(-1).innerHTML = "Closed, payout" ; 
        break;
    default :
        break;
      }
    if  (state == projectState.OPEN ) {
      row.insertCell(-1).innerHTML = htmlButtonFund ;  
    };
    if (state == projectState.ELIGIBLEFORREFUND ) {
        row.insertCell(-1).innerHTML = htmlButtonRefund ;  
    };
}

function refreshProjects() {
  var fundingHub = FundingHub.deployed();
  var projectAddress;
  var id;
  var projectAmountNeeded;
 
 
  fundingHub.getProjectCount.call( {from: account}).then(function(getProjectCount) {
    if (getProjectCount.valueOf() > 0) {
        createProjectTableHeader();
        for (var i = 0; i < getProjectCount.valueOf(); i++) {
           fundingHub.ids(i)
            .then(function (id) {
                   fundingHub.getProjectDetails.call( id, {from: account})
                    .then(function(values) {
                      var projectId = values[0];
                      var projectOwner = values[1];
                      var amountNeeded = Number(values[2]);
                      var deadline = Math.round(((Number(values[3]) * 1000) - Date.now()) / (1000*60*60));
                      var amountRaised = Number(values[4]);
                      var projectState = Number(values[5]);
                      createProjectTableRow(projectId, projectOwner, amountNeeded, deadline, amountRaised, projectState);
                    }).catch(function(e) {
                      console.log(e);
                      setStatus("Error getProjectDetails; see log.");
                    });  
            }).catch(function (e) {
                console.error(e);
                setStatus("Error project; see log.");
            });
       };
    };
  }).catch(function(e) {
    console.log(e);
    setStatus("Error gettingprojectCount; see log.");
  });  
};


function createProject() {
  var fundingHub = FundingHub.deployed();
  var projectId = document.getElementById("projectId").value;
  var ownerAccount = document.getElementById("ownerAccount").value;
  var amountNeeded = parseInt(document.getElementById("amountNeeded").value);
  var durationInHours = document.getElementById("deadline").value;
  setStatus("Creating project ... (please wait)");
  fundingHub.createProject(projectId, amountNeeded,durationInHours, {from: ownerAccount, gas: 3000000}).then(function(tx) {
    setStatus("project created!");
    location.reload(true);
  }).catch(function(e) {
   console.log(e);
    alert(e);
    setStatus("Error in create project; see log.");
  });
};

function fundProject(_projectId) {
  var fundingHub = FundingHub.deployed();
  var amountSend = parseInt(document.getElementById("amountSend").value);
  var sender = document.getElementById("sender").value;
  setStatus("Fund project ... (please wait)");
  fundingHub.contribute(_projectId, {from: sender, value:amountSend, gas:3000000}).then(function(tx) {
    setStatus("Funding succes!");
    location.reload(true);
  }).catch(function(e) {
   console.log(e);
    alert(e);
    setStatus("Error in fundProject; see log.");
  });;
}

function refundProject(_projectId) {
  var fundingHub = FundingHub.deployed();
  var retriever = document.getElementById("retriever").value;
  setStatus("Retrieving funds ... (please wait)");
  fundingHub.refund(_projectId, {from: retriever, gas: 3000000}).then(function(success) {
    if (success) {
    setStatus("Refund succes!");
  } else {
    setStatus("Refund failed");
  };
  location.reload(true);
  }).catch(function(e) {
   console.log(e);
    alert(e);
    setStatus("Error in fundProject; see log.");
  });;
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }
    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
    accounts = accs;
    account = accounts[0];
    refreshBalance();
    refreshProjects();
  });
}
