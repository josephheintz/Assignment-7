/* Base Structure */
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
    
    sendMessageRLE(message) {
        const compressedBody = runLengthEncode(message.body);
        message.metadata.RLE = true;
        const compressedMessage = new Message(message.sender, message.receiver, message.metadata, compressedBody);
        this.messages.push(compressedMessage);
        console.log(`Compressed message sent from ${compressedMessage.sender} to ${compressedMessage.receiver}`);
    }

    getMessages() {
        return this.messages;
    }
}
/* Base Structure */

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

// Run-length encoding
function runLengthEncode(input) {
    let encoded = '';
    let count = 1;

    for (let i = 1; i <= input.length; i++) {
        if (input[i] === ' ') {
            if (input[i - 1] !== ' ') {
                encoded += input[i - 1] + count;
                count = 1;
            }
            encoded += ' ';
        } else if (input[i] === input[i - 1]) {
            count++;
        } else {
            if (input[i - 1] !== ' ') {
                encoded += input[i - 1] + count;
            }
            count = 1;
        }
    }

    return encoded;
}


// Example usage
const graph = new Graph();
graph.addNode('Alice');
graph.addNode('Bob');
graph.addNode('Charlie');
graph.addEdge('Alice', 'Bob');
graph.addEdge('Bob', 'Charlie');

const commSystem = new CommunicationSystem(graph);

// RLE
const RLEMessage = new Message('Alice', 'Bob', { encrypted: false }, 'Helloooooo Bob!');
commSystem.sendMessageRLE(RLEMessage);

// RSA
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

console.log(commSystem.getMessages());
