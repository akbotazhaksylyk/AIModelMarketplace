let web3;
let contract;
const contractAddress = '0x5cb79b15f97e9ff6a8b17676c93656fd070468d9';
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listModel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ModelListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "ModelPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "ModelRated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			}
		],
		"name": "purchaseModel",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "rateModel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "modelId",
				"type": "uint256"
			}
		],
		"name": "getModelDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "modelCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "models",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalRating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numRatings",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "purchases",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function initWeb3() {
	if (typeof window.ethereum !== 'undefined') {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);
			const accounts = await web3.eth.getAccounts();
			contract = new web3.eth.Contract(contractABI, contractAddress);
			console.log('Connected to MetaMask', accounts[0]);
			await showAvailableModels();
			return true;
		} catch (error) {
			console.error('User denied account access or error occurred:', error);
			return false;
		}
	} else {
		console.log('Please install MetaMask');
		return false;
	}
}

async function fetchModels() {
	if (!web3) {
		console.error('Web3 is not initialized');
		return;
	}
	try {
		console.log('Fetching model count...');
		const modelCount = await contract.methods.modelCount().call();
		console.log('Model count:', modelCount);

		const modelList = document.getElementById('modelList');
		modelList.innerHTML = '';

		for (let i = 1; i <= modelCount; i++) {
			console.log(`Fetching details for model ${i}...`);
			try {
				const model = await contract.methods.getModelDetails(i).call();
				console.log(`Model ${i} details:`, model);

				const modelElement = document.createElement('div');
				modelElement.className = 'model-card';
				modelElement.innerHTML = `
                    <h3>Model ID: ${i} - ${model[0]}</h3>
                    <p>${model[1]}</p>
                    <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
                    <p>Creator: ${model[3]}</p>
                    <p>Average Rating: ${model[4]}</p>
                    <button onclick="purchaseModel(${i})" class="btn btn-secondary">Purchase</button>
                `;
				modelList.appendChild(modelElement);
			} catch (error) {
				console.error(`Error fetching model ${i}:`, error);
			}
		}
	} catch (error) {
		console.error('Error fetching models:', error);
	}
}

async function listModel(event) {
	event.preventDefault();

	if (!window.ethereum) {
		alert('MetaMask is not installed. Please install it to use this dApp.');
		return;
	}

	if (!web3) {
		try {
			await initWeb3();
		} catch (error) {
			console.error('Failed to initialize Web3:', error);
			alert('Failed to connect to MetaMask. Please make sure it is installed and connected.');
			return;
		}
	}

	const name = document.getElementById('modelName').value;
	const description = document.getElementById('modelDescription').value;
	const price = web3.utils.toWei(document.getElementById('modelPrice').value, 'ether');

	try {
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error('No accounts found. Make sure MetaMask is connected.');
		}

		const gasEstimate = await contract.methods.listModel(name, description, price).estimateGas({ from: accounts[0] });
		const result = await contract.methods.listModel(name, description, price).send({
			from: accounts[0],
			gas: Math.floor(gasEstimate * 1.5) // Увеличиваем лимит газа на 50%
		});

		console.log('Transaction result:', result);
		alert('Model listed successfully');
		await fetchModels();
	} catch (error) {
		console.error('Detailed error:', error);
		alert('Error listing model: ' + error.message);
	}
}

async function purchaseModel(modelId) {
	if (!web3) {
		console.error('Web3 is not initialized');
		alert('Please connect to MetaMask first');
		return;
	}
	const accounts = await web3.eth.getAccounts();
	try {
		const model = await contract.methods.getModelDetails(modelId).call();
		await contract.methods.purchaseModel(modelId).send({
			from: accounts[0],
			value: model[2] // Assuming price is the third element in the returned array
		});
		alert('Model purchased successfully!');
		fetchModels(); // Refresh the list of models
	} catch (error) {
		console.error('Error purchasing model:', error);
		alert('Error purchasing model: ' + error.message);
	}
}

async function rateModel(modelId) {
	if (!web3) {
		console.error('Web3 is not initialized');
		alert('Please connect to MetaMask first');
		return;
	}

	const ratingInput = document.getElementById(`rating-${modelId}`);
	if (!ratingInput) {
		alert('Rating input not found');
		return;
	}

	const rating = ratingInput.value;
	if (!rating || rating < 1 || rating > 5) {
		alert('Please enter a valid rating between 1 and 5');
		return;
	}

	const accounts = await web3.eth.getAccounts();
	try {
		await contract.methods.rateModel(modelId, rating).send({ from: accounts[0] });
		alert('Model rated successfully!');
		await showPurchasedModels(); // Обновляем список купленных моделей
	} catch (error) {
		console.error('Error rating model:', error);
		alert('Error rating model: ' + error.message);
	}
}

async function withdrawFunds() {
	const accounts = await web3.eth.getAccounts();
	try {
		const balance = await web3.eth.getBalance(contractAddress);
		if (balance === '0') {
			throw new Error("No funds to withdraw");
		}
		await contract.methods.withdrawFunds().send({ from: accounts[0] });
		alert('Funds withdrawn successfully!');
	} catch (error) {
		console.error('Error withdrawing funds:', error);
		alert('Error withdrawing funds: ' + error.message);
	}
}

async function checkContractBalance() {
	try {
		const balance = await web3.eth.getBalance(contractAddress);
		alert(`Contract balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
	} catch (error) {
		console.error('Error checking contract balance:', error);
		alert('Error checking contract balance: ' + error.message);
	}
}

async function showAvailableModels() {
	const modelList = document.getElementById('modelList');
	if (!modelList) {
		console.error('modelList element not found');
		return;
	}
	modelList.innerHTML = '<p>Loading available models...</p>';
	try {
		const modelCount = await contract.methods.modelCount().call();
		let availableModels = [];
		for (let i = 1; i <= modelCount; i++) {
			const model = await contract.methods.getModelDetails(i).call();
			availableModels.push({ id: i, ...model });
		}
		if (availableModels.length === 0) {
			modelList.innerHTML = '<p>No models available.</p>';
		} else {
			modelList.innerHTML = availableModels.map(model => `
                <div class="model-card">
                    <h3>Model ID: ${model.id} - ${model[0]}</h3>
                    <p>${model[1]}</p>
                    <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
                    <p>Creator: ${model[3]}</p>
                    <p>Average Rating: ${model[4]}</p>
                    <button onclick="purchaseModel(${model.id})" class="btn btn-primary">Purchase</button>
                </div>
            `).join('');
		}
	} catch (error) {
		console.error('Error fetching available models:', error);
		modelList.innerHTML = '<p>Error loading available models. Please try again.</p>';
	}
}

async function showPurchasedModels() {
	const purchasedModelsDiv = document.getElementById('purchasedModels');
	purchasedModelsDiv.style.display = 'block';
	purchasedModelsDiv.innerHTML = '<p>Loading your purchased models...</p>';

	try {
		const accounts = await web3.eth.getAccounts();
		const modelCount = await contract.methods.modelCount().call();
		let purchasedModels = [];

		for (let i = 1; i <= modelCount; i++) {
			const isPurchased = await contract.methods.purchases(accounts[0], i).call();
			if (isPurchased) {
				const model = await contract.methods.getModelDetails(i).call();
				purchasedModels.push({ id: i, ...model });
			}
		}

		if (purchasedModels.length === 0) {
			purchasedModelsDiv.innerHTML = '<p>You have not purchased any models yet.</p>';
		} else {
			purchasedModelsDiv.innerHTML = purchasedModels.map(model => `
                <div class="model-card">
                    <h3>Model ID: ${model.id} - ${model[0]}</h3>
                    <p>${model[1]}</p>
                    <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
                    <p>Creator: ${model[3]}</p>
                    <p>Current Rating: ${model[4]}</p>
                    <input type="number" id="rating-${model.id}" min="1" max="5" placeholder="Rate (1-5)">
                    <button onclick="rateModel(${model.id})" class="btn btn-secondary">Rate</button>
                </div>
            `).join('');
		}
	} catch (error) {
		console.error('Error fetching purchased models:', error);
		purchasedModelsDiv.innerHTML = '<p>Error loading purchased models. Please try again.</p>';
	}
}

async function viewModelDetails() {
	console.log('viewModelDetails function called');
	const modelId = document.getElementById('viewModelId').value;
	const modelDetailsDiv = document.getElementById('modelDetails');

	if (!modelId) {
		alert('Please enter a Model ID');
		return;
	}

	try {
		const model = await contract.methods.getModelDetails(modelId).call();
		console.log('Model details:', model); // Добавьте эту строку для отладки
		modelDetailsDiv.innerHTML = `
            <h3>Model ID: ${modelId}</h3>
            <p>Name: ${model[0]}</p>
            <p>Description: ${model[1]}</p>
            <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
            <p>Creator: ${model[3]}</p>
            <p>Average Rating: ${model[4]}</p>
        `;
	} catch (error) {
		console.error('Error viewing model details:', error);
		modelDetailsDiv.innerHTML = '<p>Error loading model details. Please try again.</p>';
	}
}

function setupEventListeners() {
	const listModelForm = document.getElementById('listModelForm');
	if (listModelForm) {
		listModelForm.addEventListener('submit', listModel);
	}

	const viewDetailsButton = document.getElementById('viewDetailsButton');
	if (viewDetailsButton) {
		console.log('Adding event listener to View Details button');
		viewDetailsButton.addEventListener('click', viewModelDetails);
	} else {
		console.error('View Details button not found');
	}
}

window.addEventListener('load', async () => {
	try {
		const web3Initialized = await initWeb3();
		if (web3Initialized) {
			setupEventListeners();
			await showAvailableModels();
		} else {
			console.error('Web3 initialization failed');
			alert('Failed to connect to MetaMask. Please make sure MetaMask is installed and connected.');
		}
	} catch (error) {
		console.error('Error during initialization:', error);
	}
});

window.addEventListener('scroll', function() {
    var arrow = document.querySelector('.scroll-arrow');
    if (window.scrollY > 100) { // Измените это значение по необходимости
        arrow.style.opacity = '0';
    } else {
        arrow.style.opacity = '1';
    }
});

window.showAvailableModels = showAvailableModels;
window.viewModelDetails = viewModelDetails;
window.checkContractBalance = checkContractBalance;
window.rateModel = rateModel;