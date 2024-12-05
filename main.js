class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addNode(node) {
        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = [];
        }
    }

    addEdge(node1, node2) {
        if (this.adjacencyList[node1] && this.adjacencyList[node2]) {
            this.adjacencyList[node1].push(node2);
            this.adjacencyList[node2].push(node1);
        }
    }
}

class Message {
    constructor(sender, receiver, metadata, body) {
        this.sender = sender;
        this.receiver = receiver;
        this.metadata = metadata;
        this.body = body;
    }
}

class CommunicationSystem {
    constructor(graph) {
        this.graph = graph;
        this.messages = [];
    }

    sendMessage(message) {
        this.messages.push(message);
        console.log(`Encrypted message sent from ${message.sender} to ${message.receiver}`);
    }

    getMessages() {
        return this.messages;
    }
}

// Function to perform modular exponentiation
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// RSA encryption function
function encrypt(message, publicKey, modulus) {
    const messageInt = message.split('').map(char => char.charCodeAt(0));
    return messageInt.map(m => modExp(m, publicKey, modulus));
}

// RSA decryption function
function decrypt(encryptedMessage, privateKey, modulus) {
    const decryptedInt = encryptedMessage.map(c => modExp(c, privateKey, modulus));
    return decryptedInt.map(m => String.fromCharCode(m)).join('');
}

// Example usage
const graph = new Graph();
graph.addNode('Alice');
graph.addNode('Bob');
graph.addNode('Charlie');
graph.addEdge('Alice', 'Bob');
graph.addEdge('Bob', 'Charlie');

const commSystem = new CommunicationSystem(graph);

const publicKey = 65537; // Example public key
const privateKey = 2753; // Example private key
const modulus = 3233; // Example modulus

let messageBody = 'Hello Charlie!';
console.log(`Message to be encrypted: ${messageBody}`);

let encryptedBody = encrypt(messageBody, publicKey, modulus);
console.log(`Message after encryption: ${encryptedBody}`);

const message = new Message('Alice', 'Charlie', { timestamp: Date.now() }, encryptedBody);
commSystem.sendMessage(message);

// Decrypt messages for Charlie
commSystem.getMessages().forEach(msg => {
    if (msg.receiver === 'Charlie') {
        let decryptedBody = decrypt(msg.body, privateKey, modulus);
        console.log(`Decrypted message for Charlie: ${decryptedBody}`);
    }
});
