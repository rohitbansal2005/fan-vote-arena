// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FanArena {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 voteCountFor;
        uint256 voteCountAgainst;
        uint256 startTime;
        uint256 endTime;
        bool active;
        address creator;
    }

    uint256 public nextProposalId;
    Proposal[] public proposals;

    mapping(uint256 => mapping(address => bool)) public hasVoted; // proposalId => voterAddress => voted

    event ProposalCreated(uint256 id, string title, address creator, uint256 startTime, uint256 endTime);
    event Voted(uint256 proposalId, address voter, bool voteFor);

    constructor() {
        nextProposalId = 0;
    }

    function createProposal(string memory _title, string memory _description, uint256 _votingPeriodInDays) public {
        require(_votingPeriodInDays > 0, "Voting period must be at least 1 day");

        uint256 newProposalId = nextProposalId;
        uint256 _startTime = block.timestamp;
        uint256 _endTime = _startTime + (_votingPeriodInDays * 1 days); // 1 day = 24 hours * 60 minutes * 60 seconds

        proposals.push(Proposal(
            newProposalId,
            _title,
            _description,
            0,
            0,
            _startTime,
            _endTime,
            true, // active by default when created
            msg.sender
        ));
        nextProposalId++;

        emit ProposalCreated(newProposalId, _title, msg.sender, _startTime, _endTime);
    }

    function vote(uint256 _proposalId, bool _voteFor) public {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.active, "Proposal is not active");
        require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Voting is not currently open for this proposal");
        require(!hasVoted[_proposalId][msg.sender], "You have already voted on this proposal");

        if (_voteFor) {
            proposal.voteCountFor++;
        } else {
            proposal.voteCountAgainst++;
        }
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _voteFor);
    }

    function getProposal(uint256 _proposalId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        uint256 voteCountFor,
        uint256 voteCountAgainst,
        uint256 startTime,
        uint256 endTime,
        bool active,
        address creator
    ) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        
        // Update active status based on current time
        bool currentActiveStatus = (block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime);
        
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.voteCountFor,
            proposal.voteCountAgainst,
            proposal.startTime,
            proposal.endTime,
            currentActiveStatus,
            proposal.creator
        );
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            Proposal storage proposal = proposals[i];
            allProposals[i] = Proposal(
                proposal.id,
                proposal.title,
                proposal.description,
                proposal.voteCountFor,
                proposal.voteCountAgainst,
                proposal.startTime,
                proposal.endTime,
                (block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime), // dynamic active status
                proposal.creator
            );
        }
        return allProposals;
    }

    function hasUserVoted(uint256 _proposalId, address _user) public view returns (bool) {
        return hasVoted[_proposalId][_user];
    }
} 