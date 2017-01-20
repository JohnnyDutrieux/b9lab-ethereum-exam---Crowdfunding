pragma solidity ^0.4.2;

import "Project.sol";

contract FundingHub {

	struct ProjectAdr {
		address projectAddress;
	}
	mapping(uint => ProjectAdr) public projects;

	uint[] public ids;

	//*********************************************************************************************************************
	// constructor, will create an initial project.
	//*********************************************************************************************************************
	function FundingHub(
		uint _id,
		uint _amountNeeded,
		uint _timeInHoursForFundRaising) 
	public
	{
		createProject(_id, _amountNeeded, _timeInHoursForFundRaising);
	}	

	//*********************************************************************************************************************
	// createProject()
	// This function should allow a user to add a new project to the FundingHub. The function should deploy a new Project 
	// contract and keep track of its address. It should accept all constructor values that the Project contract requires.
	//*********************************************************************************************************************
	function createProject(
		uint _id,
		uint _amountNeeded,
		uint _timeInHoursForFundRaising) 
	public
	returns (bool succesful)
	{
		// Create a new project
		address newProjectAddress = new Project(msg.sender, _amountNeeded, _timeInHoursForFundRaising);

		// Keep track of the address
		projects[_id] = ProjectAdr({
			projectAddress: newProjectAddress
		});
		ids.push(_id);
		return true;
	}

	//*********************************************************************************************************************
	// contribute(id) 
	// This function allows users to contribute to a Project identified by its id. 
	// contribute calls the fund() function in the individual Project contract and passes on all value attached 
	// to the function call.
	//*********************************************************************************************************************
	function contribute(uint _id)
	payable
	public
	{
		Project p = Project(projects[_id].projectAddress);
		p.fund.value(msg.value)(tx.origin);
	}

	//*********************************************************************************************************************
	// refund(id) 
	// This function allows users to request a refund from a Project identified by its id. 
	//*********************************************************************************************************************
	function refund(uint _id)
	public
	returns (bool succesful)
	{
		Project p = Project(projects[_id].projectAddress);
		return p.refund(msg.sender);
	}

	//*********************************************************************************************************************
	// getProjectCount()
	// This function returns the number of projects
	//*********************************************************************************************************************
	function getProjectCount() 
	public 
	constant 
	returns (uint length) 
	{
		return ids.length;
	}

	//*********************************************************************************************************************
	// getProjectDetails(id) 
	// This function returns the Project details identified by its id. 
	//*********************************************************************************************************************
	function getProjectDetails(uint _id) 
	public 
	constant 
	returns (uint, address, uint, uint, uint, uint) 
	{
		Project p = Project(projects[_id].projectAddress);
		address projectOwner = p.getProjectOwner();
		uint amountNeeded = p.getAmountNeeded();
		uint deadline = p.getDeadline();
		uint amountRaised = p.getAmountRaised();
		uint projectState = p.getProjectState();
		return (_id, projectOwner, amountNeeded, deadline, amountRaised, projectState);
	}

}