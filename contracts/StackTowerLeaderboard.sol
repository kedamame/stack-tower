// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StackTowerLeaderboard {
    mapping(address => uint256) public bestScore;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 best);

    function submitScore(uint256 score) external {
        bool isNewBest = score > bestScore[msg.sender];
        if (isNewBest) {
            bestScore[msg.sender] = score;
        }
        emit ScoreSubmitted(msg.sender, score, bestScore[msg.sender]);
    }
}
