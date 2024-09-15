// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Account.sol";

contract NFTs is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    address public userManagementContract;
    mapping(address => uint256[]) private _ownedTokens;

    mapping(uint256 => bool) public status;

    constructor(address _userManagementContract) ERC721("NFTs", "NFT") {
        userManagementContract = _userManagementContract;
    }

    function mint(string memory _tokenURI) public returns (uint256) {
        require(
            Account(userManagementContract).isRegistered(msg.sender),
            "User not registered"
        );
        uint256 tokenId = _tokenIdCounter++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _ownedTokens[msg.sender].push(tokenId);

        status[tokenId] = false;

        return tokenId;
    }

    function getStatus(uint256 tokenId) public view returns (bool) {
        return status[tokenId];
    }

    function tokensOfOwner(
        address owner
    ) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function updateStatus(uint256 tokenId, bool _status) public {
        // require(
        //     ownerOf(tokenId) == msg.sender,
        //     "Only the owner can update the status"
        // );
        status[tokenId] = _status;
    }

    function getNFTsByOwner(
        address owner
    )
        public
        view
        returns (
            uint256[] memory tokenIds,
            string[] memory uris,
            bool[] memory statuses
        )
    {
        uint256 totalTokens = totalSupply();
        uint256 ownedCount = 0;

        for (uint256 i = 0; i < totalTokens; i++) {
            if (ownerOf(i) == owner) {
                ownedCount++;
            }
        }

        uint256[] memory ownedTokenIds = new uint256[](ownedCount);
        string[] memory tokenURIs = new string[](ownedCount);
        bool[] memory tokenStatuses = new bool[](ownedCount);

        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalTokens; i++) {
            if (ownerOf(i) == owner) {
                ownedTokenIds[currentIndex] = i;
                tokenURIs[currentIndex] = tokenURI(i);
                tokenStatuses[currentIndex] = status[i];
                currentIndex++;
            }
        }

        return (ownedTokenIds, tokenURIs, tokenStatuses);
    }
}
