// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

    // OpenSea contract_uri
    // {
    //     "name": "OpenSea Creatures",
    //     "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
    //     "image": "data:image/jpeg;base64,[encodedImageData]",
    //     "external_link": "https://openseacreatures.io",
    //     "seller_fee_basis_points": 100, # Indicates a 1% seller fee.
    //     "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721" # Where seller fees will be paid to.
    // }

    // OpenSea nft_uri
    // {
    //     "name":"March Sea Plate #304",
    //     "image":"data:image/jpeg;base64,[encodedImageData]",
    //     "description":"I have created this recipe in 2017 during a summer break in France. Every component in of the dish has a purpose and consideration and my recipe are committed to using sustainable, quality-focussed ingredients.",
    //     "external_url":"http://toquenchef.com/"
    //     "attributes":[
    //         {
    //             "value":"Table",
    //             "trait_type":"Background"
    //         },
    //         {
    //             "value":"Sea Food",
    //             "trait_type":"Type"
    //         },
    //         {
    //             "value":"5",
    //             "trait_type":"Difficulty"
    //         },
    //         {
    //             "value":"Wine Cooked Onion",
    //             "trait_type":"Sauce"
    //         },
    //         {
    //             "value":"Pink Ribbon",
    //             "trait_type":"Spices"
    //         },
    //         {
    //             "value":"Aspergus",
    //             "trait_type":"Vegetable"
    //         },
    //         {
    //             "value":"Long Plate",
    //             "trait_type":"Accessorie"
    //         },
    //         {
    //             "value":"White",
    //             "trait_type":"Color Accessorie"
    //         },
    //         {
    //             "value":"Pan and Wine",
    //             "trait_type":"Cooked"
    //         }
    //     ],
    // }

error NotAdmin();
error DoesNotOwn();

contract ChefCollection is ERC1155 {

    mapping(address => bool) adminAccess;

    address private collection_owner;
    string private collection_uri;
    mapping(uint256 => string) tokenURIs;
    mapping(uint256 => string) recipeURIs;
    uint256 private recipeCount = 0;

    modifier mustBeAdmin()
    {
        if(adminAccess[msg.sender] == false) revert NotAdmin();
        _;
    }

    modifier mustOwn(uint256 recipeId)
    {
        if(ERC1155.balanceOf(msg.sender, recipeId) < 1) revert DoesNotOwn();
        _;
    }

    constructor(address collection_owner_, string memory collection_uri_) public ERC1155("") {
        collection_owner = collection_owner_;
        adminAccess[msg.sender] = true;
        adminAccess[collection_owner_] = true;
        collection_uri = collection_uri_;
    }

    function uri(uint256 recipeId) public view virtual override returns (string memory) {
        return tokenURIs[recipeId];
    }

    function contractURI() public view returns (string memory) {
        return collection_uri;
    }

    function createRecipe(string memory nft_uri_, string memory recipe_uri_, uint256 amount_) public mustBeAdmin() {
        tokenURIs[recipeCount] = nft_uri_;
        recipeURIs[recipeCount] = recipe_uri_;
        _mint(collection_owner, recipeCount++, amount_, msg.data);
    }

    function getRecipe(uint256 recipeId) public view mustOwn(recipeId) returns (string memory) {
        return recipeURIs[recipeId];
    }

    // yes, I know I should use AccessControl.  I'm tired right now.
    function grantAdminAccess(address _newAdmin) public mustBeAdmin()
    {
        adminAccess[_newAdmin] = true;
    }

    function revokeAdminAccess(address _nukedAdmin) public mustBeAdmin()
    {
        adminAccess[_nukedAdmin] = false;
    }
}
