import React from 'react';
import './App.css';


/* ERC71 based Solidity Contract Interface */
import filecoinNFTHack from "./utils/ChefCollection.json";

/* NFT.Storage import for creating an IPFS CID & storing with Filecoin */
import { NFTStorage, File } from "nft.storage";

/* Javascript Lib for evm-compatible blockchain contracts */
import { ethers } from "ethers";



//STORE IN process.env.REACT_APP_CONTRACT_ADDRESS
const CONTRACT_ADDRESS = '0x41BF205d961355C1794A2184AE89eF5A50294623';

//STORE IN process.env.REACT_APP_NFT_STORAGE_API_KEY
const REACT_APP_NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZjNGQ0ODIwODUzNDAyM0YyYzk3MjU3RjQxOEY4NjZCMTkwMTUyMEEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MjI4ODY2NTI3NSwibmFtZSI6ImNvb2tpbmdhcHAifQ.Xt3wa9dTxeqLDfYS22nweeB454Td-L3WrMRGG-4Ne2o'

//Example Polygonscan Link
//https://mumbai.polygonscan.com/address/0x41BF205d961355C1794A2184AE89eF5A50294623

//Example Opensea Link
//https://testnets.opensea.io/assets/mumbai/0x41bf205d961355c1794a2184ae89ef5a50294623/1



class App extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			image: null,
			imagePreview:null,

			//required data
			name: '',
			description: '',
			quantity: 1,

			//optional data
			background:'',
			type:'',
			difficulty:'',
			sauce:'',
			spices:'',
			vegetable:'',
			accessorie:'',
			color_accessorie:'',
			cooked:'',

			//wallet account
			account: null,

			//form message
			message:'',

			//loading messages
			loading:false,
			loadingMessage:''
		}


		this.handleChangeImage = this.handleChangeImage.bind(this);
		//this.imageUploaded = this.imageUploaded.bind(this)

	    this.handleChangeName = this.handleChangeName.bind(this);
	    this.handleChangeDescription = this.handleChangeDescription.bind(this);
	    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
	    this.handleChangeAttribute = this.handleChangeAttribute.bind(this);
	   	
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.connectWallet = this.connectWallet.bind(this);
	}



	componentDidMount() {
		this.checkIfWalletIsConnected()
	}



	//Connect Wallet
	async connectWallet() {
		try {
			const ethereum = window.ethereum

			if(!ethereum) {
				alert('Get Metamask')
				return
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			})

      		console.log("Connected", accounts[0]);
      		this.setState({account:accounts[0]})
		} catch(error) {
			console.log(error)
		}
	}


	//Check if Wallet is Already Connected
	async checkIfWalletIsConnected() {

		const ethereum = window.ethereum

		if(!ethereum) {
			alert('Get Metamask')
			return
		} else {

			// If already connected, setup listener and fetch NFT collection
			// console.log("We have the ethereum object", ethereum);
			// setUpEventListener();
			// fetchNFTCollection()
		}

		const accounts = await ethereum.request({ method: "eth_accounts" });

		if (accounts.length !== 0) {
			this.setState({account:accounts[0]})
		} else {
			console.log("No authorized account found");
		}
	}



	handleChangeImage(event) {
		if (event.target.files && event.target.files[0]) {
			let img = event.target.files[0];

		    let file_size = img.size;
		    let file_name = img.name;
		    let file_type = img.type;
		    //console.log(file_size, file_name, file_type)


		    //Check for PNG, JPG or 10MB
		    if(file_type == 'image/jpeg' || file_type == 'image/png' || file_type == 'image/gif') {
		    	if(file_size < 10000000) {

					this.setState({
						image:img,
						imagePreview: URL.createObjectURL(img)
					});

		    	}
		    } 

		}
	}

	handleChangeName(event) {
		this.setState({name: event.target.value});
	}

	handleChangeDescription(event) {
		this.setState({description: event.target.value});
	}

	handleChangeAttribute(event) {
		console.log(event)
		this.setState({[event.target.name]: event.target.value});
	}

	handleChangeQuantity(event) {
		let quantity = parseInt(event.target.value)
		this.setState({quantity: quantity});
	}



	handleSubmit(event) {

		//All Data Required
		if(this.state.name && this.state.description && this.state.quantity && this.state.image) {
			this.createNFTData()
			this.setState({message:''})
		} else {
			this.setState({message:'Error. All Form Fields are Required'})
		}
	
		event.preventDefault();
	}



	async createNFTData() {


		this.setState({loading:true, loadingMessage:'Minting...'})

		// Setup NFT.Storage Client
		//process.env.REACT_APP_NFT_STORAGE_API_KEY
		const client = new NFTStorage({
			token: REACT_APP_NFT_STORAGE_API_KEY,
		});

		//console.log(this.state)


		//NFT Data
		let data = {
			name:this.state.name,
			description:this.state.description,
			image:this.state.image,

			external_url:"http://toquenchef.com/",

	        attributes:[
	            {
	                "value":this.state.background,
	                "trait_type":"Background"
	            },
	            {
	                "value":this.state.type,
	                "trait_type":"Type"
	            },
	            {
	                "value":this.state.difficulty,
	                "trait_type":"Difficulty"
	            },
	            {
	                "value":this.state.sauce,
	                "trait_type":"Sauce"
	            },
	            {
	                "value":this.state.spices,
	                "trait_type":"Spices"
	            },
	            {
	                "value":this.state.vegetable,
	                "trait_type":"Vegetable"
	            },
	            {
	                "value":this.state.accessorie,
	                "trait_type":"Accessorie"
	            },
	            {
	                "value":this.state.color_accessorie,
	                "trait_type":"Color Accessorie"
	            },
	            {
	                "value":this.state.cooked,
	                "trait_type":"Cooked"
	            }
	        ],

		}

	
		try {
			await client.store(data)
				.then((metadata) => {

					//MINT WITH METADATA
					console.log(metadata.url)
					this.mintContractNFT(metadata.url)

				})
		} catch (error) {
			console.log(error)
		}


	}




	async mintContractNFT(IPFSurl) {

		try {
			const ethereum = window.ethereum

			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()

				//Connect Contract
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					filecoinNFTHack.abi,
					signer
				)

				const amount = this.state.quantity

				//console.log('MINTING', IPFSurl, amount)

				//Mint Function
				let nftTxn = await connectedContract.createRecipe(IPFSurl, IPFSurl, amount)


				this.setState({loading:true, loadingMessage:'Mint Complete!'})

				//Event
				// connectedContract.on(
				// 	'NewFilecoinNFTMinted', (from, tokenId, tokenURI) => {
				// 		console.log(from, tokenId.toNumber(), tokenURI)
				// 	}
				// )

			}
		} catch(error) {
			console.log(error)
		}

	}




	//NOT USED - FOR SVG UPLOADING
	// image: new File(
	// 	[`${baseSVG}$</text></svg>`],
	// 	'FilecoinNFTHack.svg',
	// 	{type: 'image/svg+xml'}
	// )

	//NOT USED
	//image: new File([content], "test.png", { type: "image/*" }),

  	//NOT USED - CONVERT TO BASE64
  	//https://www.geeksforgeeks.org/how-to-convert-image-into-base64-string-using-javascript/
	// imageUploaded() {
	// 	let base64String = "";

	//     var file = document.querySelector(
	//         'input[type=file]')['files'][0]
	  
	//     var reader = new FileReader();
	      
	//     reader.onload = function () {
	//         let baseString = reader.result
	//         // base64String = reader.result.replace("data:", "")
	//         //     .replace(/^.+,/, "");

	//         console.log(baseString)
	  
	//     }

	//     reader.readAsDataURL(file);
	// }




	render() {

		return (
			<div style={{minHeight:'100vh'}} className="tiled-background App">

				{this.state.loading &&
				<div style={{position:'fixed', height:'100vh', width:'100vw', backgroundColor:'rgba(100,100,100,.5)'}}>
					<div className='center' style={{color:'white'}}><h1>{this.state.loadingMessage}</h1></div>
				</div>
				}
				

				<header className="container">
					<br/>
					
					<div className='row'>
					<div className="mb-2">
						{!this.state.account &&
							<button onClick={this.connectWallet} className='float-end btn btn-dark'><i className="fas fa-wallet"></i> Connect Wallet</button>
						}
						{this.state.account && 
							<button className='float-end btn btn-secondary'><i className="fas fa-wallet"></i> Wallet is Connected</button>
						}
					</div>
					</div>

					<form style={{backgroundColor:'white', padding:'25px 30px 25px 30px', borderRadius:'12px'}} onSubmit={this.handleSubmit}>
					<div className='row'>

						<div className='col-8'>

						<div className="mb-2">
							<h4><strong>Mint Your Recipe NFT</strong></h4>
						</div>

						<div className="mb-2">
							{this.state.imagePreview &&
								<img style={{maxWidth:'50%'}} src={this.state.imagePreview} />
							}	
							{!this.state.image &&
								<label className="custom-file-upload">
									<input type="file" name="myImage" onChange={this.handleChangeImage}/>
									<i style={{fontSize:'30px'}} className="far fa-image"></i>
									<br/>
									<label><strong>Select an Image (JPG, PNG or GIF)</strong></label>
								</label>
							}
						</div>

						<div className="mb-2">
							<label htmlFor="title" className="form-label"><strong>Recipe Name*</strong></label>
							<input value={this.state.name} onChange={this.handleChangeName} type="text" className="form-control" id="name" placeholder="Slow Cookied Free-Range Fowl with Grilled Porcini Mushrooms" />
						</div>

						<div className="mb-2">
							<label htmlFor="description" className="form-label"><strong>Recipe Description*</strong></label>
							<textarea value={this.state.description} onChange={this.handleChangeDescription} className="form-control" id="description" rows="5" placeholder="A plate to have fun in the evening after the Sunday outing with family or as a couple, to drink with a Pinot noir les Ursulines..."></textarea>
						</div>


						<div className="mb-2">
						<label htmlFor="quantity" className="form-label"><strong>Quantity to Mint</strong></label>
						<select onChange={this.handleChangeQuantity} className="form-select" aria-label="Default select example">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
						</select>
						</div>
						</div>

						<div className='col-4'>


							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Background</strong></label>
							<input value={this.state.background} onChange={this.handleChangeAttribute} name="background" className="form-control form-control-sm" type="text" placeholder="Table" aria-label="" />
							</div>

							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Type</strong></label>
							<input value={this.state.type} onChange={this.handleChangeAttribute} name="type" className="form-control form-control-sm" type="text" placeholder="Fowl Meat" aria-label="" />
							</div>


							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Difficulty</strong></label>
							<input value={this.state.difficulty} onChange={this.handleChangeAttribute} name="difficulty" className="form-control form-control-sm" type="text" placeholder="3/5" aria-label="" />
							</div>

							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Sauce</strong></label>
							<input value={this.state.sauce} onChange={this.handleChangeAttribute} name="sauce" className="form-control form-control-sm" type="text" placeholder="Fowl Bone Reduction with Garlic, Thyme" aria-label="" />
							</div>

							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Spices</strong></label>
							<input value={this.state.spices} onChange={this.handleChangeAttribute} name="spices" className="form-control form-control-sm" type="text" placeholder="Garlic, Thyme, Salt, Pepper" aria-label="" />
							</div>

							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Vegetable</strong></label>
							<input value={this.state.vegetable} onChange={this.handleChangeAttribute} name="vegetable" className="form-control form-control-sm" type="text" placeholder="Snow Peas, Candied Noirmouttier Potatoes, Parsnips. " aria-label="" />
							</div>


							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Accessory</strong></label>
							<input value={this.state.accessorie} onChange={this.handleChangeAttribute} name="accessorie" className="form-control form-control-sm" type="text" placeholder="Plate" aria-label="" />
							</div>


							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Color Acccesory</strong></label>
							<input value={this.state.color_accessorie} onChange={this.handleChangeAttribute} name="color_accessorie" className="form-control form-control-sm" type="text" placeholder="White" aria-label="" />
							</div>

							<div className="mb-2">
							<label htmlFor="quantity" className="form-label"><strong>Cooked</strong></label>
							<input value={this.state.cooked} onChange={this.handleChangeAttribute} name="cooked" className="form-control form-control-sm" type="text" placeholder="Pan and Cooker" aria-label="" />
							</div>


						</div>

						<div className='col-12'>
						<div className="mb-2">
							<hr/>
							<button type="submit" className='float-end btn btn-danger'><i className="fas fa-utensils"></i> SUBMIT FOR MINTING</button>
							<p style={{color:'#dc3545'}}>{this.state.message}</p>
						</div>
						</div>
					</div>
					</form>

					
				</header>
			</div>
		);

	}

}

export default App;




// <div className="mb-3">
// 	<div className="dropdown">
// 		<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
// 		Difficulty
// 		</button>
// 		<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
// 			<li><a className="dropdown-item" href="#">Action</a></li>
// 			<li><a className="dropdown-item" href="#">Another action</a></li>
// 			<li><a className="dropdown-item" href="#">Something else here</a></li>
// 		</ul>
// 	</div>
// </div>



