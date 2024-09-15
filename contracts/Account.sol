// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Account {
    struct User {
        address userAddress;
        string username;
        string imageUrl;
    }

    mapping(address => User) public users;

    event userRegistered(
        address indexed userAddress,
        string username,
        string imageUrl
    );

    function register(
        string calldata _username,
        string calldata _imageUrl
    ) external {
        require(
            bytes(users[msg.sender].username).length == 0,
            "User already registered"
        );

        users[msg.sender] = User({
            userAddress: msg.sender,
            username: _username,
            imageUrl: _imageUrl
        });

        emit userRegistered(msg.sender, _username, _imageUrl);
    }

    function isRegistered(address _userAddress) external view returns (bool) {
        return bytes(users[_userAddress].username).length > 0;
    }

    function getUserDetails(
        address _userAddress
    ) external view returns (address, string memory, string memory) {
        require(
            bytes(users[_userAddress].username).length > 0,
            "User not registered"
        );
        User memory user = users[_userAddress];
        return (user.userAddress, user.username, user.imageUrl);
    }
}
