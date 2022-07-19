// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/** @title A voting system smart contract
  * @author Alyra Web3 training school
  * @notice You can use this contract to create a voting process supervised by an administrator
  * @dev Owner has the ability to change workflow status and go deeper in the voting process after adding new addresses as potential voters
  * @custom:experimental This is an experimental contract used in a teachable environment
  */
contract Voting is Ownable {

    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address _voterAddress); 
    event WorkflowStatusChange(WorkflowStatus _previousStatus, WorkflowStatus _newStatus);
    event ProposalRegistered(uint _proposalId, string _description);
    event Voted (address _voterAddress, uint _proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /** @notice Give the ability to get the summary of a voter if you are on the whitelist
      * @param _addr The address of the user you want to get information on
      * @dev Retrieves the value of the struct Voter in mapping voters
      * @return  Voter Struct from voters mapping with boolean isRegistered, boolean hasVoted, and uint votedProposalId
      * @custom:requirement Applicant must be on whitelist to use the function
      */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /** @notice Give the ability to get the summary of a proposal if you are on the whitelist
      * @param _id The index of the proposal you want to get information on in proposalsArray
      * @dev Retrieves the value of the struct Proposal in array proposalsArray
      * @return  Proposa Struct from proposalsArray array with string description and uint voteCount
      * @custom:requirement Applicant must be on whitelist to use the function
      */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: //

    /** @notice Give the owner the ability to register new voters allowing them to make proposals and to vote
      * @param _addr The address of the user you want to add to the voters list
      * @dev This function allow owner to modify the boolean isRegistered to true inside struct Voter in the the mapping Voters
      * @custom:requirement WorkflowStatus must be on RegisteringVoters to be able to add new voters, voter must not already be added
      */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /** @notice Give the registered voters the ability to add new proposal 
      * @param _desc The description (string) of the Proposal you want to add to voting choice, can't be an empty string
      * @dev Add a new struct Proposal in proposals array with string description set as the parameter _desc and uint voteCount set to 0
      * @custom:requirement WorkflowStatus must be on ProposalsRegistrationStarted to be able to add new Proposal, _desc parameter can't be an empty string
      */
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1, _desc);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /** @notice Give the registered voters the ability to vote for a Proposal according to its Id
      * @param _id The uint of the Proposal you want to vote for
      * @dev This function increment the uint voteCount inside the struct Voter of the the proposals array index choosen by _id parameter
      * @custom:requirement WorkflowStatus must be on VotingSessionStarted to be able to vote, voter must not have already voted, id must exist
      */
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
          winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /** @notice Give the owner the ability to start the proposals registering process for eligible voters
      * @dev Change enum WorkflowStatus to ProposalsRegistrationStarted (1)
      * @custom:requirement WorkflowStatus must be on RegisteringVoters to be able to change WorkflowStatus to ProposalsRegistrationStarted
      */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        Proposal memory proposal;
        proposal.description = "Blank vote";
        proposalsArray.push(proposal);
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
        emit ProposalRegistered(0, proposal.description);
    }

    /** @notice Give the owner the ability to end the proposals registering process
      * @dev Change enum WorkflowStatus to ProposalsRegistrationEnded (2)
      * @custom:requirement WorkflowStatus must be on ProposalsRegistrationStarted to be able to change WorkflowStatus to ProposalsRegistrationEnded
      */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /** @notice Give the owner the ability to start the voting process
      * @dev Change enum WorkflowStatus to VotingSessionStarted (3)
      * @custom:requirement WorkflowStatus must be on ProposalsRegistrationEnded to be able to change WorkflowStatus to VotingSessionStarted
      */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /** @notice Give the owner the ability to end the voting process and then the winner is setted and getWinner is usable
      * @dev Change enum WorkflowStatus to VotingSessionEnded (4) and finish the voting process by setting up the final state of uint winningProposalId
      * @custom:requirement WorkflowStatus must be on VotingSessionStarted to be able to change WorkflowStatus to VotingSessionEnded
      */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
}