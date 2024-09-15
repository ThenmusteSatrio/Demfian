// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./NFTs.sol";

contract MarketPlace {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isSold;
        uint256 listingId;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => bool) public isListed;
    uint256 public listingCounter;

    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    function listNFT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external returns (uint256) {
        IERC721 nftContract = IERC721(_nftContract);
        require(
            nftContract.ownerOf(_tokenId) == msg.sender,
            "You do not own this NFT"
        );
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
                nftContract.getApproved(_tokenId) == address(this),
            "Marketplace not approved to manage this NFT"
        );

        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            isSold: false,
            listingId: listingCounter
        });

        NFTs(_nftContract).updateStatus(_tokenId, true);
        isListed[listingCounter] = true;

        emit NFTListed(
            listingCounter,
            msg.sender,
            _nftContract,
            _tokenId,
            _price
        );

        return listingCounter;
    }

    function buyNFT(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(msg.value == listing.price, "Incorrect price sent");
        require(!listing.isSold, "NFT already sold");

        listing.isSold = true;

        // Transfer payment to the seller
        payable(listing.seller).transfer(msg.value);

        // Transfer NFT to the buyer
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );

        NFTs(listing.nftContract).updateStatus(listing.tokenId, false);

        emit NFTSold(
            _listingId,
            msg.sender,
            listing.nftContract,
            listing.tokenId,
            listing.price
        );
    }

    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](listingCounter);
        for (uint256 i = 1; i <= listingCounter; i++) {
            if (listings[i].isSold) {
                continue;
            }
            allListings[i - 1] = listings[i];
        }
        return allListings;
    }
}
