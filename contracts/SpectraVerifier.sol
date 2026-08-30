// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SpectraVerifier
 * @notice On-chain verification registry for autonomous AI agent execution proofs on 0G Chain.
 * @dev Anchors TEE enclave attestations and 0G Storage Merkle roots directly on 0G Chain.
 */
contract SpectraVerifier {
    struct AttestationProof {
        uint256 agentTokenId;
        address agentAddress;
        bytes32 storageRoot;
        bytes32 dataHash;
        bytes enclaveSignature;
        uint256 blockNumber;
        uint256 timestamp;
        bool verified;
    }

    // Mapping from transaction hash to AttestationProof
    mapping(bytes32 => AttestationProof) public proofs;

    // Authorized TEE signer addresses
    mapping(address => bool) public authorizedSigners;

    address public owner;

    event ProofRegistered(
        bytes32 indexed txHash,
        uint256 indexed agentTokenId,
        address indexed agentAddress,
        bytes32 storageRoot,
        bytes32 dataHash
    );

    event SignerAuthorized(address indexed signer, bool authorized);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedSigners[msg.sender] = true;
    }

    function setAuthorizedSigner(address signer, bool authorized) external onlyOwner {
        authorizedSigners[signer] = authorized;
        emit SignerAuthorized(signer, authorized);
    }

    /**
     * @notice Registers and verifies an agent attestation proof on 0G Chain.
     */
    function registerProof(
        bytes32 txHash,
        uint256 agentTokenId,
        address agentAddress,
        bytes32 storageRoot,
        bytes32 dataHash,
        bytes calldata enclaveSignature
    ) external returns (bool) {
        require(proofs[txHash].timestamp == 0, "Proof already exists");

        // Recover signer from dataHash + storageRoot message
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(txHash, agentTokenId, agentAddress, storageRoot, dataHash))
            )
        );

        address recoveredSigner = recoverSigner(messageHash, enclaveSignature);
        bool isValidSigner = authorizedSigners[recoveredSigner] || recoveredSigner == agentAddress;

        proofs[txHash] = AttestationProof({
            agentTokenId: agentTokenId,
            agentAddress: agentAddress,
            storageRoot: storageRoot,
            dataHash: dataHash,
            enclaveSignature: enclaveSignature,
            blockNumber: block.number,
            timestamp: block.timestamp,
            verified: isValidSigner
        });

        emit ProofRegistered(txHash, agentTokenId, agentAddress, storageRoot, dataHash);
        return isValidSigner;
    }

    /**
     * @notice Verifies a Merkle inclusion proof for a leaf in an agent's 0G Storage root.
     */
    function verifyMerkleProof(
        bytes32 leaf,
        bytes32[] calldata proof,
        bytes32 root,
        uint256 index
    ) external pure returns (bool) {
        bytes32 currentHash = leaf;
        uint256 idx = index;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (idx % 2 == 0) {
                currentHash = sha256(abi.encodePacked(currentHash, proofElement));
            } else {
                currentHash = sha256(abi.encodePacked(proofElement, currentHash));
            }
            idx = idx / 2;
        }

        return currentHash == root;
    }

    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        if (signature.length != 65) return address(0);
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        return ecrecover(messageHash, v, r, s);
    }
}
